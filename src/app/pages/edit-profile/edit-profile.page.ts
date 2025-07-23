import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonToast, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  personOutline,
  mailOutline,
  callOutline,
  saveOutline,
  cameraOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
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
export class EditProfilePage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  currentUser: User | null = null;
  editProfileForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = '';
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor() {
    addIcons({
      arrowBackOutline,
      personOutline,
      mailOutline,
      callOutline,
      saveOutline,
      cameraOutline,
      checkmarkCircleOutline
    });

    this.editProfileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      phone: ['', [Validators.required, Validators.pattern(/^(\+62|62|0)[0-9]{9,13}$/)]]
    });
  }

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    try {
      this.currentUser = this.authService.getCurrentUser();
      
      if (!this.currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      // Pre-fill form with current user data
      this.editProfileForm.patchValue({
        name: this.currentUser.name,
        phone: this.currentUser.phone
      });

      // Set current profile image as preview
      if (this.currentUser.profileImage) {
        this.imagePreview = this.currentUser.profileImage;
      }

    } catch (error: any) {
      console.error('Error loading profile:', error);
      this.showToastMessage('Gagal memuat profil', 'danger');
    }
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
    this.imagePreview = this.currentUser?.profileImage || null;
  }

  // Form validation helpers
  getFieldError(fieldName: string): string {
    const field = this.editProfileForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} wajib diisi`;
      if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} minimal ${field.errors['minlength'].requiredLength} karakter`;
      if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} maksimal ${field.errors['maxlength'].requiredLength} karakter`;
      if (field.errors['pattern']) return 'Format nomor telepon tidak valid';
    }
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nama lengkap',
      phone: 'Nomor telepon'
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
    this.editProfileForm.patchValue({ phone: value });
  }

  // Form submission
  async onSubmit() {
    if (this.editProfileForm.valid) {
      this.isLoading = true;
      try {
        const formData = this.editProfileForm.value;
        
        // Update profile via API
        const updatedUser = await this.authService.updateProfile({
          name: formData.name,
          phone: formData.phone
        });

        // TODO: Upload image if selected
        if (this.selectedImage) {
          // Implement image upload logic here
          console.log('Image upload will be implemented');
        }

        this.currentUser = updatedUser;
        this.showToastMessage('Profil berhasil diperbarui!', 'success');
        
        // Navigate back to profile after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
        
      } catch (error: any) {
        this.showToastMessage(
          error.error?.message || 'Gagal memperbarui profil. Silakan coba lagi.',
          'danger'
        );
      } finally {
        this.isLoading = false;
      }
    } else {
      this.markFormGroupTouched(this.editProfileForm);
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
  getInitials(name: string): string {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  hasChanges(): boolean {
    if (!this.currentUser) return false;
    
    const formData = this.editProfileForm.value;
    return (
      formData.name !== this.currentUser.name ||
      formData.phone !== this.currentUser.phone ||
      this.selectedImage !== null
    );
  }

  showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }
}