import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CloseIconComponent } from "../../icon/close-icon";
import { IconModule } from '../../icon/icon.module';
import { InputTextComponent } from "../../input/input-text/input-text.component";
import { ButtonComponent } from "../../button/button.component";
import { ModalStateService } from 'src/app/services/modal-state.service';
import { Subscription } from 'rxjs';

export type VerificationType = 'email' | 'phone';

@Component({
  selector: 'add-input-modal',
  templateUrl: './add-input-modal.component.html',
  imports: [
    CommonModule, 
    FormsModule, 
    CloseIconComponent, 
    IconModule, 
    InputTextComponent, 
    ButtonComponent
  ],
  standalone: true,
})
export class AddInputModalComponent implements OnInit, OnDestroy {
  @Input() type: VerificationType = 'email';
  @Input() isEdit: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() submitValue = new EventEmitter<string>();

  inputValue: string = '';
  showError: boolean = false;
  errorMessage: string = '';
  isSubmitted: boolean = false;
  isDesktop = true;
  private userTyping: boolean = false;
  private stateSubscription?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private modalStateService: ModalStateService
  ) {}

  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

   
    this.stateSubscription = this.modalStateService.modalState$.subscribe(state => {
     
      
      // Only update if not user typing
      if (!this.userTyping) {
        this.inputValue = state.inputValue;
        this.showError = state.showError;
        this.errorMessage = state.errorMessage;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    window.removeEventListener('resize', () => this.checkScreenSize());
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  private checkScreenSize() {
    this.isDesktop = window.innerWidth >= 640;
  }

  getTitle(): string {
    if (this.isEdit) {
      return this.type === 'email' ? 'Ubah Email Baru' : 'Ubah No.Telepon Baru';
    }
    return this.type === 'email' ? 'Daftarkan Email' : 'Daftarkan No.Telepon';
  }

  getSubtitle(): string {
    const baseText = this.type === 'email' 
      ? 'Pastikan E-Mail Anda aktif untuk keamanan dan kenyamanan transaksi'
      : 'Pastikan nomor HP Anda aktif untuk keamanan dan kenyamanan transaksi';
    
    if (!this.isEdit) {
      return `${baseText}. Perubahan memerlukan verifikasi ulang.`;
    }
    return baseText;
  }

  getPlaceholder(): string {
    const action = this.isEdit ? 'Masukan' : 'Masukan';
    return `${action} ${this.type === 'email' ? 'Email Baru' : 'Nomor HP Baru'}`;
  }

  getInfoText(): string {
    return `Pakdome akan mengirimkan kode verifikasi melalui ${this.type === 'email' ? 'E-Mail' : 'no.telepon'} diatas`;
  }

  onInputChange() {
    this.userTyping = true;
  
    if (this.inputValue) {
      this.clearError();
    }
    
    if (this.inputValue && !this.isEmptyError()) {
      this.validateFormat();
    }

    setTimeout(() => {
      this.userTyping = false;
    }, 100);
  }

  resetState() {
    this.userTyping = false;
    this.modalStateService.resetModalState();
  }

  setValueAndError(value: string, errorMessage: string) {
    this.userTyping = false;
    
    this.modalStateService.setModalState({
      inputValue: value,
      showError: true,
      errorMessage: errorMessage
    });
  }

  clearError() {
    if (this.userTyping) {
      this.modalStateService.setModalState({
        showError: false,
        errorMessage: '',
        inputValue: this.inputValue
      });
    }
  }

  private isEmptyError(): boolean {
    return this.errorMessage === 'Wajib diisi';
  }

  private validateFormat(): boolean {
    if (this.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.inputValue)) {
        this.modalStateService.setModalState({
          showError: true,
          errorMessage: 'Format e-mail tidak dikenali',
          inputValue: this.inputValue
        });
        return false;
      }
    } else {
      const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
      if (!phoneRegex.test(this.inputValue)) {
        this.modalStateService.setModalState({
          showError: true,
          errorMessage: 'Format nomor HP tidak valid',
          inputValue: this.inputValue
        });
        return false;
      }
    }

    return true;
  }

  onSubmit() {
    this.isSubmitted = true;

    if (!this.inputValue) {
      this.modalStateService.setModalState({
        showError: true,
        errorMessage: 'Wajib diisi',
        inputValue: ''
      });
      return;
    }

    if (this.validateFormat()) {
      this.submitValue.emit(this.inputValue);
    }
  }

  onClose() {
    this.modalStateService.resetModalState();
    this.closeModal.emit();
  }
}