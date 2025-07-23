import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar } from '@ionic/angular/standalone';
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
  checkmarkCircleOutline
} from 'ionicons/icons';
import { GrowthService } from '../../services/growth.service';
import { ChildrenService } from '../../services/children.service';
import { CreateGrowthRecordRequest, Child } from '../../models/app.models';

@Component({
  selector: 'app-add-growth-record',
  templateUrl: './add-growth-record.page.html',
  styleUrls: ['./add-growth-record.page.scss'],
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
export class AddGrowthRecordPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private growthService = inject(GrowthService);
  private childrenService = inject(ChildrenService);

  childId: string = '';
  child: Child | null = null;
  growthForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';

  // Calculated values
  calculatedBMI = 0;
  nutritionStatus = '';
  ageInMonths = 0;
  validationWarnings: string[] = [];

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
      checkmarkCircleOutline
    });

    this.growthForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      height: ['', [Validators.required, Validators.min(30), Validators.max(200)]],
      headCircumference: ['', [Validators.min(30), Validators.max(70)]],
      notes: ['', [Validators.maxLength(500)]]
    });

    // Watch for weight and height changes to calculate BMI
    this.growthForm.valueChanges.subscribe(() => {
      this.calculateBMI();
      this.validateMeasurements();
    });
  }

  async ngOnInit() {
    this.childId = this.route.snapshot.paramMap.get('childId') || '';
    if (this.childId) {
      await this.loadChild();
    }
  }

  async loadChild() {
    try {
      this.child = await this.childrenService.getChildById(this.childId);
      if (this.child) {
        this.ageInMonths = this.childrenService.calculateAgeInMonths(this.child.birthDate);
      }
    } catch (error: any) {
      this.showToastMessage('Gagal memuat data anak', 'danger');
      console.error('Error loading child:', error);
    }
  }

  calculateBMI() {
    const weight = this.growthForm.get('weight')?.value;
    const height = this.growthForm.get('height')?.value;
    
    if (weight && height) {
      this.calculatedBMI = this.growthService.calculateBMI(weight, height);
      this.nutritionStatus = this.growthService.getNutritionStatus(this.calculatedBMI, this.ageInMonths);
    } else {
      this.calculatedBMI = 0;
      this.nutritionStatus = '';
    }
  }

  validateMeasurements() {
    const weight = this.growthForm.get('weight')?.value;
    const height = this.growthForm.get('height')?.value;
    
    if (weight && height) {
      const validation = this.growthService.validateMeasurements(weight, height, this.ageInMonths);
      this.validationWarnings = validation.warnings;
    } else {
      this.validationWarnings = [];
    }
  }

  // Form validation helpers
  getFieldError(fieldName: string): string {
    const field = this.growthForm.get(fieldName);
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
    if (this.growthForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.growthForm.value;
        const recordData: CreateGrowthRecordRequest = {
          childId: this.childId,
          weight: Number(formData.weight),
          height: Number(formData.height),
          headCircumference: formData.headCircumference ? Number(formData.headCircumference) : undefined,
          notes: formData.notes || undefined
        };
        
        const newRecord = await this.growthService.addGrowthRecord(recordData);
        
        this.showToastMessage('Catatan pertumbuhan berhasil disimpan!', 'success');
        
        // Navigate back to growth records after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/growth', this.childId]);
        }, 2000);
        
      } catch (error: any) {
        this.showToastMessage(
          error.error?.message || 'Gagal menyimpan catatan. Silakan coba lagi.',
          'danger'
        );
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.growthForm);
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

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
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
    this.growthForm.patchValue({ [fieldName]: numericValue });
  }
}