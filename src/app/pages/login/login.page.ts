import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, personAddOutline, homeOutline, personOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
export class LoginPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';

  constructor() {
    addIcons({homeOutline,mailOutline,lockClosedOutline,personOutline,personAddOutline,eyeOutline,eyeOffOutline});

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} wajib diisi`;
      if (field.errors['email']) return 'Format email tidak valid';
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} minimal ${field.errors['minlength'].requiredLength} karakter`;
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Password'
    };
    return labels[fieldName] || fieldName;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.loginForm.value;
        const response = await this.authService.login(formData);
        
        this.toastMessage = `Selamat datang, ${response.user.name}!`;
        this.toastColor = 'success';
        this.showToast = true;
        
        // Navigate to dashboard after successful login
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
        
      } catch (error: any) {
        let errorMessage = 'Login gagal. Silakan coba lagi.';
        
        if (error.status === 401) {
          errorMessage = 'Email atau password salah.';
        } else if (error.status === 404) {
          errorMessage = 'Akun tidak ditemukan.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
        
        this.toastMessage = errorMessage;
        this.toastColor = 'danger';
        this.showToast = true;
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgotPassword() {
    // TODO: Implement forgot password functionality
    this.toastMessage = 'Fitur lupa password akan segera tersedia.';
    this.toastColor = 'warning';
    this.showToast = true;
  }

  // Demo login for testing
  loginAsDemo() {
    this.loginForm.patchValue({
      email: 'demo@gizicerdas.com',
      password: 'demo123'
    });
  }
}