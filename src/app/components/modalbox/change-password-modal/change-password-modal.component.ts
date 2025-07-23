import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconModule } from '../../icon/icon.module';
import { ButtonComponent } from '../../button/button.component';
import { CloseIconComponent } from '../../icon/close-icon';
import { InputTextComponent } from '../../input/input-text/input-text.component';
import { IonHeader } from "@ionic/angular/standalone";

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  standalone: true,
  imports: [IonHeader, 
    CommonModule,
    ReactiveFormsModule,
    IconModule,
    ButtonComponent,
    CloseIconComponent,
    InputTextComponent
  ]
})
export class ChangePasswordModalComponent implements OnInit {
  @Input() isLoading = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() forgotPassword = new EventEmitter<void>();
  @Output() submitPassword = new EventEmitter<string>();

  passwordForm!: FormGroup;
  isSubmit = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm();
    
    // Reset unrecognized error when form changes
    this.passwordForm.valueChanges.subscribe(() => {
      if (this.passwordControl?.hasError('unrecognized')) {
        const currentErrors = { ...this.passwordControl.errors };
        delete currentErrors['unrecognized'];
        this.passwordControl?.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
      }
    });
  }

  private initializeForm() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]]
    });
  }

  get passwordControl() {
    return this.passwordForm.get('password');
  }

  onClose() {
    this.passwordForm.reset();
    this.isSubmit = false;
    this.closeModal.emit();
  }

  onSubmit() {
    this.isSubmit = true;
    
    if (this.passwordForm.invalid) {
      return;
    }

    const password = this.passwordControl?.value;
    this.submitPassword.emit(password);
  }

  onForgotPassword() {
    this.passwordForm.reset();
    this.isSubmit = false;
    this.forgotPassword.emit();
  }

  // This method will be called from profile.page.ts when password validation fails
  setUnrecognizedError() {
    // Mark form as touched to show errors
    this.passwordControl?.markAsTouched();
    
    // Set specific error for unrecognized password
    const currentErrors = this.passwordControl?.errors || {};
    this.passwordControl?.setErrors({ ...currentErrors, unrecognized: true });
    
    // Set submit state to true to ensure error messages are displayed
    this.isSubmit = true;
  }
}