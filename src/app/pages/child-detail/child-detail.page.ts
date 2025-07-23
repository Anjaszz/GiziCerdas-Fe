import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  createOutline,
  trashOutline,
  scaleOutline,
  restaurantOutline,
  timeOutline,
  statsChartOutline,
  maleOutline,
  femaleOutline,
  calendarOutline,
  documentTextOutline,
  eyeOutline,
  addOutline,
  refreshOutline, arrowForwardOutline } from 'ionicons/icons';
import { ChildrenService } from '../../services/children.service';
import { GrowthService } from '../../services/growth.service';
import { Child, GrowthRecord } from '../../models/app.models';

@Component({
  selector: 'app-child-detail',
  templateUrl: './child-detail.page.html',
  styleUrls: ['./child-detail.page.scss'],
  standalone: true,
  imports: [IonToolbar, 
    CommonModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class ChildDetailPage implements OnInit {
  private childrenService = inject(ChildrenService);
  private growthService = inject(GrowthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  childId: string = '';
  child: Child | null = null;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';
  showDeleteConfirm = false;

  // Quick stats
  quickStats = {
    latestGrowth: null as GrowthRecord | null,
    totalGrowthRecords: 0,
    totalFoodLogs: 0,
    activeReminders: 0
  };

  // Age calculation
  ageDetails = {
    years: 0,
    months: 0,
    totalMonths: 0,
    nextBirthday: ''
  };

  constructor() {
    addIcons({arrowBackOutline,refreshOutline,createOutline,calendarOutline,scaleOutline,restaurantOutline,timeOutline,documentTextOutline,addOutline,statsChartOutline,eyeOutline,arrowForwardOutline,trashOutline,maleOutline,femaleOutline});
  }

  async ngOnInit() {
    this.childId = this.route.snapshot.paramMap.get('id') || '';
    if (this.childId) {
      await this.loadChildDetail();
    }
  }

  async loadChildDetail() {
    this.isLoading = true;
    try {
      // Load child data
      this.child = await this.childrenService.getChildById(this.childId);
      
      if (this.child) {
        this.calculateAgeDetails();
        await this.loadQuickStats();
      }
      
    } catch (error: any) {
      console.error('Error loading child detail:', error);
      
      if (error.status === 404) {
        this.showToastMessage('Anak tidak ditemukan', 'danger');
        setTimeout(() => {
          this.router.navigate(['/children']);
        }, 2000);
      } else {
        this.showToastMessage('Gagal memuat detail anak', 'danger');
      }
    } finally {
      this.isLoading = false;
    }
  }

  async loadQuickStats() {
    if (!this.child) return;

    try {
      // Load growth records to get latest data
      const growthRecords = await this.growthService.getGrowthRecords(this.childId, { limit: 1 });
      this.quickStats.latestGrowth = growthRecords.length > 0 ? growthRecords[0] : null;
      this.quickStats.totalGrowthRecords = growthRecords.length;

      // TODO: Load actual food logs and reminders count from API
      this.quickStats.totalFoodLogs = 0;
      this.quickStats.activeReminders = 0;

    } catch (error) {
      console.error('Error loading quick stats:', error);
    }
  }

  calculateAgeDetails() {
    if (!this.child) return;

    const { years, months } = this.childrenService.calculateAge(this.child.birthDate);
    this.ageDetails.years = years;
    this.ageDetails.months = months;
    this.ageDetails.totalMonths = this.childrenService.calculateAgeInMonths(this.child.birthDate);

    // Calculate next birthday
    const birthDate = new Date(this.child.birthDate);
    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const daysDiff = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    this.ageDetails.nextBirthday = `${daysDiff} hari lagi`;
  }

  async refreshData() {
    await this.loadChildDetail();
    this.showToastMessage('Data berhasil diperbarui', 'success');
  }

  // Navigation methods
  goBack() {
    this.router.navigate(['/children']);
  }

  goToEditChild() {
    this.router.navigate(['/children', this.childId, 'edit']);
  }

  goToGrowthRecords() {
    this.router.navigate(['/growth', this.childId]);
  }

  goToAddGrowthRecord() {
    this.router.navigate(['/growth', this.childId, 'add']);
  }

  goToFoodLogs() {
    this.router.navigate(['/food-logs', this.childId]);
  }

  goToAddFoodLog() {
    this.router.navigate(['/food-logs', this.childId, 'add']);
  }

  goToReminders() {
    this.router.navigate(['/reminders', this.childId]);
  }

  goToReports() {
    this.router.navigate(['/reports', this.childId]);
  }

  // Child selection
  selectAsActiveChild() {
    if (this.child) {
      this.childrenService.setSelectedChild(this.child);
      this.showToastMessage(`${this.child.name} dipilih sebagai anak aktif`, 'success');
    }
  }

  // Delete confirmation
  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  async deleteChild() {
    if (!this.child) return;

    try {
      await this.childrenService.deleteChild(this.childId);
      this.showToastMessage(`${this.child.name} berhasil dihapus`, 'success');
      this.showDeleteConfirm = false;
      
      // Navigate back to children list
      setTimeout(() => {
        this.router.navigate(['/children']);
      }, 2000);
      
    } catch (error: any) {
      this.showToastMessage('Gagal menghapus data anak', 'danger');
      console.error('Error deleting child:', error);
    }
  }

  // Utility methods
  formatAge(): string {
    if (this.ageDetails.years === 0) {
      return `${this.ageDetails.months} bulan`;
    } else if (this.ageDetails.months === 0) {
      return `${this.ageDetails.years} tahun`;
    } else {
      return `${this.ageDetails.years} tahun ${this.ageDetails.months} bulan`;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  getGenderIcon(): string {
    return this.child?.gender === 'male' ? 'male-outline' : 'female-outline';
  }

  getGenderColor(): string {
    return this.child?.gender === 'male' ? 'text-blue-600' : 'text-pink-600';
  }

  getGenderText(): string {
    return this.child?.gender === 'male' ? 'Laki-laki' : 'Perempuan';
  }

  getInitials(): string {
    if (!this.child?.name) return 'U';
    return this.child.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getNutritionStatusText(status: string): string {
    return this.growthService.getNutritionStatusText(status);
  }

  getNutritionStatusColor(status: string): string {
    return this.growthService.getNutritionStatusColor(status);
  }

  getNutritionStatusBadgeColor(status: string): string {
    return this.growthService.getNutritionStatusBadgeColor(status);
  }

  isSelectedChild(): boolean {
    const selectedChild = this.childrenService.getSelectedChild();
    return selectedChild?._id === this.childId;
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}