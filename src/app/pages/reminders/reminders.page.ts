import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  addOutline,
  timeOutline,
  createOutline,
  trashOutline,
  playOutline,
  pauseOutline,
  checkmarkCircleOutline,
  warningOutline,
  filterOutline,
  refreshOutline,
  notificationsOutline
} from 'ionicons/icons';
import { RemindersService } from '../../services/reminders.service';
import { ChildrenService } from '../../services/children.service';
import { Reminder, Child } from '../../models/app.models';

// Define the filter type
type FilterType = 'all' | 'active' | 'inactive' | 'today' | 'overdue';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.page.html',
  styleUrls: ['./reminders.page.scss'],
  standalone: true,
  imports: [IonToolbar, 
    CommonModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class RemindersPage implements OnInit {
  private remindersService = inject(RemindersService);
  private childrenService = inject(ChildrenService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  childId: string = '';
  child: Child | null = null;
  allReminders: Reminder[] = [];
  filteredReminders: Reminder[] = [];
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';
  showDeleteConfirm = false;
  reminderToDelete: Reminder | null = null;
  

  // Filter options - define as typed array
  selectedFilter: FilterType = 'all';
  selectedType: string = 'all';
  
  // Define filter options with proper typing
  filterOptions: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Nonaktif' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'overdue', label: 'Terlewat' }
  ];

  // Quick stats
  quickStats = {
    total: 0,
    active: 0,
    todaysReminders: 0,
    upcomingToday: 0,
    overdue: 0
  };

  constructor() {
    addIcons({
      arrowBackOutline,
      addOutline,
      timeOutline,
      createOutline,
      trashOutline,
      playOutline,
      pauseOutline,
      checkmarkCircleOutline,
      warningOutline,
      filterOutline,
      refreshOutline,
      notificationsOutline
    });
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
      
      // Load reminders
      await this.loadReminders();
      
    } catch (error: any) {
      console.error('Error loading reminders data:', error);
      this.showToastMessage('Gagal memuat data pengingat', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async loadReminders() {
    try {
      this.allReminders = await this.remindersService.getReminders(this.childId);
      this.applyFilters();
      this.calculateStats();
    } catch (error) {
      console.error('Error loading reminders:', error);
      throw error;
    }
  }

  calculateStats() {
    this.quickStats.total = this.allReminders.length;
    this.quickStats.active = this.remindersService.getActiveRemindersCount(this.allReminders);
    
    const todaysReminders = this.remindersService.getTodaysReminders(this.allReminders);
    this.quickStats.todaysReminders = todaysReminders.length;
    
    const upcomingToday = this.remindersService.getUpcomingReminders(this.allReminders);
    this.quickStats.upcomingToday = upcomingToday.length;
    
    const overdue = this.remindersService.getOverdueReminders(this.allReminders);
    this.quickStats.overdue = overdue.length;
  }

  applyFilters() {
    let filtered = [...this.allReminders];

    // Apply status filter
    switch (this.selectedFilter) {
      case 'active':
        filtered = filtered.filter(reminder => reminder.isActive);
        break;
      case 'inactive':
        filtered = filtered.filter(reminder => !reminder.isActive);
        break;
      case 'today':
        filtered = this.remindersService.getTodaysReminders(filtered);
        break;
      case 'overdue':
        filtered = this.remindersService.getOverdueReminders(filtered);
        break;
    }

    // Apply type filter
    if (this.selectedType !== 'all') {
      filtered = filtered.filter(reminder => reminder.type === this.selectedType);
    }

    // Sort by time
    filtered.sort((a, b) => {
      // Active reminders first
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      // Then by time
      return a.time.localeCompare(b.time);
    });

    this.filteredReminders = filtered;
  }

  async refreshData() {
    await this.loadReminders();
    this.showToastMessage('Data pengingat berhasil diperbarui', 'success');
  }

  // Filter methods - now properly typed
  changeFilter(filter: FilterType) {
    this.selectedFilter = filter;
    this.applyFilters();
  }

  changeTypeFilter(type: string) {
    this.selectedType = type;
    this.applyFilters();
  }

  // Navigation methods
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  goToAddReminder() {
    this.router.navigate(['/reminders', this.childId, 'add']);
  }

  goToEditReminder(reminder: Reminder, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/reminders', this.childId, reminder._id, 'edit']);
  }

  // Reminder actions
  async toggleReminderStatus(reminder: Reminder, event: Event) {
    event.stopPropagation();
    
    try {
      await this.remindersService.toggleReminderStatus(reminder._id);
      this.showToastMessage(
        `Pengingat ${reminder.isActive ? 'dinonaktifkan' : 'diaktifkan'}`,
        'success'
      );
      this.calculateStats();
      this.applyFilters();
    } catch (error: any) {
      this.showToastMessage('Gagal mengubah status pengingat', 'danger');
      console.error('Error toggling reminder:', error);
    }
  }

  async triggerReminder(reminder: Reminder, event: Event) {
    event.stopPropagation();
    
    try {
      await this.remindersService.triggerReminder(reminder._id);
      this.showToastMessage(`Pengingat "${reminder.title}" ditandai selesai`, 'success');
      this.calculateStats();
      this.applyFilters();
    } catch (error: any) {
      this.showToastMessage('Gagal menandai pengingat', 'danger');
      console.error('Error triggering reminder:', error);
    }
  }

  // Delete confirmation
  confirmDelete(reminder: Reminder, event: Event) {
    event.stopPropagation();
    this.reminderToDelete = reminder;
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.reminderToDelete = null;
  }

  async deleteReminder() {
    if (!this.reminderToDelete) return;

    try {
      await this.remindersService.deleteReminder(this.reminderToDelete._id);
      this.showToastMessage(`Pengingat "${this.reminderToDelete.title}" berhasil dihapus`, 'success');
      this.showDeleteConfirm = false;
      this.reminderToDelete = null;
      this.calculateStats();
      this.applyFilters();
    } catch (error: any) {
      this.showToastMessage('Gagal menghapus pengingat', 'danger');
      console.error('Error deleting reminder:', error);
    }
  }

  // Utility methods
  getReminderTypeInfo(type: string) {
    return this.remindersService.getReminderTypeInfo(type);
  }

  formatTime(time: string): string {
    return this.remindersService.formatTime(time);
  }

  formatDays(days: string[]): string {
    return this.remindersService.formatDays(days);
  }

  isActiveToday(reminder: Reminder): boolean {
    return this.remindersService.isActiveToday(reminder);
  }

  getTimeUntilNext(reminder: Reminder): string {
    return this.remindersService.getTimeUntilNext(reminder);
  }

  isOverdue(reminder: Reminder): boolean {
    const overdueReminders = this.remindersService.getOverdueReminders([reminder]);
    return overdueReminders.length > 0;
  }

  formatAge(): string {
    if (!this.child) return '';
    return this.childrenService.formatAge(this.child.birthDate);
  }

  getFilterLabel(filter: string): string {
    const labels = {
      'all': 'Semua',
      'active': 'Aktif',
      'inactive': 'Nonaktif',
      'today': 'Hari Ini',
      'overdue': 'Terlewat'
    };
    return labels[filter as keyof typeof labels] || filter;
  }

  getTypeFilterOptions(): { value: string; label: string; icon: string }[] {
    return [
      { value: 'all', label: 'Semua Jenis', icon: '📋' },
      { value: 'meal', label: 'Makan', icon: '🍽️' },
      { value: 'vitamin', label: 'Vitamin', icon: '💊' },
      { value: 'checkup', label: 'Checkup', icon: '🩺' },
      { value: 'medication', label: 'Obat', icon: '💉' },
      { value: 'exercise', label: 'Olahraga', icon: '🏃' }
    ];
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}