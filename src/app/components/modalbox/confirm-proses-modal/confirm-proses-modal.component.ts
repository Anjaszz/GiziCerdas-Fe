import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import { ButtonComponent } from "../../button/button.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirm-proses-modal',
  templateUrl: './confirm-proses-modal.component.html',
  styleUrls: ['./confirm-proses-modal.component.scss'],
  standalone: true,
  imports: [CheckboxComponent, ButtonComponent, CommonModule, FormsModule, RouterLink],
})
export class ConfirmProsesModalComponent {

  @Input() isOpen = false;
  @Input() variant: 'default' | 'simple' = 'default';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  
  termsAccepted = false;

  constructor() { }
  
  onConfirm() {
    if (this.termsAccepted) {
      this.confirm.emit();
      this.termsAccepted = false;
    }
  }
  
  onCancel() {
    this.cancel.emit();
  }
  
  onBackdropClick(event: MouseEvent) {
    this.close.emit();
  }

  get isDefaultVariant(): boolean {
    return this.variant === 'default';
  }

  get isSimpleVariant(): boolean {
    return this.variant === 'simple';
  }
}