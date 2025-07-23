import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, personOutline, mailOutline, callOutline, lockClosedOutline, arrowBackOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonSpinner, 
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';

  constructor() {
    addIcons({
      eyeOutline,
      eyeOffOutline,
      personOutline,
      mailOutline,
      callOutline,
      lockClosedOutline,
      arrowBackOutline
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+62|62|0)[0-9]{9,13}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value 
      ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} wajib diisi`;
      if (field.errors['email']) return 'Format email tidak valid';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} minimal ${field.errors['minlength'].requiredLength} karakter`;
      if (field.errors['pattern']) return 'Format nomor telepon tidak valid';
    }
    if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMismatch'] && this.registerForm.get('confirmPassword')?.touched) {
      return 'Password tidak sama';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nama lengkap',
      email: 'Email',
      phone: 'Nomor telepon',
      password: 'Password',
      confirmPassword: 'Konfirmasi password'
    };
    return labels[fieldName] || fieldName;
  }

  formatPhoneNumber(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.startsWith('0')) {
      value = '+62' + value.substring(1);
    } else if (value.startsWith('62')) {
      value = '+' + value;
    } else if (!value.startsWith('+62')) {
      value = '+62' + value;
    }
    this.registerForm.patchValue({ phone: value });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.registerForm.value;
        delete formData.confirmPassword;
        
        const response = await this.authService.register(formData);
        
        this.toastMessage = 'Registrasi berhasil! Silakan login.';
        this.toastColor = 'success';
        this.showToast = true;
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
        
      } catch (error: any) {
        this.toastMessage = error.error?.message || 'Registrasi gagal. Silakan coba lagi.';
        this.toastColor = 'danger';
        this.showToast = true;
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}