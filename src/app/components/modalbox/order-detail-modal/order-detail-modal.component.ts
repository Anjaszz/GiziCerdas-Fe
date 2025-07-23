import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ElementRef, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';
import { OrderDetailData } from 'src/app/interfaces/draft-order.interface';
import { DraftOrderService } from 'src/app/services/draft-order.service';

export interface OrderItemDetail {
  name: string;
  type: string;
  price: number;
  quantity: number;
  unit? : string;
}

export interface PacketDetail {
  weightShown: number;
  weight: number;
  dimension: string;
  items: OrderItemDetail[];
}

export interface PickupDataAddress {
  address1: string;
  address2: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  postal: string;
}

export interface PickupData {
  name: string;
  phone: string;
  email: string | null;
  address: PickupDataAddress;
}

@Component({
  selector: 'app-order-detail-modal',
  standalone: true,
  imports: [CommonModule, IconModule],
  templateUrl: './order-detail-modal.component.html',
  styleUrls: ['./order-detail-modal.component.scss'],

})
export class OrderDetailModalComponent implements OnChanges,OnInit {
  @Input() isOpen = false;
  @Input() orderData: OrderDetailData | null = null;
  selectedCourierDiscount: number = 0;
discountAmount: number = 0;
totalItemsValue: number = 0;
isLoadingDiscount: boolean = false;
  
  @Output() close = new EventEmitter<void>();
  
  private modalElement: HTMLElement | null = null;
  private isClosing = false;
  
  // For insurance tooltip
  showInsuranceTooltip = false;
  
  constructor(private el: ElementRef, private renderer: Renderer2,private draftOrderService: DraftOrderService) {}
  
  ngOnInit(): void {
    if (this.orderData) {
      this.calculateTotalItemsValue();
      this.calculateDiscount();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && !changes['isOpen'].firstChange) {
      if (changes['isOpen'].currentValue === false && changes['isOpen'].previousValue === true) {
        // Modal is closing, apply closing animation
        this.startCloseAnimation();
      }
    }
    
    // Reset nilai diskon saat data order berubah
    if (changes['orderData'] && changes['orderData'].currentValue) {
      this.selectedCourierDiscount = 0;
      this.discountAmount = 0;
      this.calculateTotalItemsValue();
      this.calculateDiscount();
    }
  }
  
  // Menghitung total nilai barang
  calculateTotalItemsValue(): void {
    if (!this.orderData || !this.orderData.packets) {
      this.totalItemsValue = 0;
      return;
    }
    
    let total = 0;
    this.orderData.packets.forEach(packet => {
      packet.items.forEach(item => {
        total += item.price * item.quantity;
      });
    });
    
    this.totalItemsValue = total;
  }
  
  // Menghitung diskon berdasarkan kode kurir
  calculateDiscount(): void {
    if (!this.orderData) return;
    
    const courierName = this.orderData.courier;
    const courierCode = this.draftOrderService.getCourierCode(courierName);
    
    if (!courierCode) return;
    
    this.isLoadingDiscount = true;
    
    this.draftOrderService.getBusinessInfo().subscribe({
      next: (businessInfo) => {
        const lastmileInfo = businessInfo.lastmile.find(
          lm => lm.lastmile.last_mile_code === courierCode
        );
        
        if (lastmileInfo) {
          // Simpan persentase diskon
          this.selectedCourierDiscount = lastmileInfo.discount;
          
          // Hitung jumlah diskon berdasarkan biaya pengiriman
          // Asumsi biaya pengiriman = total price - insurance
          const shippingCost = this.orderData && this.orderData.totalPrice 
            ? this.orderData.totalPrice - (this.orderData.insuranceValue || 0) 
            : 0;
          
          if (lastmileInfo.discount_type === 'percent' && shippingCost > 0) {
            this.discountAmount = (shippingCost * lastmileInfo.discount) / 100;
          } else {
            this.discountAmount = lastmileInfo.discount;
          }
        }
        
        this.isLoadingDiscount = false;
      },
      error: (error) => {
        console.error('Error fetching business info:', error);
        this.isLoadingDiscount = false;
      }
    });
  }
  
  startCloseAnimation(): void {
    if (this.isClosing) return;
    
    this.isClosing = true;
    const modal = this.el.nativeElement.querySelector('.modal-backdrop');
    const content = this.el.nativeElement.querySelector('.modal-content');
    
    if (modal && content) {
      this.renderer.addClass(content, 'modal-content-closing');
      this.renderer.addClass(modal, 'modal-closing');
      
      setTimeout(() => {
        this.isClosing = false;
        this.close.emit();
      }, 250); // Match animation duration
    } else {
      this.isClosing = false;
      this.close.emit();
    }
  }
  
  onClose(): void {
    this.startCloseAnimation();
  }
  
  onBackdropClick(event: MouseEvent): void {
    this.startCloseAnimation();
  }
  
  toggleInsuranceTooltip(): void {
    this.showInsuranceTooltip = !this.showInsuranceTooltip;
  }
  
  formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value);
  }

  // Menghitung nilai barang per koli
calculatePacketValue(packet: any): number {
  if (!packet || !packet.items) {
    return 0;
  }
  
  let total = 0;
  packet.items.forEach((item: any) => {
    total += item.price * item.quantity;
  });
  
  return total;
}
}