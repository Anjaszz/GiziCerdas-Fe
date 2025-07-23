// verify-otp-modal.component.ts
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { IconModule } from '../../icon/icon.module';
import { CommonModule } from '@angular/common';
import { CloseIconComponent } from '../../icon/close-icon';

export type OtpError = 'invalid' | 'expired' | 'empty' | null;
export type VerificationType = 'email' | 'phone';
export type VerificationPurpose = 'add' | 'pin' | 'forgot-password';

@Component({
  selector: 'app-verify-otp-modal',
  templateUrl: './verify-otp-modal.component.html',
  styleUrls: ['./verify-otp-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, IconModule, CloseIconComponent],
})
export class VerifyOtpModalComponent implements OnInit, OnDestroy {
  @Input() verificationType: VerificationType = 'email';
  @Input() verificationValue: string = '';
  @Input() otpErrorType: OtpError = null;
  @Input() isLoading: boolean = false;
  @Input() purpose: 'add' | 'pin' | 'forgot-password' = 'add';
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() backModal = new EventEmitter<void>();
  @Output() submitOtp = new EventEmitter<string>();
  @Output() resendOtp = new EventEmitter<void>();

  @ViewChildren('otpInputs') otpInputs!: QueryList<ElementRef>;
  
  otp: string[] = ['', '', '', ''];
  remainingTime: number = 60;
  timer: any;

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  getTitle(): string {
    if (this.purpose === 'pin') {
      return 'Verifikasi Pembuatan PIN';
    } else if (this.purpose === 'forgot-password') {
      return 'Verifikasi Password';
    }
    return `Verifikasi ${this.verificationType === 'email' ? 'Email' : 'Nomor HP'}`;
  }

  getDescription(): string {
    const method = this.verificationType === 'email' ? 'e-mail' : 'SMS';
    if (this.purpose === 'pin') {
      return `Kode verifikasi untuk pembuatan PIN telah dikirim melalui ${method} ke ${this.verificationValue}`;
    } else if (this.purpose === 'forgot-password') {
      return `Kode verifikasi untuk ubah password telah dikirim melalui ${method} ke ${this.verificationValue}`;
    }
    return `Kode verifikasi telah dikirim melalui ${method} ke ${this.verificationValue}`;
  }

  private checkAndSubmitOtp() {
    // Check if loading - don't submit if processing
    if (this.isLoading) {
      return;
    }
  
    // Check if all OTP digits are filled
    if (!this.otp.every(digit => digit !== '')) {
      this.otpErrorType = 'empty';
      return;
    }
  
    // Check if all digits are numeric
    if (!this.otp.every(digit => /^\d$/.test(digit))) {
      this.otpErrorType = 'invalid';
      return;
    }
  
    // Join the OTP digits
    const completeOtp = this.otp.join('');
  
  
    // Emit the complete OTP
    this.submitOtp.emit(completeOtp);
  
    // Clear inputs and reset focus after submission
    const inputs = this.otpInputs.toArray();
    inputs.forEach(input => {
      input.nativeElement.blur();
    });
  }

  startTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.remainingTime = 60;
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  resendOtpRequest() {
    // Reset OTP inputs
    this.otp = ['', '', '', ''];
    const inputs = this.otpInputs.toArray();
    inputs.forEach(input => input.nativeElement.value = '');
    inputs[0].nativeElement.focus();
    
    // Reset error state
    this.otpErrorType = null;
    
    // Restart the timer
    this.startTimer();
    
    // Emit the resend event
    this.resendOtp.emit();
  }

  getErrorMessage(): string {
    switch (this.otpErrorType) {
      case 'empty':
        return 'Kode OTP tidak boleh kosong';
      case 'invalid':
        return 'Kode OTP tidak valid';
      case 'expired':
        return 'Kode OTP telah kadaluarsa';
      default:
        return '';
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  onBack() {
    this.backModal.emit();
  }

  onOtpKeyup(event: KeyboardEvent, currentIndex: number) {
    const inputs = this.otpInputs.toArray();
    const value = (event.target as HTMLInputElement).value;

    if (value && /^\d$/.test(value)) {
      this.otp[currentIndex] = value;
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].nativeElement.focus();
      } else {
        this.checkAndSubmitOtp();
      }
    }
  }

  onOtpKeydown(event: KeyboardEvent, currentIndex: number) {
    const inputs = this.otpInputs.toArray();

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      this.otpErrorType = null;

      if (!this.otp[currentIndex] && currentIndex > 0) {
        this.otp[currentIndex - 1] = '';
        inputs[currentIndex - 1].nativeElement.value = '';
        inputs[currentIndex - 1].nativeElement.focus();
      } else {
        this.otp[currentIndex] = '';
        inputs[currentIndex].nativeElement.value = '';
      }
    }
  }

  onOtpInput(event: any, index: number) {
    const value = event.target.value;
    this.otpErrorType = null;
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue) {
      this.otp[index] = numericValue.slice(-1);
      event.target.value = this.otp[index];

      if (index < this.otpInputs.length - 1) {
        this.otpInputs.toArray()[index + 1].nativeElement.focus();
      } else {
        this.checkAndSubmitOtp();
      }
    } else {
      this.otp[index] = '';
      event.target.value = '';
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    this.otpErrorType = null;

    const pastedData = event.clipboardData?.getData('text/plain');
    if (!pastedData) return;

    const numericValue = pastedData.replace(/[^0-9]/g, '');
    const inputs = this.otpInputs.toArray();

    for (let i = 0; i < Math.min(inputs.length, numericValue.length); i++) {
      this.otp[i] = numericValue[i];
      inputs[i].nativeElement.value = numericValue[i];
      if (i < inputs.length - 1) {
        inputs[i + 1].nativeElement.focus();
      }
    }

    this.checkAndSubmitOtp();
  }
}