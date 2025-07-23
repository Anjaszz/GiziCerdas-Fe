// services/reminders.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Reminder, 
  CreateReminderRequest,
  Child 
} from '../models/app.models';

@Injectable({
  providedIn: 'root'
})
export class RemindersService {
  private apiService = inject(ApiService);
  
  private remindersSubject = new BehaviorSubject<Reminder[]>([]);
  public reminders$ = this.remindersSubject.asObservable();

  constructor() {}

  // Get reminders for a specific child
  async getReminders(childId: string, params?: { type?: string; isActive?: boolean }): Promise<Reminder[]> {
    try {
      const reminders = await this.apiService.getAsync<Reminder[]>(`/reminders/${childId}`, params);
      this.remindersSubject.next(reminders);
      return reminders;
    } catch (error) {
      console.error('Error fetching reminders:', error);
      throw error;
    }
  }

  // Get all reminders for current user
  async getAllUserReminders(): Promise<Reminder[]> {
    try {
      const reminders = await this.apiService.getAsync<Reminder[]>('/reminders');
      return reminders;
    } catch (error) {
      console.error('Error fetching user reminders:', error);
      throw error;
    }
  }

  // Add new reminder
  async addReminder(reminderData: CreateReminderRequest): Promise<Reminder> {
    try {
      const newReminder = await this.apiService.postAsync<Reminder>('/reminders', reminderData);
      
      // Update local reminders list
      const currentReminders = this.remindersSubject.value;
      this.remindersSubject.next([newReminder, ...currentReminders]);
      
      return newReminder;
    } catch (error) {
      console.error('Error adding reminder:', error);
      throw error;
    }
  }

  // Update reminder
  async updateReminder(reminderId: string, updateData: Partial<CreateReminderRequest>): Promise<Reminder> {
    try {
      const updatedReminder = await this.apiService.putAsync<Reminder>(`/reminders/${reminderId}`, updateData);
      
      // Update local reminders list
      const currentReminders = this.remindersSubject.value;
      const updatedReminders = currentReminders.map(reminder => 
        reminder._id === reminderId ? updatedReminder : reminder
      );
      this.remindersSubject.next(updatedReminders);
      
      return updatedReminder;
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  }

  // Toggle reminder active status
  async toggleReminderStatus(reminderId: string): Promise<Reminder> {
    try {
      const updatedReminder = await this.apiService.patchAsync<Reminder>(`/reminders/${reminderId}/toggle`);
      
      // Update local reminders list
      const currentReminders = this.remindersSubject.value;
      const updatedReminders = currentReminders.map(reminder => 
        reminder._id === reminderId ? updatedReminder : reminder
      );
      this.remindersSubject.next(updatedReminders);
      
      return updatedReminder;
    } catch (error) {
      console.error('Error toggling reminder status:', error);
      throw error;
    }
  }

  // Mark reminder as triggered
  async triggerReminder(reminderId: string): Promise<void> {
    try {
      await this.apiService.postAsync(`/reminders/${reminderId}/trigger`);
      
      // Update lastTriggered in local data
      const currentReminders = this.remindersSubject.value;
      const updatedReminders = currentReminders.map(reminder => 
        reminder._id === reminderId 
          ? { ...reminder, lastTriggered: new Date().toISOString() }
          : reminder
      );
      this.remindersSubject.next(updatedReminders);
      
    } catch (error) {
      console.error('Error triggering reminder:', error);
      throw error;
    }
  }

  // Delete reminder
  async deleteReminder(reminderId: string): Promise<void> {
    try {
      await this.apiService.deleteAsync(`/reminders/${reminderId}`);
      
      // Remove from local reminders list
      const currentReminders = this.remindersSubject.value;
      const filteredReminders = currentReminders.filter(reminder => reminder._id !== reminderId);
      this.remindersSubject.next(filteredReminders);
      
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }

  // Get reminders for today
  getTodaysReminders(reminders: Reminder[]): Reminder[] {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return reminders.filter(reminder => 
      reminder.isActive && reminder.days.includes(today as any)
    );
  }

  // Get upcoming reminders (next 24 hours)
  getUpcomingReminders(reminders: Reminder[]): Reminder[] {
    const todaysReminders = this.getTodaysReminders(reminders);
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    
    return todaysReminders.filter(reminder => {
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const reminderTimeMinutes = hours * 60 + minutes;
      return reminderTimeMinutes >= currentTimeMinutes;
    }).sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });
  }

