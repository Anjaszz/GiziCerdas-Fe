import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  personOutline,
  createOutline,
  lockClosedOutline,
  logOutOutline,
  mailOutline,
  callOutline,
  calendarOutline,
  cameraOutline,
  settingsOutline,
  helpCircleOutline,
  informationCircleOutline,
  checkmarkCircleOutline,
  refreshOutline, arrowForwardOutline } from 'ionicons/icons';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonToolbar, 
    CommonModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class ProfilePage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser: User | null = null;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';
  showLogoutConfirm = false;

  // Profile stats
  profileStats = {
    memberSince: '',
    totalChildren: 0,
    totalRecords: 0,
    lastLogin: ''
  };

  constructor() {
    addIcons({arrowBackOutline,refreshOutline,settingsOutline,cameraOutline,calendarOutline,personOutline,createOutline,mailOutline,checkmarkCircleOutline,callOutline,arrowForwardOutline,lockClosedOutline,helpCircleOutline,informationCircleOutline,logOutOutline});
  }

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    this.isLoading = true;
    try {
      // Get current user from service
      this.currentUser = this.authService.getCurrentUser();
      
      // Refresh user data from API
      if (this.currentUser) {
        this.currentUser = await this.authService.getProfile();
        this.calculateProfileStats();
      } else {
        // If no user, redirect to login
        this.router.navigate(['/login']);
      }
      
    } catch (error: any) {
      console.error('Error loading profile:', error);
      
      if (error.status === 401) {
        this.showToastMessage('Sesi telah berakhir. Silakan login kembali.', 'danger');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        this.showToastMessage('Gagal memuat profil', 'danger');
      }
    } finally {
      this.isLoading = false;
    }
  }

  calculateProfileStats() {
    if (!this.currentUser) return;

    // Calculate member since
    if (this.currentUser.createdAt) {
      const createdDate = new Date(this.currentUser.createdAt);
      this.profileStats.memberSince = this.formatDate(createdDate);
    }

    // TODO: Load actual stats from API
    this.profileStats.totalChildren = 0;
    this.profileStats.totalRecords = 0;
    this.profileStats.lastLogin = this.formatDate(new Date());
  }

  async refreshProfile() {
    await this.loadUserProfile();
    this.showToastMessage('Profil berhasil diperbarui', 'success');
  }

  // Navigation methods
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  goToEditProfile() {
    this.router.navigate(['/profile/edit']);
  }

  goToChangePassword() {
    this.router.navigate(['/profile/change-password']);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }

  goToHelp() {
    this.router.navigate(['/help']);
  }

  goToAbout() {
    this.router.navigate(['/about']);
  }

  // Profile image handling
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showToastMessage('File harus berupa gambar', 'danger');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showToastMessage('Ukuran file maksimal 5MB', 'danger');
        return;
      }
      
      // TODO: Implement image upload
      this.showToastMessage('Fitur upload foto akan segera tersedia', 'warning');
    }
  }

  // Logout confirmation
  confirmLogout() {
    this.showLogoutConfirm = true;
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.showLogoutConfirm = false;
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      this.authService.handleTokenExpiry();
    }
  }

  // Utility methods
  formatDate(date: Date): string {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  formatPhone(phone: string): string {
    if (!phone) return '';
    
    // Format Indonesian phone number
    if (phone.startsWith('+62')) {
      return phone.replace('+62', '0');
    }
    return phone;
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  // Demo features (remove in production)
  showFeatureComingSoon(feature: string) {
    this.showToastMessage(`Fitur ${feature} akan segera tersedia`, 'warning');
  }
}