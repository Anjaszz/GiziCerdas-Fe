import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  saveOutline,
  shieldCheckmarkOutline,
  warningOutline
} from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
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
export class ChangePasswordPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  changePasswordForm: FormGroup;
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';

  // Password strength indicator
  passwordStrength = {
    score: 0,
    text: '',
    color: '',
    suggestions: [] as string[]
  };

  constructor() {
    addIcons({
      arrowBackOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      saveOutline,
      shieldCheckmarkOutline,
      warningOutline
    });

    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Watch for new password changes to check strength
    this.changePasswordForm.get('newPassword')?.valueChanges.subscribe(password => {
      if (password) {
        this.checkPasswordStrength(password);
      } else {
        this.resetPasswordStrength();
      }
    });
  }

  // Custom validator for password confirmation
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    return newPassword && confirmPassword && newPassword.value === confirmPassword.value 
      ? null : { passwordMismatch: true };
  }

  // Password strength checker
  checkPasswordStrength(password: string) {
    let score = 0;
    const suggestions: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      suggestions.push('Minimal 8 karakter');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      suggestions.push('Sertakan huruf besar');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      suggestions.push('Sertakan huruf kecil');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      suggestions.push('Sertakan angka');
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      suggestions.push('Sertakan karakter khusus');
    }

    // Set strength indicator
    this.passwordStrength = {
      score,
      ...this.getStrengthInfo(score),
      suggestions
    };
  }

  getStrengthInfo(score: number): { text: string; color: string } {
    switch (score) {
      case 0:
      case 1:
        return { text: 'Sangat Lemah', color: 'text-red-600' };
      case 2:
        return { text: 'Lemah', color: 'text-orange-600' };
      case 3:
        return { text: 'Sedang', color: 'text-yellow-600' };
      case 4:
        return { text: 'Kuat', color: 'text-blue-600' };
      case 5:
        return { text: 'Sangat Kuat', color: 'text-green-600' };
      default:
        return { text: '', color: '' };
    }
  }

  resetPasswordStrength() {
    this.passwordStrength = {
      score: 0,
      text: '',
      color: '',
      suggestions: []
    };
  }

  // Toggle password visibility
  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Form validation helpers
  getFieldError(fieldName: string): string {
    const field = this.changePasswordForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} wajib diisi`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} minimal ${field.errors['minlength'].requiredLength} karakter`;
    }
    if (fieldName === 'confirmPassword' && this.changePasswordForm.errors?.['passwordMismatch'] && this.changePasswordForm.get('confirmPassword')?.touched) {
      return 'Konfirmasi password tidak sama';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      currentPassword: 'Password saat ini',
      newPassword: 'Password baru',
      confirmPassword: 'Konfirmasi password'
    };
    return labels[fieldName] || fieldName;
  }

  // Form submission
  async onSubmit() {
    if (this.changePasswordForm.valid) {
      // Check password strength
      if (this.passwordStrength.score < 3) {
        this.showToastMessage('Password terlalu lemah. Gunakan kombinasi huruf, angka, dan karakter khusus.', 'warning');
        return;
      }

      this.isLoading = true;
      try {
        const formData = this.changePasswordForm.value;
        
        await this.authService.changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        });

        this.showToastMessage('Password berhasil diubah!', 'success');
        
        // Clear form
        this.changePasswordForm.reset();
        this.resetPasswordStrength();
        
        // Navigate back to profile after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
        
      } catch (error: any) {
        let errorMessage = 'Gagal mengubah password. Silakan coba lagi.';
        
        if (error.status === 400) {
          errorMessage = 'Password saat ini salah.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.showToastMessage(errorMessage, 'danger');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.changePasswordForm);
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
    this.router.navigate(['/profile']);
  }

  // Utility methods
  getStrengthBarColor(index: number): string {
    if (index < this.passwordStrength.score) {
      switch (this.passwordStrength.score) {
        case 1: return 'bg-red-500';
        case 2: return 'bg-orange-500';
        case 3: return 'bg-yellow-500';
        case 4: return 'bg-blue-500';
        case 5: return 'bg-green-500';
        default: return 'bg-gray-300';
      }
    }
    return 'bg-gray-300';
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}