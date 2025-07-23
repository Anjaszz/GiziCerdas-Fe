import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  timeOutline,
  calendarOutline,
  notificationsOutline,
  documentTextOutline,
  saveOutline,
  trashOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { RemindersService } from '../../services/reminders.service';
import { ChildrenService } from '../../services/children.service';
import { CreateReminderRequest, Child, Reminder } from '../../models/app.models';

@Component({
  selector: 'app-edit-reminder',
  templateUrl: './edit-reminder.page.html',
  styleUrls: ['./edit-reminder.page.scss'],
  standalone: true,
  imports: [IonTitle, IonToolbar, 
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class EditReminderPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private remindersService = inject(RemindersService);
  private childrenService = inject(ChildrenService);

  childId: string = '';
  reminderId: string = '';
  child: Child | null = null;
  reminder: Reminder | null = null;
  editReminderForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';
  showDeleteConfirm = false;

  // Original values for comparison
  originalValues = {
    type: '',
    title: '',
    description: '',
    time: '',
    days: [] as string[],
    isActive: true
  };

  // Reminder type options
  reminderTypes = [
    {
      type: 'meal',
      icon: '🍽️',
      label: 'Makan',
      description: 'Pengingat waktu makan utama',
      color: 'border-orange-200 bg-orange-50'
    },
    {
      type: 'vitamin',
      icon: '💊',
      label: 'Vitamin',
      description: 'Pengingat minum vitamin/suplemen',
      color: 'border-green-200 bg-green-50'
    },
    {
      type: 'checkup',
      icon: '🩺',
      label: 'Checkup',
      description: 'Pengingat kontrol kesehatan',
      color: 'border-blue-200 bg-blue-50'
    },
    {
      type: 'medication',
      icon: '💉',
      label: 'Obat',
      description: 'Pengingat minum obat',
      color: 'border-red-200 bg-red-50'
    },
    {
      type: 'exercise',
      icon: '🏃',
      label: 'Olahraga',
      description: 'Pengingat aktivitas fisik',
      color: 'border-purple-200 bg-purple-50'
    },
    {
      type: 'other',
      icon: '⏰',
      label: 'Lainnya',
      description: 'Pengingat umum',
      color: 'border-gray-200 bg-gray-50'
    }
  ];

  // Days options
  daysOptions = [
    { value: 'monday', label: 'Senin', short: 'Sen' },
    { value: 'tuesday', label: 'Selasa', short: 'Sel' },
    { value: 'wednesday', label: 'Rabu', short: 'Rab' },
    { value: 'thursday', label: 'Kamis', short: 'Kam' },
    { value: 'friday', label: 'Jumat', short: 'Jum' },
    { value: 'saturday', label: 'Sabtu', short: 'Sab' },
    { value: 'sunday', label: 'Minggu', short: 'Min' }
  ];

  constructor() {
    addIcons({
      arrowBackOutline,
      timeOutline,
      calendarOutline,
      notificationsOutline,
      documentTextOutline,
      saveOutline,
      trashOutline,
      checkmarkCircleOutline
    });

    this.editReminderForm = this.fb.group({
      type: ['', [Validators.required]],
      title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      time: ['', [Validators.required]],
      days: [[], [Validators.required, Validators.minLength(1)]],
      isActive: [true]
    });
  }

  async ngOnInit() {
    this.childId = this.route.snapshot.paramMap.get('childId') || '';
    this.reminderId = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.childId && this.reminderId) {
      await this.loadData();
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      // Load child data
      this.child = await this.childrenService.getChildById(this.childId);
      
      // Load reminder data
      await this.loadReminderData();
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      
      if (error.status === 404) {
        this.showToastMessage('Data tidak ditemukan', 'danger');
        setTimeout(() => {
          this.router.navigate(['/reminders', this.childId]);
        }, 2000);
      } else {
        this.showToastMessage('Gagal memuat data', 'danger');
      }
    } finally {
      this.isLoading = false;
    }
  }

  async loadReminderData() {
    try {
      // Get all reminders and find the specific one
      const reminders = await this.remindersService.getReminders(this.childId);
      this.reminder = reminders.find(reminder => reminder._id === this.reminderId) || null;
      
      if (this.reminder) {
        // Pre-fill form with current reminder data
        this.editReminderForm.patchValue({
          type: this.reminder.type,
          title: this.reminder.title,
          description: this.reminder.description || '',
          time: this.reminder.time,
          days: [...this.reminder.days],
          isActive: this.reminder.isActive
        });

        // Store original values
        this.originalValues = {
          type: this.reminder.type,
          title: this.reminder.title,
          description: this.reminder.description || '',
          time: this.reminder.time,
          days: [...this.reminder.days],
          isActive: this.reminder.isActive
        };
      } else {
        throw new Error('Reminder not found');
      }
      
    } catch (error) {
      console.error('Error loading reminder:', error);
      throw error;
    }
  }

  // Form controls
  selectType(type: string) {
    this.editReminderForm.patchValue({ type });
  }

  toggleDay(day: string) {
    const currentDays = this.editReminderForm.get('days')?.value || [];
    const dayIndex = currentDays.indexOf(day);
    
    if (dayIndex > -1) {
      currentDays.splice(dayIndex, 1);
    } else {
      currentDays.push(day);
    }
    
    this.editReminderForm.patchValue({ days: currentDays });
  }

  isDaySelected(day: string): boolean {
    const selectedDays = this.editReminderForm.get('days')?.value || [];
    return selectedDays.includes(day);
  }

  selectAllDays() {
    const allDays = this.daysOptions.map(day => day.value);
    this.editReminderForm.patchValue({ days: allDays });
  }

  selectWeekdays() {
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    this.editReminderForm.patchValue({ days: weekdays });
  }

  selectWeekends() {
    const weekends = ['saturday', 'sunday'];
    this.editReminderForm.patchValue({ days: weekends });
  }

  clearDays() {
    this.editReminderForm.patchValue({ days: [] });
  }

  // Form validation helpers
  getFieldError(fieldName: string): string {
    const field = this.editReminderForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} wajib diisi`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} minimal ${field.errors['minlength'].requiredLength} karakter`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} maksimal ${field.errors['maxlength'].requiredLength} karakter`;
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      type: 'Jenis pengingat',
      title: 'Judul pengingat',
      description: 'Deskripsi',
      time: 'Waktu',
      days: 'Hari'
    };
    return labels[fieldName] || fieldName;
  }

  // Form submission
  async onSubmit() {
    if (this.editReminderForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.editReminderForm.value as Partial<CreateReminderRequest>;
        
        await this.remindersService.updateReminder(this.reminderId, formData);
        
        this.showToastMessage(`Pengingat "${formData.title}" berhasil diperbarui!`, 'success');
        
        // Navigate back to reminders list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/reminders', this.childId]);
        }, 2000);
        
      } catch (error: any) {
        this.showToastMessage(
          error.error?.message || 'Gagal memperbarui pengingat. Silakan coba lagi.',
          'danger'
        );
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.editReminderForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Delete functionality
  confirmDelete() {
    this.showDeleteConfirm = true;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  async deleteReminder() {
    if (!this.reminder) return;

    try {
      await this.remindersService.deleteReminder(this.reminderId);
      this.showToastMessage(`Pengingat "${this.reminder.title}" berhasil dihapus`, 'success');
      this.showDeleteConfirm = false;
      
      // Navigate back to reminders list
      setTimeout(() => {
        this.router.navigate(['/reminders', this.childId]);
      }, 2000);
      
    } catch (error: any) {
      this.showToastMessage('Gagal menghapus pengingat', 'danger');
      console.error('Error deleting reminder:', error);
    }
  }

  // Navigation
  goBack() {
    this.router.navigate(['/reminders', this.childId]);
  }

  // Utility methods
  getSelectedTypeInfo() {
    const selectedType = this.editReminderForm.get('type')?.value;
    return this.reminderTypes.find(type => type.type === selectedType);
  }

  formatSelectedDays(): string {
    const selectedDays = this.editReminderForm.get('days')?.value || [];
    return this.remindersService.formatDays(selectedDays);
  }

  formatAge(): string {
    if (!this.child) return '';
    return this.childrenService.formatAge(this.child.birthDate);
  }

  formatReminderCreated(): string {
    if (!this.reminder) return '';
    return new Date(this.reminder.createdAt).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  hasChanges(): boolean {
    if (!this.reminder) return false;
    
    const formData = this.editReminderForm.value;
    return (
      formData.type !== this.originalValues.type ||
      formData.title !== this.originalValues.title ||
      (formData.description || '') !== this.originalValues.description ||
      formData.time !== this.originalValues.time ||
      JSON.stringify(formData.days.sort()) !== JSON.stringify(this.originalValues.days.sort()) ||
      formData.isActive !== this.originalValues.isActive
    );
  }

  getChangeIndicator(): { text: string; color: string } {
    if (!this.hasChanges()) {
      return {
        text: 'Tidak ada perubahan',
        color: 'text-gray-600'
      };
    }
    
    return {
      text: 'Ada perubahan yang belum disimpan',
      color: 'text-orange-600'
    };
  }


  public getReminderTypeInfo(type: string) {

    return this.remindersService.getReminderTypeInfo(type);

  }

  public formatDays(days: string[]): string {

    return this.remindersService.formatDays(days);
  
  }

  compareDays(originalDays: string[], currentDays: string[]): boolean {

    return JSON.stringify(originalDays.sort()) !== JSON.stringify((currentDays || []).sort());

  }

  getFormattedLastTriggered(): string {

    return this.reminder?.lastTriggered

      ? new Date(this.reminder.lastTriggered).toLocaleString('id-ID')

      : '';

  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}