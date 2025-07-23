// verification-method-modal.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconModule } from '../../icon/icon.module';
import { CloseIconComponent } from '../../icon/close-icon';

interface VerificationMethod {
  type: 'email' | 'whatsapp' | 'sms';
  value: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-verification-method-modal',
  templateUrl: './verif-method-modal.component.html',
  standalone: true,
  imports: [CommonModule, IconModule, CloseIconComponent]
})
export class VerificationMethodModalComponent implements OnInit {
  @Input() email: string = '';
  @Input() phone: string = '';
  @Input() isEditFlow: boolean = false;
  @Input() isForgotPasswordFlow: boolean = false;
  @Input() isLoading: boolean = false; // New loading state input
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() methodSelected = new EventEmitter<{ type: string, value: string }>();

  methods = {
    email: { type: 'email', value: '', isAvailable: false },
    whatsapp: { type: 'whatsapp', value: '', isAvailable: false },
    sms: { type: 'sms', value: '', isAvailable: false }
  };

  selectedMethod: string | null = null;

  getTitle(): string {
    if (this.isForgotPasswordFlow) {
      return 'Pilih Metode Verifikasi Password';
    }
    return this.isEditFlow 
      ? 'Pilih Metode Verifikasi Perubahan'
      : 'Pilih Metode Verifikasi';
  }

  getSubtitle(): string {
    if (this.isForgotPasswordFlow) {
      return 'Pilih metode untuk mendapatkan kode verifikasi untuk mengubah password';
    }
    return this.isEditFlow
      ? 'Pilih metode untuk mengirim link verifikasi perubahan data'
      : 'Pilih salah satu metode dibawah ini untuk mendapatkan kode verifikasi';
  }

  ngOnInit() {
    this.initializeMethods();
  }

  private initializeMethods() {
    // Email method
    if (this.email) {
      this.methods.email.value = this.email;
      this.methods.email.isAvailable = true;
    }

    // WhatsApp and SMS methods
    if (this.phone) {
      this.methods.whatsapp.value = this.phone;
      this.methods.whatsapp.isAvailable = true;
      this.methods.sms.value = this.phone;
      this.methods.sms.isAvailable = true;
    }
  }

  selectMethod(type: 'email' | 'whatsapp' | 'sms') {
    // Don't allow selection while loading
    if (this.isLoading) return;
    
    this.selectedMethod = type;
    const method = this.methods[type];
    this.methodSelected.emit({ type: method.type, value: method.value });
    
    // Note: We no longer close the modal here
    // The parent component will handle closing it after API call completes
  }

  onClose() {
    // Don't allow closing while loading
    if (this.isLoading) return;
    
    this.closeModal.emit();
  }
}