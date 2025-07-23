import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../../icon/icon.module';
import { AvatarComponent } from '../../../avatar/avatar.component';
import { ButtonComponent } from '../../../button/button.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TooltipComponent } from '../../../tooltip/insurance-popover.component';
import { AccountPopupComponent } from "../../pop up/acc-sidebar-popup.component";
import { SkeletonModule } from 'primeng/skeleton';
import { AuthService, LoginResponse } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/auth/token.service';

interface TooltipState {
  isVisible: boolean;
  text: string;
}

interface TooltipStates {
  dashboard: TooltipState;
  draftPaket: TooltipState;
  validasiPesanan: TooltipState;
  pembayaran: TooltipState;
  daftarPesanan: TooltipState;
  cekTarif: TooltipState;
  cekResi: TooltipState;
  toggleSidebar: TooltipState;
}

interface UserInfo {
  brand: string;
  logo: string;
  accountStatus: number;
  isLocked: boolean;
  isSuspended: boolean;
}

enum AccountStatusType {
  INACTIVE = 0,
  ACTIVE = 1,
  LOCKED = 2,
  SUSPENDED = 3
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    IconModule, 
    AvatarComponent,
    RouterLink,
    RouterLinkActive,
    TooltipComponent,
    AccountPopupComponent,
    SkeletonModule
  ],
  templateUrl: './sidebar-dashboard.component.html',
})
export class SidebarComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isMobileView = false;
  brandName = '';
  username = '';
  logoUrl = '';
  accountStatus = 0;
  accPopupOpen = false;
  userInfo: UserInfo | null = null;
  private broadcastChannel: BroadcastChannel;

  tooltipPosition = { x: 0, y: 0 };
  
  tooltipStates: TooltipStates = {
    dashboard: { isVisible: false, text: 'Dashboard' },
    draftPaket: { isVisible: false, text: 'Keranjang' },
    validasiPesanan: { isVisible: false, text: 'Validasi Pesanan' },
    pembayaran: { isVisible: false, text: 'Pembayaran' },
    daftarPesanan: { isVisible: false, text: 'Daftar Pesanan' },
    cekTarif: { isVisible: false, text: 'Cek Tarif' },
    cekResi: { isVisible: false, text: 'Cek Resi' },
    toggleSidebar: { isVisible: false, text: '' }
  };

  get toggleSidebarTooltipText(): string {
    return this.isCollapsed ? 'Perbesar' : 'Perkecil';
  }

  getAccountStatusType(): AccountStatusType {
    if (this.userInfo?.isLocked) {
      return AccountStatusType.LOCKED;
    }
    
    if (this.userInfo?.isSuspended) {
      return AccountStatusType.SUSPENDED;
    }
    
    return this.accountStatus;
  }
  
  // Update the getter for account status text
  get accountStatusText(): string {
    const statusType = this.getAccountStatusType();
    
    switch (statusType) {
      case AccountStatusType.ACTIVE:
        return 'Aktif';
      case AccountStatusType.LOCKED:
        return 'Locked';
      case AccountStatusType.SUSPENDED:
        return 'Suspend';
      default:
        return 'Aktif';
    }
  }

  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.checkScreenSize();
    
    // Initialize broadcast channel
    this.broadcastChannel = new BroadcastChannel('auth_channel');
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const width = window.innerWidth;
    this.isMobileView = width >= 640 && width <= 900;
    if (this.isMobileView) {
      this.isCollapsed = true;
    } else {
      this.isCollapsed = false;
    }
  }

  ngOnInit() {
    this.checkScreenSize();
    this.loadUserData();
    
    // Listen for user login events
    this.authService.userLoginEvent.subscribe(() => {
      // Force reload user data when a new login occurs
      setTimeout(() => this.loadUserData(), 100);
    });
    
    // Set up broadcast channel listener
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'ACCOUNT_STATUS_UPDATED' || 
          event.data.type === 'USER_CHANGED') {
        // Force reload user data
        setTimeout(() => this.loadUserData(), 100);
      }
    };
  }
  
  
  ngOnDestroy() {
  
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
  }
  

  loadUserData() {
    this.brandName = '';
    this.logoUrl = '';
    this.accountStatus = 0;
    this.userInfo = null;
    this.username = '';
    
    // Get user info from token service
    const userInfo = this.tokenService.getUserInfo();
    if (userInfo) {
      this.brandName = userInfo.brand || '';
      this.logoUrl = userInfo.logo || '';
      
      // Add these if they exist in userInfo
      const isLocked = userInfo.isLocked ?? false;
      const isSuspended = userInfo.isSuspended ?? false;
    }
    
    // Get login response to extract account status
    const loginResponse = this.tokenService.getLoginResponse();
    if (loginResponse && loginResponse.data) {
      this.accountStatus = loginResponse.data.status_account;

      this.username = loginResponse.data.users?.account?.username || '';
      
      // Extract is_locked and is_suspended properties
      const isLocked = 
        loginResponse.data.users?.account?.is_locked === true || 
        String(loginResponse.data.users?.account?.is_locked).toLowerCase() === 'true';
        
      const isSuspended = 
        loginResponse.data.users?.account?.is_suspended === true || 
        loginResponse.data.users?.account?.is_suspend === true || 
        String(loginResponse.data.users?.account?.is_suspended).toLowerCase() === 'true' ||
        String(loginResponse.data.users?.account?.is_suspend).toLowerCase() === 'true';
      
      this.userInfo = {
        brand: this.brandName,
        logo: this.logoUrl,
        accountStatus: this.accountStatus,
        isLocked: isLocked,
        isSuspended: isSuspended
      };
    }
  }

  isAccPopupOpen() {
    this.accPopupOpen = !this.accPopupOpen;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  showTooltip(event: MouseEvent, key: keyof TooltipStates, placement: 'top' | 'bottom' | 'left' | 'right' = 'right') {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    let x = rect.left;
    let y = rect.top;
  
    // Specific case for toggleSidebar with manual offset
    if (key === 'toggleSidebar') {
      // Apply manual offset to align perfectly with the chevron icon
      x = rect.right; // Add some space to the right of the chevron
      y = rect.top + (rect.height / 2) - 60; // Fine-tune the vertical position
    } else {
      // Normal positioning for other menu items
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
    }
  
    this.tooltipPosition = { x, y };
    
    // Close other tooltips
    Object.keys(this.tooltipStates).forEach(k => {
      this.tooltipStates[k as keyof TooltipStates].isVisible = false;
    });
    
    // Open the requested tooltip
    this.tooltipStates[key].isVisible = true;
  }

  hideTooltip(key: keyof TooltipStates) {
    this.tooltipStates[key].isVisible = false;
  }
}