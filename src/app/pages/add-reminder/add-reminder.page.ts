import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  timeOutline,
  calendarOutline,
  notificationsOutline,
  documentTextOutline,
  saveOutline,
  addOutline
} from 'ionicons/icons';
import { RemindersService } from '../../services/reminders.service';
import { ChildrenService } from '../../services/children.service';
import { CreateReminderRequest, Child } from '../../models/app.models';

@Component({
  selector: 'app-add-reminder',
  templateUrl: './add-reminder.page.html',
  styleUrls: ['./add-reminder.page.scss'],
  standalone: true,
  imports: [IonToolbar, 
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class AddReminderPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private remindersService = inject(RemindersService);
  private childrenService = inject(ChildrenService);

  childId: string = '';
  child: Child | null = null;
  addReminderForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';

  // Form step tracking
  currentStep: 1 | 2 | 3 = 1;

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

  // Quick time presets
  timePresets = [
    { label: 'Sarapan', time: '07:00' },
    { label: 'Makan Siang', time: '12:00' },
    { label: 'Makan Malam', time: '18:00' },
    { label: 'Vitamin Pagi', time: '08:00' },
    { label: 'Vitamin Sore', time: '17:00' },
    { label: 'Olahraga Pagi', time: '06:30' },
    { label: 'Tidur Siang', time: '13:00' }
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
      addOutline
    });

    this.addReminderForm = this.fb.group({
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
    if (this.childId) {
      await this.loadChildData();
    }
  }

  async loadChildData() {
    try {
      this.child = await this.childrenService.getChildById(this.childId);
    } catch (error: any) {
      console.error('Error loading child data:', error);
      this.showToastMessage('Gagal memuat data anak', 'danger');
      this.router.navigate(['/reminders', this.childId]);
    }
  }

  // Step navigation
  nextStep() {
    if (this.currentStep < 3) {
      if (this.isStepValid(this.currentStep)) {
        this.currentStep++;
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 1:
        return !!this.addReminderForm.get('type')?.value;
      case 2:
        return !!this.addReminderForm.get('title')?.value && 
               !!this.addReminderForm.get('time')?.value;
      case 3:
        return this.addReminderForm.get('days')?.value?.length > 0;
      default:
        return false;
    }
  }

  // Form controls
  selectType(type: string) {
    this.addReminderForm.patchValue({ type });
    
    // Auto-fill title based on type
    if (!this.addReminderForm.get('title')?.value) {
      const typeInfo = this.reminderTypes.find(t => t.type === type);
      if (typeInfo) {
        this.addReminderForm.patchValue({ 
          title: `${typeInfo.label} ${this.child?.name || 'Anak'}` 
        });
      }
    }
  }

  selectTimePreset(preset: { label: string; time: string }) {
    this.addReminderForm.patchValue({ 
      time: preset.time,
      title: this.addReminderForm.get('title')?.value || preset.label
    });
  }

  toggleDay(day: string) {
    const currentDays = this.addReminderForm.get('days')?.value || [];
    const dayIndex = currentDays.indexOf(day);
    
    if (dayIndex > -1) {
      currentDays.splice(dayIndex, 1);
    } else {
      currentDays.push(day);
    }
    
    this.addReminderForm.patchValue({ days: currentDays });
  }

  isDaySelected(day: string): boolean {
    const selectedDays = this.addReminderForm.get('days')?.value || [];
    return selectedDays.includes(day);
  }

  selectAllDays() {
    const allDays = this.daysOptions.map(day => day.value);
    this.addReminderForm.patchValue({ days: allDays });
  }

  selectWeekdays() {
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    this.addReminderForm.patchValue({ days: weekdays });
  }

  selectWeekends() {
    const weekends = ['saturday', 'sunday'];
    this.addReminderForm.patchValue({ days: weekends });
  }

  clearDays() {
    this.addReminderForm.patchValue({ days: [] });
  }

  // Form validation helpers
  getFieldError(fieldName: string): string {
    const field = this.addReminderForm.get(fieldName);
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
    if (this.addReminderForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.addReminderForm.value as CreateReminderRequest;
        formData.childId = this.childId;
        
        await this.remindersService.addReminder(formData);
        
        this.showToastMessage(`Pengingat "${formData.title}" berhasil dibuat!`, 'success');
        
        // Navigate back to reminders list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/reminders', this.childId]);
        }, 2000);
        
      } catch (error: any) {
        this.showToastMessage(
          error.error?.message || 'Gagal membuat pengingat. Silakan coba lagi.',
          'danger'
        );
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.addReminderForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Navigation
  goBack() {
    this.router.navigate(['/reminders', this.childId]);
  }

  // Utility methods
  getSelectedTypeInfo() {
    const selectedType = this.addReminderForm.get('type')?.value;
    return this.reminderTypes.find(type => type.type === selectedType);
  }

  formatSelectedDays(): string {
    const selectedDays = this.addReminderForm.get('days')?.value || [];
    if (selectedDays.length === 0) return 'Belum dipilih';
    
    if (selectedDays.length === 7) return 'Setiap hari';
    
    if (selectedDays.length === 5 && 
        !selectedDays.includes('saturday') && 
        !selectedDays.includes('sunday')) {
      return 'Hari kerja';
    }
    
    if (selectedDays.length === 2 && 
        selectedDays.includes('saturday') && 
        selectedDays.includes('sunday')) {
      return 'Weekend';
    }
    
    return selectedDays.map((day: string) => {
      const dayOption = this.daysOptions.find(d => d.value === day);
      return dayOption?.short || day;
    }).join(', ');
  }

  formatAge(): string {
    if (!this.child) return '';
    return this.childrenService.formatAge(this.child.birthDate);
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}