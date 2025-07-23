// pages/food-logs/food-logs.page.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  addOutline,
  restaurantOutline,
  calendarOutline,
  statsChartOutline,
  createOutline,
  trashOutline,
  eyeOutline,
  filterOutline,
  refreshOutline,
  fitnessOutline,
  timeOutline
} from 'ionicons/icons';
import { FoodLogsService } from '../../services/food-logs.service';
import { FoodService } from '../../services/food.service';
import { ChildrenService } from '../../services/children.service';
import { FoodLog, DailyNutritionSummary } from '../../models/food.models';
import { Child } from '../../models/app.models';

@Component({
  selector: 'app-food-logs',
  templateUrl: './food-logs.page.html',
  styleUrls: ['./food-logs.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class FoodLogsPage implements OnInit {
  private foodLogsService = inject(FoodLogsService);
  private foodService = inject(FoodService);
  private childrenService = inject(ChildrenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  childId: string = '';
  child: Child | null = null;
  foodLogs: FoodLog[] = [];
  dailySummary: DailyNutritionSummary | null = null;
  isLoading = false;
  isLoadingSummary = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';
  showDeleteConfirm = false;
  logToDelete: FoodLog | null = null;

  // Filter and view options
  selectedDate: string = '';
  selectedMealType: string = 'all';
  viewMode: 'list' | 'calendar' = 'list';

  // Quick stats
  quickStats = {
    todayLogs: 0,
    thisWeekLogs: 0,
    loggingStreak: 0,
    averageCalories: 0,
    totalLogs: 0
  };

  // Today's meal completion
  mealCompletion = {
    breakfast: false,
    lunch: false,
    dinner: false,
    snack: false,
    totalMeals: 0
  };

  // Grouped logs for display
  groupedLogs: { date: string; logs: FoodLog[] }[] = [];

  constructor() {
    addIcons({
      arrowBackOutline,
      addOutline,
      restaurantOutline,
      calendarOutline,
      statsChartOutline,
      createOutline,
      trashOutline,
      eyeOutline,
      filterOutline,
      refreshOutline,
      fitnessOutline,
      timeOutline
    });

    this.selectedDate = this.foodLogsService.getCurrentDate();
  }

  async ngOnInit() {
    this.childId = this.route.snapshot.paramMap.get('childId') || '';
    if (this.childId) {
      await this.loadData();
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      // Load child data
      this.child = await this.childrenService.getChildById(this.childId);
      
      // Load food logs
      await this.loadFoodLogs();
      
      // Load today's summary
      await this.loadDailySummary();
      
      // Calculate quick stats
      this.calculateQuickStats();
      
    } catch (error: any) {
      console.error('Error loading food logs data:', error);
      this.showToastMessage('Gagal memuat data food logs', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async loadFoodLogs() {
    try {
      const params: any = {};
      
      if (this.selectedDate) {
        params.date = this.selectedDate;
      }
      
      if (this.selectedMealType !== 'all') {
        params.mealType = this.selectedMealType;
      }

      // Load last 30 days for better overview
      if (!this.selectedDate) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        
        params.startDate = startDate.toISOString().split('T')[0];
        params.endDate = endDate.toISOString().split('T')[0];
      }
      
      this.foodLogs = await this.foodLogsService.getFoodLogs(this.childId, params);
      this.groupLogsByDate();
      this.updateMealCompletion();
      
    } catch (error) {
      console.error('Error loading food logs:', error);
      throw error;
    }
  }

  async loadDailySummary() {
    this.isLoadingSummary = true;
    try {
      this.dailySummary = await this.foodLogsService.getDailyNutritionSummary(
        this.childId, 
        this.selectedDate || this.foodLogsService.getCurrentDate()
      );
    } catch (error) {
      console.error('Error loading daily summary:', error);
      // Don't throw error, daily summary is optional
    } finally {
      this.isLoadingSummary = false;
    }
  }

  calculateQuickStats() {
    const today = this.foodLogsService.getCurrentDate();
    
    // Today's logs
    this.quickStats.todayLogs = this.foodLogs.filter(log => log.date === today).length;
    
    // This week's logs
    const weekRange = this.foodLogsService.getWeekDateRange(new Date());
    this.quickStats.thisWeekLogs = this.foodLogs.filter(log => 
      log.date >= weekRange.start && log.date <= weekRange.end
    ).length;
    
    // Logging streak
    this.quickStats.loggingStreak = this.foodLogsService.calculateLoggingStreak(this.foodLogs);
    
    // Average calories
    this.quickStats.averageCalories = this.foodLogsService.calculateAverageDailyCalories(this.foodLogs);
    
    // Total logs
    this.quickStats.totalLogs = this.foodLogs.length;
  }

  groupLogsByDate() {
    const grouped = this.foodLogsService.groupLogsByDate(this.foodLogs);
    this.groupedLogs = Object.entries(grouped)
      .map(([date, logs]) => ({ date, logs }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  updateMealCompletion() {
    const targetDate = this.selectedDate || this.foodLogsService.getCurrentDate();
    this.mealCompletion = this.foodLogsService.getMealCompletion(this.foodLogs, targetDate);
  }

  async refreshData() {
    await this.loadData();
    this.showToastMessage('Data berhasil diperbarui', 'success');
  }

  // Filter methods
  async changeDate(date: string | undefined) {
    if (!date) return; // validasi jika date undefined/null
    
    this.selectedDate = date;
    await this.loadFoodLogs();
    await this.loadDailySummary();
  }
  

  async changeMealType(mealType: string) {
    this.selectedMealType = mealType;
    await this.loadFoodLogs();
  }

  async clearFilters() {
    this.selectedDate = '';
    this.selectedMealType = 'all';
    await this.loadFoodLogs();
    await this.loadDailySummary();
  }

  // Navigation methods
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  goToAddFoodLog(mealType?: string) {
    const queryParams = mealType ? { mealType } : {};
    this.router.navigate(['/food-logs', this.childId, 'add'], { queryParams });
  }

  goToEditFoodLog(log: FoodLog, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/food-logs', this.childId, log._id, 'edit']);
  }

  goToDailySummary(date: string) {
    this.router.navigate(['/food-logs', this.childId, 'summary', date]);
  }

  goToNutritionNeeds() {
    this.router.navigate(['/food-logs', this.childId, 'nutrition-needs']);
  }

  // Food log actions
  async deleteFoodLog(log: FoodLog, event: Event) {
    event.stopPropagation();
    this.logToDelete = log;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.logToDelete = null;
  }

  async confirmDelete() {
    if (!this.logToDelete) return;

    try {
      await this.foodLogsService.deleteFoodLog(this.logToDelete._id);
      this.showToastMessage('Log makanan berhasil dihapus', 'success');
      this.showDeleteConfirm = false;
      this.logToDelete = null;
      
      // Refresh data
      await this.loadData();
      
    } catch (error: any) {
      this.showToastMessage('Gagal menghapus log makanan', 'danger');
      console.error('Error deleting food log:', error);
    }
  }

  // Utility methods
  getMealTypeInfo(mealType: string) {
    return this.foodService.getMealTypeInfo(mealType);
  }

  getMoodInfo(mood?: string) {
    return this.foodService.getMoodInfo(mood || '');
  }

  getAppetiteInfo(appetite?: string) {
    return this.foodService.getAppetiteInfo(appetite || '');
  }

  formatDate(dateString: string): string {
    return this.foodLogsService.formatDate(dateString);
  }

  getRelativeDate(dateString: string): string {
    return this.foodLogsService.getRelativeDate(dateString);
  }

  isToday(dateString: string): boolean {
    return this.foodLogsService.isToday(dateString);
  }

  formatAge(): string {
    if (!this.child) return '';
    return this.childrenService.formatAge(this.child.birthDate);
  }

  getTotalCaloriesForDate(logs: FoodLog[]): number {
    return logs.reduce((total, log) => total + log.totalNutrition.calories, 0);
  }

  getTotalProteinForDate(logs: FoodLog[]): number {
    return Math.round(logs.reduce((total, log) => total + log.totalNutrition.protein, 0) * 10) / 10;
  }

  getMealTypesForDate(logs: FoodLog[]): string[] {
    return [...new Set(logs.map(log => log.mealType))];
  }

  getComplianceColor(percentage: number): string {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }

  getComplianceBadgeColor(percentage: number): string {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getMealCompletionIcon(completed: boolean): string {
    return completed ? '✅' : '⭕';
  }

  // Wrapper methods for template access (FoodLogsService methods)
  getCurrentDate(): string {
    return this.foodLogsService.getCurrentDate();
  }

  formatDateWrapper(dateString: string): string {
    return this.foodLogsService.formatDate(dateString);
  }

  getRelativeDateWrapper(dateString: string): string {
    return this.foodLogsService.getRelativeDate(dateString);
  }

  isTodayWrapper(dateString: string): boolean {
    return this.foodLogsService.isToday(dateString);
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}