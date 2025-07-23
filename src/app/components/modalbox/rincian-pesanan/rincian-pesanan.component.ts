import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconModule } from '../../icon/icon.module';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../button/button.component";

@Component({
  selector: 'app-rincian-pesanan',
  templateUrl: './rincian-pesanan.component.html',
  styleUrls: ['./rincian-pesanan.component.scss'],
  standalone: true,
  imports: [IconModule, CommonModule, ButtonComponent],
})
export class RincianPesananComponent  implements OnInit {
  @Input() isOpen = false;
  @Input() totalPackets = 0;
  @Input() totalWeight = 0;
  @Input() totalShippingCost = 0;
  @Input() totalInsuranceValue = 0; // Tambahkan properti baru untuk nilai asuransi
  @Input() discount = 0;
  @Input() subTotal = 0;
  @Input() tax = 0;
  @Input() totalAmount = 0;
  @Input() selectedDraftOrdersCount = 0;

  @Input() totalDiscountAmount = 0; // Tambahkan properti baru untuk total diskon
  @Input() selectedOrdersCount = 0; // Tambahkan properti baru untuk total asuransi
  
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() processOrders = new EventEmitter<void>();
  
  close() {
    this.closeModal.emit();
  }

  processOrdersClick() {
    this.processOrders.emit();
  }
  
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID').format(amount);
  }
  constructor() { }

  ngOnInit() {}

}