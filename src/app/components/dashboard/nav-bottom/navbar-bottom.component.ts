import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';
import { RouterModule, Router } from '@angular/router';
import { ProfileResponse, ProfileService } from 'src/app/services/auth/profile.service';
import { TokenService } from 'src/app/services/auth/token.service';
import { LockedAccModalComponent } from "../../modalbox/locked-acc-modal/locked-acc-modal.component";

@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [CommonModule, IconModule, RouterModule, LockedAccModalComponent],
  templateUrl: './navbar-bottom.component.html',
  styleUrls: ['./navbar-bottom.component.scss']
})
export class BottomNavbarComponent implements OnInit {
  isAccountLocked = false;
  isAccountSuspended = false;
  accountStatus = 0;
  lockedmodal = false;
  userName = '';
  userRole = '';
  profileData: ProfileResponse['data'] | null = null;

  ngOnInit(): void {
    this.profileService.profile$.subscribe((profileData) => {
      if (profileData) {
        this.profileData = profileData;
        this.userName = profileData.name;
        // Ubah format role
        this.userRole =
          profileData.b2c_role?.role_name ?? 'Admin';
      }
    });

    this.profileService.fetchProfile().subscribe();
    
    // Get user info from token service
    const userInfo = this.tokenService.getUserInfo();
    if (userInfo) {
      this.isAccountLocked = userInfo.isLocked === true;
      this.isAccountSuspended = userInfo.isSuspended === true;
    }
    
    // Get login response to extract account status
    const loginResponse = this.tokenService.getLoginResponse();
    if (loginResponse && loginResponse.data) {
      this.accountStatus = loginResponse.data.status_account;
      
      // Extract is_locked and is_suspended properties from response
      const isLocked = String(loginResponse.data.users?.account?.is_locked).toLowerCase() === 'true';
      const isSuspended = String(loginResponse.data.users?.account?.is_suspended).toLowerCase() === 'true';
      
      this.isAccountLocked = isLocked;
      this.isAccountSuspended = isSuspended;
    }
  }

  constructor(
    private router: Router,
    private profileService: ProfileService,
    private tokenService: TokenService,
  ) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isAccountRestricted(): boolean {
    return this.isAccountLocked || this.isAccountSuspended;
  }

  // Handle "Buat Kiriman" button click with account status check
  handleBuatKiriman() {
    if (this.isAccountRestricted()) {
      // If account is locked/suspended, show the modal
      this.openLockedModal();
    } else {
      // If account is active, navigate to buat-pesanan page
      this.router.navigate(['/buat-pesanan']);
    }
  }

  openLockedModal() {
    this.lockedmodal = true;
  }
  
  closeLockModal() {
    this.lockedmodal = false;
  }

}