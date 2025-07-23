// costum-modal-v1.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from "../../button/button.component";
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';

@Component({
  selector: 'app-costum-modal-v1',
  templateUrl: './costum-modal-v1.component.html',
  styleUrls: ['./costum-modal-v1.component.scss'],
  standalone: true,
  imports: [ButtonComponent, CommonModule,IconModule],
  styles: [`
    .modal-backdrop {
      @apply bg-black/50;
      opacity: 0;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modal-backdrop.modal-open {
      opacity: 1;
    }
    
    

  
  `]
})
export class CostumModalV1Component implements OnInit {
  // Input properties for customization
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() confirmButtonText: string = '';
  @Input() cancelButtonText: string = '';
  @Input() cancelButtonMobileText: string = '';
  @Input() modalWidth: string = '420px';
  @Input() buttonLayout: 'horizontal' | 'vertical' = 'horizontal';
  @Input() showCloseIcon: boolean = true;

  
  // Output events
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
   
  }
  get buttonContainerClass(): string {
    return this.buttonLayout === 'horizontal' 
      ? 'flex flex-row sm:gap-3 gap-2' 
      : 'flex flex-col gap-3';
  }
  
  get buttonClass(): string {
    return this.buttonLayout === 'horizontal' ? 'flex-1' : 'w-full';
  }

  confirmDelete() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
  
  close() {
    this.onClose.emit();
  }
}

