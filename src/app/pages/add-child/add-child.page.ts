import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  personOutline,  
  maleOutline, 
  femaleOutline,
  documentTextOutline,
  saveOutline,
  cameraOutline
} from 'ionicons/icons';
import { ChildrenService } from '../../services/children.service';
import { CreateChildRequest } from '../../models/app.models';

@Component({
  selector: 'app-add-child',
  templateUrl: './add-child.page.html',
  styleUrls: ['./add-child.page.scss'],
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
export class AddChildPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private childrenService = inject(ChildrenService);

  addChildForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  // Age calculation
  calculatedAge = {
    years: 0,
    months: 0,
    totalMonths: 0
  };

  constructor() {
    addIcons({
      arrowBackOutline,
      personOutline,
      maleOutline,
      femaleOutline,
      documentTextOutline,
      saveOutline,
      cameraOutline
    });

    this.addChildForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      birthDate: ['', [Validators.required, this.birthDateValidator]],
      gender: ['', [Validators.required]],
      notes: ['', [Validators.maxLength(500)]]
    });

    // Watch for birth date changes to calculate age
    this.addChildForm.get('birthDate')?.valueChanges.subscribe(date => {
      if (date) {
        this.calculateAge(date);
      }
    });
  }

  // Custom validator for birth date
  birthDateValidator(control: any) {
    if (!control.value) return null;
    
    const birthDate = new Date(control.value);
    const today = new Date();
    
    if (birthDate > today) {
      return { futureDate: true };
    }
    
    // Maximum age: 18 years
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    
    if (birthDate < maxDate) {
      return { tooOld: true };
    }
    
    return null;
  }

  calculateAge(birthDate: string) {
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    
    if (today.getDate() < birth.getDate()) {
      months--;
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    this.calculatedAge = {
      years: Math.max(0, years),
      months: Math.max(0, months),
      totalMonths: Math.max(0, years * 12 + months)
    };
  }

  // Image handling
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
      
      this.selectedImage = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  // Form validation helpers
  getFieldError(fieldName: string): string {
    const field = this.addChildForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} wajib diisi`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} minimal ${field.errors['minlength'].requiredLength} karakter`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} maksimal ${field.errors['maxlength'].requiredLength} karakter`;
      if (field.errors['futureDate']) return 'Tanggal lahir tidak boleh di masa depan';
      if (field.errors['tooOld']) return 'Anak tidak boleh lebih dari 18 tahun';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nama anak',
      birthDate: 'Tanggal lahir',
      gender: 'Jenis kelamin',
      notes: 'Catatan'
    };
    return labels[fieldName] || fieldName;
  }

  // Form submission
  async onSubmit() {
    if (this.addChildForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.addChildForm.value as CreateChildRequest;
        
        // Add the child
        const newChild = await this.childrenService.addChild(formData);
        
        // TODO: Upload image if selected
        if (this.selectedImage) {
          // Implement image upload logic here
          console.log('Image upload will be implemented');
        }
        
        this.showToastMessage(`${newChild.name} berhasil ditambahkan!`, 'success');
        
        // Navigate back to children list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/children']);
        }, 2000);
        
      } catch (error: any) {
        this.showToastMessage(
          error.error?.message || 'Gagal menambahkan anak. Silakan coba lagi.',
          'danger'
        );
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.addChildForm);
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
    this.router.navigate(['/children']);
  }

  // Utility methods
  getMaxDate(): string {
    // Today's date for max birth date
    return new Date().toISOString().split('T')[0];
  }

  getMinDate(): string {
    // 18 years ago for min birth date
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);
    return minDate.toISOString().split('T')[0];
  }

  formatAgeDisplay(): string {
    if (this.calculatedAge.years === 0) {
      return `${this.calculatedAge.months} bulan`;
    } else if (this.calculatedAge.months === 0) {
      return `${this.calculatedAge.years} tahun`;
    } else {
      return `${this.calculatedAge.years} tahun ${this.calculatedAge.months} bulan`;
    }
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}