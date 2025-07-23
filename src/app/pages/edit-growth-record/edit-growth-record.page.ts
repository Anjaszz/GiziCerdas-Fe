// pages/growth/edit-growth-record/edit-growth-record.page.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  scaleOutline,
  resizeOutline,
  analyticsOutline,
  calendarOutline,
  documentTextOutline,
  saveOutline,
  warningOutline,
  checkmarkCircleOutline,
  trashOutline
} from 'ionicons/icons';
import { GrowthService } from '../../services/growth.service';
import { ChildrenService } from '../../services/children.service';
import { CreateGrowthRecordRequest, Child, GrowthRecord } from '../../models/app.models';

@Component({
  selector: 'app-edit-growth-record',
  templateUrl: './edit-growth-record.page.html',
  styleUrls: ['./edit-growth-record.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class EditGrowthRecordPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private growthService = inject(GrowthService);
  private childrenService = inject(ChildrenService);
  

  childId: string = '';
  recordId: string = '';
  child: Child | null = null;
  growthRecord: GrowthRecord | null = null;
  editGrowthForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';
  showDeleteConfirm = false;

  // Calculated values
  calculatedBMI = 0;
  nutritionStatus = '';
  ageInMonths = 0;
  validationWarnings: string[] = [];

  // Original values for comparison
  originalValues = {
    weight: 0,
    height: 0,
    bmi: 0,
    nutritionStatus: ''
  };

  constructor() {
    addIcons({
      arrowBackOutline,
      scaleOutline,
      resizeOutline,
      analyticsOutline,
      calendarOutline,
      documentTextOutline,
      saveOutline,
      warningOutline,
      checkmarkCircleOutline,
      trashOutline
    });

    this.editGrowthForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      height: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      headCircumference: ['', [Validators.min(30), Validators.max(70)]],
      notes: ['', [Validators.maxLength(500)]]
    });

    // Watch for weight and height changes to calculate BMI
    this.editGrowthForm.valueChanges.subscribe(() => {
      this.calculateBMI();
      this.validateMeasurements();
    });
  }

  async ngOnInit() {
    this.childId = this.route.snapshot.paramMap.get('childId') || '';
    this.recordId = this.route.snapshot.paramMap.get('recordId') || '';
    
    if (this.childId && this.recordId) {
      await this.loadData();
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      // Load child data
      this.child = await this.childrenService.getChildById(this.childId);
      
      if (this.child) {
        this.ageInMonths = this.childrenService.calculateAgeInMonths(this.child.birthDate);
      }

      // Load growth record data
      await this.loadGrowthRecord();
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      
      if (error.status === 404) {
        this.showToastMessage('Data tidak ditemukan', 'danger');
        setTimeout(() => {
          this.router.navigate(['/growth', this.childId]);
        }, 2000);
      } else {
        this.showToastMessage('Gagal memuat data', 'danger');
      }
    } finally {
      this.isLoading = false;
    }
  }

  async loadGrowthRecord() {
    try {
      // Get all records and find the specific one
      const records = await this.growthService.getGrowthRecords(this.childId);
      this.growthRecord = records.find(record => record._id === this.recordId) || null;
      
      if (this.growthRecord) {
        // Pre-fill form with current record data
        this.editGrowthForm.patchValue({
          weight: this.growthRecord.weight,
          height: this.growthRecord.height,
          headCircumference: this.growthRecord.headCircumference || '',
          notes: this.growthRecord.notes || ''
        });

        // Store original values
        this.originalValues = {
          weight: this.growthRecord.weight,
          height: this.growthRecord.height,
          bmi: this.growthRecord.bmi,
          nutritionStatus: this.growthRecord.nutritionStatus
        };

        // Calculate current BMI
        this.calculateBMI();
      } else {
        throw new Error('Growth record not found');
      }
      
    } catch (error) {
      console.error('Error loading growth record:', error);
      throw error;
    }
  }

  calculateBMI() {
    const weight = this.editGrowthForm.get('weight')?.value;
    const height = this.editGrowthForm.get('height')?.value;
    
    if (weight && height) {
      this.calculatedBMI = this.growthService.calculateBMI(weight, height);
      this.nutritionStatus = this.growthService.getNutritionStatus(this.calculatedBMI, this.ageInMonths);
    } else {
      this.calculatedBMI = 0;
      this.nutritionStatus = '';
    }
  }

  validateMeasurements() {
    const weight = this.editGrowthForm.get('weight')?.value;
    const height = this.editGrowthForm.get('height')?.value;
    
    if (weight && height) {
      const validation = this.growthService.validateMeasurements(weight, height, this.ageInMonths);
      this.validationWarnings = validation.warnings;
    } else {
      this.validationWarnings = [];
    }
  }

  // Form validation helpers
  getFieldError(fieldName: string): string {
    const field = this.editGrowthForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} wajib diisi`;
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} minimal ${field.errors['min'].min}`;
      if (field.errors['max']) return `${this.getFieldLabel(fieldName)} maksimal ${field.errors['max'].max}`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} maksimal ${field.errors['maxlength'].requiredLength} karakter`;
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      weight: 'Berat badan',
      height: 'Tinggi badan',
      headCircumference: 'Lingkar kepala',
      notes: 'Catatan'
    };
    return labels[fieldName] || fieldName;
  }

  // Form submission
  async onSubmit() {
    if (this.editGrowthForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.editGrowthForm.value;
        const updateData: Partial<CreateGrowthRecordRequest> = {
          weight: Number(formData.weight),
          height: Number(formData.height),
          headCircumference: formData.headCircumference ? Number(formData.headCircumference) : undefined,
          notes: formData.notes || undefined
        };
        
        await this.growthService.updateGrowthRecord(this.recordId, updateData);
        
        this.showToastMessage('Catatan pertumbuhan berhasil diperbarui!', 'success');
        
        // Navigate back to growth records after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/growth', this.childId]);
        }, 2000);
        
      } catch (error: any) {
        this.showToastMessage(
          error.error?.message || 'Gagal memperbarui catatan. Silakan coba lagi.',
          'danger'
        );
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.editGrowthForm);
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

  async deleteRecord() {
    if (!this.growthRecord) return;

    try {
      await this.growthService.deleteGrowthRecord(this.recordId);
      this.showToastMessage('Catatan pertumbuhan berhasil dihapus', 'success');
      this.showDeleteConfirm = false;
      
      // Navigate back to growth records
      setTimeout(() => {
        this.router.navigate(['/growth', this.childId]);
      }, 2000);
      
    } catch (error: any) {
      this.showToastMessage('Gagal menghapus catatan', 'danger');
      console.error('Error deleting record:', error);
    }
  }

  // Navigation
  goBack() {
    this.router.navigate(['/growth', this.childId]);
  }

  // Utility methods
  getNutritionStatusText(): string {
    return this.growthService.getNutritionStatusText(this.nutritionStatus);
  }

  getNutritionStatusColor(): string {
    return this.growthService.getNutritionStatusColor(this.nutritionStatus);
  }

  getNutritionStatusBadgeColor(): string {
    return this.growthService.getNutritionStatusBadgeColor(this.nutritionStatus);
  }

  getGrowthRecommendations(): string[] {
    return this.growthService.getGrowthRecommendations(this.nutritionStatus, this.ageInMonths);
  }

  formatAge(): string {
    if (!this.child) return '';
    return this.childrenService.formatAge(this.child.birthDate);
  }

  formatRecordDate(): string {
    if (!this.growthRecord) return '';
    return new Date(this.growthRecord.recordDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  hasChanges(): boolean {
    if (!this.growthRecord) return false;
    
    const formData = this.editGrowthForm.value;
    return (
      Number(formData.weight) !== this.originalValues.weight ||
      Number(formData.height) !== this.originalValues.height ||
      Number(formData.headCircumference || 0) !== (this.growthRecord.headCircumference || 0) ||
      (formData.notes || '') !== (this.growthRecord.notes || '')
    );
  }

  getChangeIndicator(): { text: string; color: string } {
    const weightChange = Number(this.editGrowthForm.get('weight')?.value) - this.originalValues.weight;
    const heightChange = Number(this.editGrowthForm.get('height')?.value) - this.originalValues.height;
    
    if (Math.abs(weightChange) > 0.1 || Math.abs(heightChange) > 0.5) {
      return {
        text: 'Perubahan signifikan terdeteksi',
        color: 'text-orange-600'
      };
    } else if (this.hasChanges()) {
      return {
        text: 'Ada perubahan data',
        color: 'text-blue-600'
      };
    }
    
    return {
      text: 'Tidak ada perubahan',
      color: 'text-gray-600'
    };
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  // Helper for number input
  onNumberInput(event: any, fieldName: string) {
    const value = event.target.value;
    // Allow only numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    this.editGrowthForm.patchValue({ [fieldName]: numericValue });
  }

getGrowthServiceText(nutritionStatus: string): string {

  return this.growthService.getNutritionStatusText(nutritionStatus);

}
}