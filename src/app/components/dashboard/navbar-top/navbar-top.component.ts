import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../button/button.component';
import { AvatarComponent } from '../../avatar/avatar.component';
import { IconModule } from '../../icon/icon.module';
import { DropdownComponent } from '../../dropdowns/dropdowns.component';
import {
  ActivityIcon,
  AssignIcon,
  LogoutIcon,
  StarIcon,
} from 'src/app/components/icon/icondropdown';
import { Router, RouterLink } from '@angular/router';
import {
  ProfileResponse,
  ProfileService,
} from 'src/app/services/auth/profile.service';
import { DeviceService } from 'src/app/services/device.service';
import { finalize } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { LockedAccModalComponent } from "../../modalbox/locked-acc-modal/locked-acc-modal.component";
import { TokenService } from 'src/app/services/auth/token.service';
import { AlertService } from '../../alert/alertservice';
import { IonHeader } from "@ionic/angular/standalone";
import { CostumModalV1Component } from "../../modalbox/costum-modal-v1/costum-modal-v1.component";

enum AccountStatusType {
  INACTIVE = 0,
  ACTIVE = 1,
  LOCKED = 2,
  SUSPENDED = 3
}

type DropdownItem = {
  label: string;
  icon?: string;
  shortcut?: string;
  disabled?: boolean;
  hasDivider?: boolean;
  action?: () => void;
};

@Component({
  selector: 'navbar-top',
  standalone: true,
  imports: [IonHeader,
    CommonModule,
    FormsModule,
    ButtonComponent,
    AvatarComponent,
    IconModule,
    DropdownComponent,
    SkeletonModule,
    RouterLink,
    LockedAccModalComponent, CostumModalV1Component],
  templateUrl: './navbar-top.component.html',
})
export class TopNavComponent implements OnInit {
  constructor(
    private router: Router,
    private profileService: ProfileService,
    public deviceService: DeviceService,
    private tokenService: TokenService,
    private toastService: AlertService
  ) {
    const currentProfile = this.profileService.getCurrentProfile();
    if (currentProfile) {
      this.userName = currentProfile.name;
      // Ubah format role
      this.userRole =
        currentProfile.b2c_role?.role_name ?? 'Admin';
    }
  }

  searchQuery = '';
  isLocationPopupOpen = false;
  isNotifPopupOpen = false;
  lockedmodal = false;
  userName = '';
  userRole = '';
  profileData: ProfileResponse['data'] | null = null;
  isDesktopView = window.innerWidth > 640;
  showLogoutModal: boolean = false;
  
  // Account status properties
  isAccountLocked = false;
  isAccountSuspended = false;
  accountStatus = 0;

  @HostListener('window:resize')
  onResize() {
    this.isDesktopView = window.innerWidth > 640;
  }

  ngOnInit() {
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

  // Check if account has restrictions
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

  onCartClick() {
    if (window.innerWidth <= 640) {
      this.router.navigate(['/keranjang']);
    }
  }

  onSearch() {}

  toggleLocationPopup() {
    this.isLocationPopupOpen = !this.isLocationPopupOpen;
  }

  toggleNotifPopup() {
    this.isNotifPopupOpen = !this.isNotifPopupOpen;
  }

  dropdownItems = [
    {
      label: 'Profil',
      icon: AssignIcon,
      shortcut: '›',
      action: () => this.visitprofile(),
    },
    {
      label: 'Keluar',
      icon: LogoutIcon,
      action: () => this.openLogoutModal(),
    },
  ];



  visitprofile() {
    this.router.navigate(['/profile']);
  }

  onNotifClick() {
    if (this.deviceService.isMobile()) {
      // Jika mobile, navigate ke halaman notifikasi
      this.router.navigate(['/notifikasi']);
    } else {
      // Jika desktop, toggle popup
      this.isNotifPopupOpen = !this.isNotifPopupOpen;
    }
  }
 
  openLockedModal() {
    this.lockedmodal = true;
  }
  
  closeLockModal() {
    this.lockedmodal = false;
  }

  
  openLogoutModal() {
    this.showLogoutModal = true;
  }

  handleConfirm() {
     this.profileService.clearProfile();
     localStorage.clear();
     this.router.navigate(['/masuk']);
     this.showLogoutModal = false;
  }

  handleCancel() {
    this.showLogoutModal = false;
  }

  private showErrorToast(message: string) {
    this.toastService.show({
      variant: 'closeicon',
      title: '',
      color: 'error',
      showIcon: false,
      message: message,
      detailText: 'Details',
      duration: 5000,
      position: 'top-center',
    });
  }

}