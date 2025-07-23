import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../../icon/icon.module';
import { AvatarComponent } from '../../../avatar/avatar.component';
import { ButtonComponent } from '../../../button/button.component';
import { ProfileResponse, ProfileService } from 'src/app/services/auth/profile.service';
import { UserCircleIcon } from '../../../icon/sidebar/user-circle';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipComponent } from '../../../tooltip/insurance-popover.component';
import { SkeletonModule } from 'primeng/skeleton';


interface TooltipState {
  isVisible: boolean;
  text: string;
}

interface TooltipStates {
  profile: TooltipState;
  bisnis: TooltipState;
  alamat: TooltipState;
  notifikasi: TooltipState;
  activity: TooltipState;
  toggleSidebar: TooltipState;
}

@Component({
  selector: 'app-sidebar-profile',
  standalone: true,
  imports: [
    CommonModule,
    IconModule,
    AvatarComponent,
    UserCircleIcon,
    RouterLink,
    RouterLinkActive,
    TooltipComponent,
    SkeletonModule
  ],
  templateUrl: './sidebar-profile.component.html',
})
export class SidebarProfileComponent implements OnInit {
  isCollapsed = false;
  isMobileView = false;
  userName = '';
  userRole = '';
  profileData: ProfileResponse['data'] | null = null;

  constructor(private profileService: ProfileService) {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const width = window.innerWidth;
    this.isMobileView = width >= 640 && width <= 900;
    // Auto collapse for tablet view (640-900px)
    if (this.isMobileView) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }

  ngOnInit() {
    this.checkScreenSize();
    
    this.profileService.profile$.subscribe(profileData => {
      if (profileData) {
        this.profileData = profileData;
        this.userName = profileData.name;
        this.userRole = profileData.b2c_role?.role_name?.toString() || '';
      }
    });
  
    this.profileService.fetchProfile().subscribe();
  }

  
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    
  }

  tooltipPosition = { x: 0, y: 0 };
  
  tooltipStates: TooltipStates = {
    profile: { isVisible: false, text: 'Profil & visibilitas' },
    bisnis: { isVisible: false, text: 'Informasi Bisnis' },
    alamat: { isVisible: false, text: 'Daftar Alamat' },
    notifikasi: { isVisible: false, text: 'Notifikasi' },
    activity: { isVisible: false, text: 'Aktivitas login' },
    toggleSidebar: { isVisible: false, text: '' } 
  };

  get toggleSidebarTooltipText(): string {
    return this.isCollapsed ? 'Perbesar' : 'Perkecil';
  }

  showTooltip(event: MouseEvent, key: keyof TooltipStates, placement: 'top' | 'bottom' | 'left' | 'right' = 'right') {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    let x = rect.left;
    let y = rect.top;
  
    switch (placement) {
      case 'top':
        x = rect.left + (rect.width / 2);
        y = rect.top;
        break;
      case 'bottom':
        x = rect.left + (rect.width / 2);
        y = rect.bottom;
        break;
      case 'left':
        x = rect.left;
        y = rect.top + (rect.height / 2);
        break;
      case 'right':
        x = rect.right;
        y = rect.top + (rect.height / 2);
        break;
    }
  
    this.tooltipPosition = { x, y };
    
    // Reset semua tooltip
    (Object.keys(this.tooltipStates) as Array<keyof TooltipStates>).forEach(k => {
      this.tooltipStates[k].isVisible = false;
    });
    
    // Tampilkan tooltip yang dipilih
    this.tooltipStates[key].isVisible = true;
  }

  hideTooltip(key: keyof TooltipStates) {
    this.tooltipStates[key].isVisible = false;
  }

  toggleTooltip(event: MouseEvent, key: keyof TooltipStates, placement: 'top' | 'bottom' | 'left' | 'right' = 'right') {
    if (this.tooltipStates[key].isVisible) {
      this.hideTooltip(key);
    } else {
      this.showTooltip(event, key, placement);
    }
  }
}
