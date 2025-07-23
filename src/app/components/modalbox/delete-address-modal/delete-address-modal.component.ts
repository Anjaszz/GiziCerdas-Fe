import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../button/button.component';
import { IconModule } from '../../icon/icon.module';
import { AddressForm } from '../add-address/add-address.component';
import { AddressService } from 'src/app/services/address.service';

type UserAddress = AddressForm & {
  isPrimary?: boolean;
  type?: 'pickup' | 'receiver';
  uuid?: string;
};

@Component({
  selector: 'app-delete-address-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconModule],
  templateUrl: './delete-address-modal.component.html',
  styles: [`
    :host {
      display: block;
    }

    .modal-backdrop {
      opacity: 0;
      transition: opacity 0.3s ease-out;
      background-color: rgba(0, 0, 0, 0.5);
    }

    .modal-backdrop.modal-open {
      opacity: 1;
    }
    
    .modal-content {
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.33, 1, 0.68, 1);
      will-change: transform;
    }

    .modal-open .modal-content {
      transform: translateY(0);
    }

    @media (min-width: 640px) {
      .modal-content {
        transform: scale(0.95) translateY(20px);
        opacity: 0;
        transition: 
          transform 0.4s cubic-bezier(0.33, 1, 0.68, 1),
          opacity 0.4s ease-out;
      }

      .modal-open .modal-content {
        transform: scale(1) translateY(0);
        opacity: 1;
      }
    }
  `]
})
export class DeleteAddressModalComponent {
  @Input() isOpen = false;
  @Input() address: UserAddress | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() deleteConfirmed = new EventEmitter<void>();

  private dragStartY: number = 0;
  private dragCurrentY: number = 0;
  private readonly DRAG_THRESHOLD = 100;

  constructor(private addressService: AddressService) {}

  startDrag(event: TouchEvent) {
    this.dragStartY = event.touches[0].clientY;
    this.dragCurrentY = this.dragStartY;
  }

  onDrag(event: TouchEvent) {
    this.dragCurrentY = event.touches[0].clientY;
    const deltaY = this.dragCurrentY - this.dragStartY;
    
    if (deltaY > 0) {
      event.preventDefault();
      const element = event.currentTarget as HTMLElement;
      element.style.transform = `translateY(${deltaY}px)`;
    }
  }

  endDrag() {
    const deltaY = this.dragCurrentY - this.dragStartY;
    
    if (deltaY > this.DRAG_THRESHOLD) {
      this.close();
    } else {
      const element = document.querySelector('.modal-content') as HTMLElement;
      if (element) {
        element.style.transform = 'translateY(0)';
      }
    }
  }

  formatDomicile(domicile: string): string {
    return this.addressService.formatDomicile(domicile);
  }

  close() {
    this.closeModal.emit();
  }

  confirmDelete() {
    this.deleteConfirmed.emit();
    this.close();
  }
}