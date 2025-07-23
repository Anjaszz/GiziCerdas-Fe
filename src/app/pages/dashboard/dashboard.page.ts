// pages/dashboard/dashboard.page.ts - Updated with real API
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonContent, IonHeader, IonIcon, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  addOutline,
  scaleOutline,
  restaurantOutline,
  timeOutline,
  personOutline,
  statsChartOutline,
  notificationsOutline,
  settingsOutline,
  refreshOutline,
  trendingUpOutline,
  chevronForwardOutline,
  checkmarkCircleOutline,
  warningOutline
} from 'ionicons/icons';
import { ChildrenService } from '../../services/children.service';
import { RemindersService } from '../../services/reminders.service';
import { DashboardService, DashboardChildStats, DashboardOverview } from '../../services/dashboard.service';
import { Child } from '../../models/app.models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class DashboardPage implements OnInit, OnDestroy {
  private childrenService = inject(ChildrenService);
  private dashboardService = inject(DashboardService);
  private remindersService = inject(RemindersService);
  private router = inject(Router);
  
  private subscriptions: Subscription[] = [];

  // State
  selectedChild: Child | null = null;
  childStats: DashboardChildStats | null = null;
  overview: DashboardOverview | null = null;
  isLoading = false;
  isLoadingStats = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';

  // Quick access data for template
  quickStats = {
    latestWeight: 0,
    latestHeight: 0,
    todayMeals: 0,
    upcomingReminders: 0,
    caloriesProgress: 0,
    proteinProgress: 0
  };

  constructor() {
    addIcons({
      addOutline,
      scaleOutline,
      restaurantOutline,
      timeOutline,
      personOutline,
      statsChartOutline,
      notificationsOutline,
      settingsOutline,
      refreshOutline,
      trendingUpOutline,
      chevronForwardOutline,
      checkmarkCircleOutline,
      warningOutline
    });
  }

  async ngOnInit() {
    await this.loadInitialData();
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private async loadInitialData() {
    this.isLoading = true;
    try {
      // Load overview first
      await this.loadOverview();
      
      // Load selected child if available
      const selectedChild = this.childrenService.getSelectedChild();
      if (selectedChild) {
        await this.loadChildStats(selectedChild._id);
      }
    } catch (error) {
      console.error('Error loading initial dashboard data:', error);
      this.showToastMessage('Gagal memuat data dashboard', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  private setupSubscriptions() {
    // Subscribe to selected child changes
    const childSub = this.childrenService.selectedChild$.subscribe(child => {
      this.selectedChild = child;
      console.log('Selected child changed:', child?.name);
      if (child) {
        this.loadChildStats(child._id);
      } else {
        this.childStats = null;
        this.resetQuickStats();
      }
    });
    this.subscriptions.push(childSub);

    // Subscribe to dashboard stats changes
    const statsSub = this.dashboardService.childStats$.subscribe(stats => {
      this.childStats = stats;
      this.updateQuickStats();
    });
    this.subscriptions.push(statsSub);

    // Subscribe to overview changes
    const overviewSub = this.dashboardService.overview$.subscribe(overview => {
      this.overview = overview;
    });
    this.subscriptions.push(overviewSub);
  }

  async loadOverview() {
    try {
      await this.dashboardService.getOverview();
    } catch (error) {
      console.error('Error loading overview:', error);
      throw error;
    }
  }

  async loadChildStats(childId: string) {
    this.isLoadingStats = true;
    try {
      await this.dashboardService.getChildStats(childId);
    } catch (error) {
      console.error('Error loading child stats:', error);
      this.showToastMessage('Gagal memuat statistik anak', 'danger');
    } finally {
      this.isLoadingStats = false;
    }
  }

  private updateQuickStats() {
    if (!this.childStats) {
      this.resetQuickStats();
      return;
    }

    const stats = this.childStats;
    
    // Growth data
    if (stats.growth.current) {
      this.quickStats.latestWeight = stats.growth.current.weight;
      this.quickStats.latestHeight = stats.growth.current.height;
    }

    // Nutrition data
    this.quickStats.todayMeals = stats.nutrition.today.mealsLogged;
    this.quickStats.caloriesProgress = stats.nutrition.today.compliance.calories;
    this.quickStats.proteinProgress = stats.nutrition.today.compliance.protein;

    // Reminders data
    this.quickStats.upcomingReminders = stats.reminders.upcoming.length;
  }

  private resetQuickStats() {
    this.quickStats = {
      latestWeight: 0,
      latestHeight: 0,
      todayMeals: 0,
      upcomingReminders: 0,
      caloriesProgress: 0,
      proteinProgress: 0
    };
  }

  async refreshData() {
    this.isLoading = true;
    try {
      await this.loadOverview();
      
      if (this.selectedChild) {
        await this.loadChildStats(this.selectedChild._id);
      }
      
      this.showToastMessage('Data berhasil diperbarui', 'success');
    } catch (error) {
      this.showToastMessage('Gagal memperbarui data', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  // Navigation methods
  goToChildren() {
    this.router.navigate(['/children']);
  }

  goToAddChild() {
    this.router.navigate(['/children/add']);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToChildDetail(childId: string) {
    this.router.navigate(['/children', childId]);
  }

  goToGrowthRecords() {
    if (this.selectedChild) {
      this.router.navigate(['/growth', this.selectedChild._id]);
    }
  }

  goToAddGrowthRecord() {
    if (this.selectedChild) {
      this.router.navigate(['/growth', this.selectedChild._id, 'add']);
    }
  }

  goToGrowthChart() {
    if (this.selectedChild) {
      this.router.navigate(['/growth', this.selectedChild._id, 'chart']);
    }
  }

  goToFoodLogs() {
    if (this.selectedChild) {
      this.router.navigate(['/food-logs', this.selectedChild._id]);
    }
  }

  goToAddFoodLog() {
    if (this.selectedChild) {
      this.router.navigate(['/food-logs', this.selectedChild._id, 'add']);
    }
  }

  goToReminders() {
    if (this.selectedChild) {
      this.router.navigate(['/reminders', this.selectedChild._id]);
    }
  }

  goToAddReminder() {
    if (this.selectedChild) {
      this.router.navigate(['/reminders', this.selectedChild._id, 'add']);
    }
  }

  goToReports() {
    if (this.selectedChild) {
      this.router.navigate(['/reports', this.selectedChild._id]);
    }
  }

  // Child selection
  async selectChild(child: any) {
    const childObj: Child = {
      _id: child.id,
      name: child.name,
      birthDate: '', // Will be loaded when needed
      gender: 'male', // Will be loaded when needed
      profileImage: child.profileImage,
      notes: '',
      createdAt: '',
      parentId: '', // Provide the appropriate parentId value
      ageInMonths: 0 // Provide the appropriate ageInMonths value
    };
    
    this.childrenService.setSelectedChild(childObj);
    this.showToastMessage(`${child.name} dipilih sebagai anak aktif`, 'success');
  }

  // Utility methods
  getCurrentTime(): string {
    return new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  }

  formatAge(ageInMonths: number): string {
    const years = Math.floor(ageInMonths / 12);
    const months = ageInMonths % 12;
    
    if (years === 0) {
      return `${months} bulan`;
    } else if (months === 0) {
      return `${years} tahun`;
    } else {
      return `${years} tahun ${months} bulan`;
    }
  }

  getDaysSinceLastGrowthRecord(): number {
    if (!this.childStats?.growth.current) return 0;
    
    const lastRecord = new Date(this.childStats.growth.current.recordDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastRecord.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  shouldShowGrowthWarning(): boolean {
    return this.getDaysSinceLastGrowthRecord() > 30;
  }

  // Service method access for template
  getStatusColor(status: string): string {
    return this.dashboardService.getStatusColor(status);
  }

  getStatusBadgeColor(status: string): string {
    return this.dashboardService.getStatusBadgeColor(status);
  }

  getPriorityIcon(priority: string): string {
    return this.dashboardService.getPriorityIcon(priority);
  }

  getTrendIcon(trend: string): string {
    return this.dashboardService.getTrendIcon(trend);
  }

  getComplianceColor(percentage: number): string {
    return this.dashboardService.getComplianceColor(percentage);
  }

  formatTimeUntilReminder(hoursUntil: number, minutesUntil: number): string {
    return this.dashboardService.formatTimeUntilReminder(hoursUntil, minutesUntil);
  }

  // Reminders service method access for template
  getReminderTypeInfo(type: string) {
    return this.remindersService.getReminderTypeInfo(type);
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}