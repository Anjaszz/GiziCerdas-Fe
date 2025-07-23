import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { finalize } from 'rxjs';
import { IconModule } from 'src/app/components/icon/icon.module';
import { ProfileService } from 'src/app/services/auth/profile.service';
import { CostumModalV1Component } from "../../../modalbox/costum-modal-v1/costum-modal-v1.component";

@Component({
  selector: 'app-profile-mobile',
  templateUrl: './profile-mobile.component.html',
  styleUrls: ['./profile-mobile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IconModule,
    RouterLink,
    RouterLinkActive,
    CostumModalV1Component
],
})
export class ProfileMobileComponent  implements OnInit {

  constructor(private profileService : ProfileService, private router: Router,private location: Location) {}

  showLogoutModal = false

  ngOnInit() {}

  goBack(): void {
   this.router.navigate(['/menu']);
  }

  confirmAndLogout(): void {
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
    if (confirmed) {
     localStorage.clear();
     this.router.navigate(['/masuk']);
    }
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

}
