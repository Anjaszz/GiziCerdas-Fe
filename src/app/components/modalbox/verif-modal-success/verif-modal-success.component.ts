// verif-modal-success.component.ts
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconModule } from '../../icon/icon.module';
import { ButtonComponent } from '../../button/button.component';
import { CloseIconComponent } from '../../icon/close-icon';
import { SkeletonModule } from 'primeng/skeleton';

export type VerificationType = 'email' | 'phone';
export type VerificationMethod = 'email' | 'whatsapp' | 'sms';

// verif-modal-success.component.ts
@Component({
  selector: 'app-verif-modal-success',
  templateUrl: './verif-modal-success.component.html',
  standalone: true,
  imports: [
    CommonModule,
    IconModule,
    ButtonComponent,
    CloseIconComponent,
    SkeletonModule
  ]
})
export class VerifModalSuccessComponent {
  @Input() type: VerificationType = 'email';
  @Input() isEdit: boolean = false;
  @Input() selectedMethod: VerificationMethod = 'email';
  @Input() targetValue: string = '';
  @Input() verificationDestination: string = ''; 
  @Output() closeModal = new EventEmitter<void>();

  getTitle(): string {
    if (this.isEdit) {
      return 'Link Sudah Terkirim';
    }
    return this.type === 'email' 
      ? 'E-Mail Berhasil Didaftarkan'
      : 'Nomor HP Berhasil Didaftarkan';
  }

  getMessage(): string {
    return this.type === 'email'
      ? 'Selamat E-Mailmu Berhasil didaftarkan, yuk mulai transaksi di Pakdome'
      : 'Selamat Nomor HP-mu Berhasil didaftarkan, yuk mulai transaksi di Pakdome';
  }

  getMethodName(): string {
    switch (this.selectedMethod) {
      case 'email':
        return 'E-mail';
      case 'whatsapp':
        return 'WhatsApp';
      case 'sms':
        return 'SMS';
      default:
        return '';
    }
  }

  getVerificationDestination(): string {
    if (this.selectedMethod === 'email') {
      return this.verificationDestination;
    } else if (this.selectedMethod === 'whatsapp' || this.selectedMethod === 'sms') {
      return this.verificationDestination ? `+${this.verificationDestination}` : '';
    }
    return '';
  }

  getButtonText(): string {
    return this.isEdit ? 'Tutup' : 'Selesai';
  }

  onClose() {
    this.closeModal.emit();
  }

  onSubmit() {
    this.onClose();
  }
}