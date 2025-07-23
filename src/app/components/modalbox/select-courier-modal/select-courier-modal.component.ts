// Perbaikan pada select-courier-modal.component.ts
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';
import { FormsModule } from '@angular/forms';
import { PriceFormatPipe } from 'src/app/Pipes/price-format.pipe';
import { BadgeWithBgComponent } from "../../badges/badges-with-bg/badges-with-bg.component";

export interface CourierOption {
  id: string;
  courier: string;
  logoSrc: string;
  serviceName: string;
  price: number;
  shippingCost: number;
  insuranceCost: number;
  priceId: number;
  serviceType: 'regular' | 'nextday' | 'sameday' | 'cargo' | 'document';
  estimatedDelivery?: string;
  serviceNotes?: string;
  chargeWeight?: number;
}

type ServiceType = 'regular' | 'nextday' | 'sameday' | 'cargo' | 'document';

@Component({
  selector: 'app-select-courier-modal',
  standalone: true,
  imports: [CommonModule, IconModule, FormsModule, PriceFormatPipe, BadgeWithBgComponent],
  templateUrl: './select-courier-modal.component.html',
  styleUrls: ['./select-courier-modal.component.scss']
})
export class SelectCourierModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() courierOptions: CourierOption[] = [];
  @Input() selectedCourierId: string | null = null;
  @Input() totalPackets: number = 0; 
  @Output() closeModal = new EventEmitter<void>();
  @Output() courierSelected = new EventEmitter<CourierOption>();
  @ViewChild('modalContainer') modalContainer!: ElementRef;
  @ViewChild('dragIndicator') dragIndicator!: ElementRef;

  // Active service type
  activeServiceType: ServiceType = 'regular';

  // All available service types
  serviceTypes: ServiceType[] = ['regular', 'nextday', 'sameday', 'cargo', 'document'];

  // Display names for service types
  serviceTypeLabels: Record<ServiceType, string> = {
    'regular': 'Regular',
    'nextday': 'Nextday',
    'sameday': 'Sameday',
    'cargo': 'Cargo',
    'document': 'Document'
  };

  // Properties for drag functionality
  private touchStartY: number = 0;
  private touchCurrentY: number = 0;
  private readonly DRAG_THRESHOLD = 150; // Minimum drag distance to close
  private isDragging = false;

  constructor() {
 
  }

  ngOnInit() {
    this.initializeServiceType();
  }

  ngOnChanges(changes: SimpleChanges) {
   
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
 
      this.initializeServiceType();
    }
    

  }

  initializeServiceType() {

    
    if (this.selectedCourierId) {
      const selectedCourier = this.courierOptions.find(c => c.id === this.selectedCourierId);
      if (selectedCourier) {
        this.activeServiceType = selectedCourier.serviceType;
        return;
      }
    }
    
    if (this.availableServiceTypes.length > 0) {
      this.activeServiceType = this.availableServiceTypes[0];
    } else {
      this.activeServiceType = 'regular';
    }
  }

  get filteredOptions(): CourierOption[] {
    const filtered = this.courierOptions.filter(option => option.serviceType === this.activeServiceType);
    return filtered;
  }

  // Get available service types that have at least one option
  get availableServiceTypes(): ServiceType[] {
    const available = this.serviceTypes.filter(type => this.getServiceTypeCount(type) > 0);
    return available;
  }

  // Get count for a specific service type
  getServiceTypeCount(type: ServiceType): number {
    const count = this.courierOptions.filter(option => option.serviceType === type).length;
    return count;
  }

  // Set active service type
  setServiceType(type: ServiceType): void {
    this.activeServiceType = type;
  }

  // Check if a courier is currently selected
  isSelected(courier: CourierOption): boolean {
    const result = this.selectedCourierId === courier.id;
    return result;
  }

  // Touch event handlers for drag indicator
  onDragIndicatorTouchStart(event: TouchEvent) {
    event.preventDefault(); // Prevent scrolling when dragging from indicator
    this.touchStartY = event.touches[0].clientY;
    this.isDragging = true;
    
    const modal = this.modalContainer?.nativeElement;
    if (modal) {
      modal.style.transition = 'none';
    }
  }

  onDragIndicatorTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;
    
    this.touchCurrentY = event.touches[0].clientY;
    const dragDistance = this.touchCurrentY - this.touchStartY;
    
    // Only allow dragging downwards
    if (dragDistance < 0) return;
    
    const modal = this.modalContainer?.nativeElement;
    if (!modal) return;

    // Apply transform with damping effect
    const damping = 0.5;
    modal.style.transform = `translateY(${dragDistance * damping}px)`;
    
    // Add opacity effect to backdrop
    const opacity = 1 - (dragDistance / (this.DRAG_THRESHOLD * 2));
    const overlay = modal.closest('.bg-black');
    if (overlay) {
      overlay.style.setProperty('opacity', Math.max(0, opacity).toString());
    }
  }

  onDragIndicatorTouchEnd(event: TouchEvent) {
    if (!this.isDragging) return;
    
    const modal = this.modalContainer?.nativeElement;
    if (!modal) return;

    const dragDistance = this.touchCurrentY - this.touchStartY;
    
    // Reset transition for smooth animation
    modal.style.transition = 'transform 0.3s ease-out';
    
    if (dragDistance > this.DRAG_THRESHOLD) {
      // Close the modal if dragged beyond threshold
      modal.style.transform = `translateY(100%)`;
      setTimeout(() => this.close(), 300);
    } else {
      // Reset position if not dragged enough
      modal.style.transform = 'translateY(0)';
      const overlay = modal.closest('.bg-black');
      if (overlay) {
        overlay.style.setProperty('opacity', '1');
      }
    }
    
    this.isDragging = false;
    this.touchStartY = 0;
    this.touchCurrentY = 0;
  }

  close() {
    // Reset any transforms before closing
    if (this.modalContainer?.nativeElement) {
      this.modalContainer.nativeElement.style.transform = '';
      this.modalContainer.nativeElement.style.transition = '';
    }
    this.closeModal.emit();
  }

  selectCourier(courier: CourierOption) {
    this.courierSelected.emit(courier);
    this.close();
  }
}