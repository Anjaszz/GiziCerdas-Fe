// change-method-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from 'src/app/components/icon/icon.module';

export type VerificationMethod = 'email' | 'phone' | 'whatsapp';

@Component({
  selector: 'app-change-method-modal',
  standalone: true,
  imports: [CommonModule, IconModule],
  templateUrl:'./change-method-modal.html',
  styles: [`
    .modal-container {
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      justify-content: center;
      align-items: flex-end;

    }

    @media (min-width: 640px) {
      .modal-container {
        align-items: center;
      }
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.5);
      animation: fadeIn 0.3s ease-out;
    }

    .modal-content {
      background-color: white;
      width: 100%;
      max-width: 514px;
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      border-radius: 24px 24px 0 0;
      animation: slideUp 0.3s ease-out;
    }

    @media (min-width: 640px) {
      .modal-content {
        height: auto;
        border-radius: 32px;
     animation:none;
      }
    }

    .method-option {
      width: 100%;
      border: 1px solid var(--line-default, #E5E7EB);
      border-radius: 0.5rem;
      padding: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: border-color 0.2s ease;
    }

    .method-option:hover {
      border-color: var(--text-primary, #6366F1);
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `]
})
export class ChangeMethodModalComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  @Output() methodSelected = new EventEmitter<VerificationMethod>();

  selectAndConfirm(method: VerificationMethod) {
    this.methodSelected.emit(method);
    this.close();
  }

  close() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}