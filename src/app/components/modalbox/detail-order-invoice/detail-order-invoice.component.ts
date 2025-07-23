import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderItemDetail } from '../order-detail-modal/order-detail-modal.component';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';


export interface PacketDetail {
  weightShown: number;
  weight: number;
  dimension: string;
  items: OrderItemDetail[];
}

export interface OrderDetailData {
  id: string;
  courier: string;
  serviceType: string;
  logoSrc?: string;
  totalWeight: number;
  totalPackets: number;
  totalPrice: number;
  packets: PacketDetail[];
  sender: {
    name: string;
    phone: string;
    address: string;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
  };
}

@Component({
  selector: 'app-detail-order-invoice',
  templateUrl: './detail-order-invoice.component.html',
  styleUrls: ['./detail-order-invoice.component.scss'],
  imports: [CommonModule,IconModule],
  standalone: true
})
export class DetailOrderInvoiceComponent  {
  @Input() isOpen = false;
  @Input() orderData: OrderDetailData | null = null;
  
  @Output() close = new EventEmitter<void>();
  
  onClose() {
    this.close.emit();
  }
  
  onBackdropClick(event: MouseEvent) {
    this.close.emit();
  }
  
  formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value);
  }
}