  // Get overdue reminders
  getOverdueReminders(reminders: Reminder[]): Reminder[] {
    const todaysReminders = this.getTodaysReminders(reminders);
    const now = new Date();
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
    
    return todaysReminders.filter(reminder => {
      const [hours, minutes] = reminder.time.split(':').map(Number);
      const reminderTimeMinutes = hours * 60 + minutes;
      
      // Check if reminder time has passed and not triggered today
      if (reminderTimeMinutes < currentTimeMinutes) {
        const lastTriggered = reminder.lastTriggered ? new Date(reminder.lastTriggered) : null;
        const today = new Date();
        
        // If not triggered today, it's overdue
        return !lastTriggered || 
               lastTriggered.toDateString() !== today.toDateString();
      }
      return false;
    });
  }

  // Get reminder type info
  getReminderTypeInfo(type: string): { icon: string; color: string; label: string; description: string } {
    switch (type) {
      case 'meal':
        return {
          icon: '🍽️',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          label: 'Makan',
          description: 'Pengingat waktu makan'
        };
      case 'vitamin':
        return {
          icon: '💊',
          color: 'bg-green-100 text-green-800 border-green-200',
          label: 'Vitamin',
          description: 'Pengingat minum vitamin/suplemen'
        };
      case 'checkup':
        return {
          icon: '🩺',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Checkup',
          description: 'Pengingat kontrol kesehatan'
        };
      case 'medication':
        return {
          icon: '💉',
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Obat',
          description: 'Pengingat minum obat'
        };
      case 'exercise':
        return {
          icon: '🏃',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Olahraga',
          description: 'Pengingat aktivitas fisik'
        };
      default:
        return {
          icon: '⏰',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Lainnya',
          description: 'Pengingat umum'
        };
    }
  }

  // Format time for display
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  // Format days for display
  formatDays(days: string[]): string {
    const dayNames = {
      'monday': 'Sen',
      'tuesday': 'Sel',
      'wednesday': 'Rab',
      'thursday': 'Kam',
      'friday': 'Jum',
      'saturday': 'Sab',
      'sunday': 'Min'
    };

    if (days.length === 7) {
      return 'Setiap hari';
    }
    
    if (days.length === 5 && !days.includes('saturday') && !days.includes('sunday')) {
      return 'Hari kerja';
    }
    
    if (days.length === 2 && days.includes('saturday') && days.includes('sunday')) {
      return 'Weekend';
    }

    return days.map(day => dayNames[day as keyof typeof dayNames]).join(', ');
  }

  // Check if reminder is active today
  isActiveToday(reminder: Reminder): boolean {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return reminder.isActive && reminder.days.includes(today as any);
  }

  // Get time until next reminder
  getTimeUntilNext(reminder: Reminder): string {
    if (!this.isActiveToday(reminder)) {
      return 'Tidak aktif hari ini';
    }

    const [hours, minutes] = reminder.time.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    if (reminderTime <= now) {
      // If time has passed today, show next occurrence
      const tomorrow = new Date(reminderTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const diff = tomorrow.getTime() - now.getTime();
      const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
      return `${hoursUntil} jam lagi`;
    } else {
      const diff = reminderTime.getTime() - now.getTime();
      const hoursUntil = Math.floor(diff / (1000 * 60 * 60));
      const minutesUntil = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hoursUntil > 0) {
        return `${hoursUntil} jam ${minutesUntil} menit lagi`;
      } else {
        return `${minutesUntil} menit lagi`;
      }
    }
  }

  // Get reminders by type
  getRemindersByType(reminders: Reminder[]): { [key: string]: Reminder[] } {
    return reminders.reduce((acc, reminder) => {
      if (!acc[reminder.type]) {
        acc[reminder.type] = [];
      }
      acc[reminder.type].push(reminder);
      return acc;
    }, {} as { [key: string]: Reminder[] });
  }

  // Get active reminders count
  getActiveRemindersCount(reminders: Reminder[]): number {
    return reminders.filter(reminder => reminder.isActive).length;
  }

  // Clear reminders data
  clearReminders(): void {
    this.remindersSubject.next([]);
  }
}