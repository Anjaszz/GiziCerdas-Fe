import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { IconModule } from '../../icon/icon.module';
import { ButtonComponent } from '../../button/button.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-locked-acc-modal',
  templateUrl: './locked-acc-modal.component.html',
  styleUrls: ['./locked-acc-modal.component.scss'],
  standalone: true,
  imports: [IconModule, ButtonComponent, CommonModule],
  styles: [`
    .modal-backdrop {
      @apply bg-black/50;
      opacity: 0;
      transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modal-backdrop.modal-open {
      opacity: 1;
    }

    .modal-content {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .dragging {
      transition: none;
    }
  `]
})
export class LockedAccModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onInvoiceClick = new EventEmitter<void>();
  @Input() showCloseIcon: boolean = true;
  
  private startY: number = 0;
  private currentY: number = 0;
  private isDragging: boolean = false;
  private modalElement: HTMLElement | null = null;
  
  constructor(private router: Router, private renderer: Renderer2) { }

  ngOnInit() {}

  close() {
    this.isOpen = false;
    this.onClose.emit();
  }

  handleInvoiceClick() {
    this.router.navigate(['/tagihan']);
    this.close();
  }

  onDragStart(event: TouchEvent | MouseEvent) {
    // Hanya aktifkan pada mobile view
    if (window.innerWidth >= 640) return; // 640px = sm breakpoint in Tailwind
    
    this.isDragging = true;
    this.modalElement = (event.target as HTMLElement).closest('.modal-content');
    
    if (this.modalElement) {
      this.renderer.addClass(this.modalElement, 'dragging');
      
      if (event instanceof TouchEvent) {
        this.startY = event.touches[0].clientY;
      } else {
        this.startY = event.clientY;
      }
      
      this.currentY = 0;
    }
  }

  onDrag(event: TouchEvent | MouseEvent) {
    if (!this.isDragging || !this.modalElement) return;
    
    let clientY: number;
    
    if (event instanceof TouchEvent) {
      clientY = event.touches[0].clientY;
    } else {
      clientY = event.clientY;
    }
    
    // Hitung berapa jauh drag ke bawah
    this.currentY = clientY - this.startY;
    
    // Batasi drag hanya ke arah bawah
    if (this.currentY < 0) this.currentY = 0;
    
    // Terapkan transformasi
    this.renderer.setStyle(this.modalElement, 'transform', `translateY(${this.currentY}px)`);
  }

  onDragEnd() {
    if (!this.isDragging || !this.modalElement) return;
    
    this.isDragging = false;
    this.renderer.removeClass(this.modalElement, 'dragging');
    
    // Jika drag lebih dari 100px ke bawah, tutup modal
    if (this.currentY > 100) {
      this.close();
    } else {
      // Kembali ke posisi awal
      this.renderer.setStyle(this.modalElement, 'transform', 'translateY(0)');
    }
  }
}