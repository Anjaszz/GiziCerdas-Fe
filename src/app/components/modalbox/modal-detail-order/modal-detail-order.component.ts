import { Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { CustomDateTrolleyPipe } from '../../../Pipes/custom-date-trolley.pipe';
import { LastTrackPipe, PriceFormatPipe } from '../../../Pipes/price-format.pipe';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

import { Button2Component } from '../../button2/button.component';
import { IconModule } from '../../icon/icon.module';
import { selectedAwb } from 'src/app/interfaces/common-type';
import { IconSingleComponent } from "../../icon/icon-single/icon-single.component";
import { DataDetailOrder } from 'src/definition/order-detail.definition';
import { BookingService } from 'src/app/services/list-order.service';
import { TransactionStatusPipe } from 'src/app/Pipes/transaction-status.pipe';
import { AlertService } from '../../alert/alertservice';
import { ButtonComponent } from "../../button/button.component";

@Component({
   selector: 'app-modal-detail-order',
   standalone: true,
   imports: [
    SkeletonModule,
    CustomDateTrolleyPipe,
    PriceFormatPipe,
    DialogModule,
    IconModule,
    Button2Component,
    CommonModule,
    LastTrackPipe,
    IconSingleComponent,
    TransactionStatusPipe,
    ButtonComponent
],
   templateUrl: './modal-detail-order.component.html',
   styleUrl: './modal-detail-order.component.css',
   
   
})
export class ModalDetailOrderComponent implements OnInit,OnChanges {
   dummyDate = new Date();

   // dateExample = DateExample;

   @Input()
   visibleDetailOrder: boolean = false;
   @Input()
   detailOrder: DataDetailOrder | null = null;
   @Input()
   error: boolean = false;
   @Input()
   loading: boolean = false;
   @Input()
   bodyPrint: { name: string; value: string }[] = [];
   @Input()
   flag: string = '';

   @Output()
   handleCloseModal: EventEmitter<void> = new EventEmitter();
   @Output()
   handleDeleteFromDetailFlag: EventEmitter<void> = new EventEmitter();
   @Output()
   printAwb: EventEmitter<selectedAwb> = new EventEmitter();
   isModalPrint: boolean = false;
   isModalDownload: boolean = false;
   isLoadingDiscount: boolean = false;

   selectedAwb: selectedAwb = {
      id: 0,
      flagDownloadorPrint: false,
      awb: '',
   };

   // Copy feedback properties
   copySuccess: string | null = null;
   showCopyFeedback: boolean = false;
   selectedCourierDiscount: number = 0;
discountAmount: number = 0;

   get accountType() {
      if (!this.detailOrder) return '';
      
      return this.detailOrder.b2c_id !== null ? 'B2C' :
             this.detailOrder.b2b_id !== null ? 'B2B' :
             this.detailOrder.admin_id !== null ? 'Admin' : 
             '-';
   }

   constructor(
      private router: Router,
      private bookingService: BookingService,
      private toastService: AlertService
    ) {}

   async ngOnInit(): Promise<void> {
      if (this.detailOrder) {
         this.calculateDiscount();
       }
   }


   ngOnChanges(changes: SimpleChanges): void {
      if (changes['detailOrder']) {
        // Reset nilai diskon terlebih dahulu
        this.selectedCourierDiscount = 0;
        this.discountAmount = 0;
        
        // Hanya lakukan perhitungan jika detailOrder tidak null
        if (changes['detailOrder'].currentValue) {
          // Tambahkan waktu tunda singkat untuk memastikan DOM diperbarui
          setTimeout(() => {
            this.calculateDiscount();
          }, 0);
        }
      }
    }

   flagDeletefromDetail() {
      this.handleDeleteFromDetailFlag.emit();
   }

   handleCloseModalLocal() {
      this.selectedCourierDiscount = 0;
      this.discountAmount = 0;
      this.handleCloseModal.emit();
   }

   // Copy to clipboard functionality
   copyToClipboard(text: string, type: string): void {
      if (!text || text === '-') return;
      
      navigator.clipboard.writeText(text).then(
         () => {
            this.copySuccess = type;
            this.showCopyFeedback = true;
            
            // Hide the copy feedback message after 2 seconds
            setTimeout(() => {
               this.showCopyFeedback = false;
               this.copySuccess = null;
            }, 2000);
         },
        
      );
   }

   printAwbLocal(valueBody: number, flagDownloadorPrint: boolean) {
      this.selectedAwb.id = valueBody;
      this.selectedAwb.flagDownloadorPrint = flagDownloadorPrint;
      if (this.detailOrder?.transaction_airwaybill !== null) {
         this.selectedAwb.awb = this.detailOrder?.transaction_airwaybill ?? '';
      }
      this.printAwb.emit(this.selectedAwb);
   }

   // redirect route
   redirectRoute() {
      this.router.navigateByUrl(
         `/ordertrace?awb=${this.detailOrder?.transaction_airwaybill ?? ''}`
      );
   }

   handleModalPrint() {
      this.isModalPrint = !this.isModalPrint;
   }

   handleModalDownload() {
      this.isModalDownload = !this.isModalDownload;
   }

   handleClickOutside() {
      this.isModalPrint = false;
   }

   private logoMap: { [key: string]: string } = {
      'JTE': 'assets/logos/jnt-express.svg',
      'JNTC': 'assets/logos/jnt-cargo.svg',
      'NINJAEXPRESS': 'assets/logos/ninja-express.svg',
      'POS': 'assets/logos/pos-aja.svg',
      'SAPX': 'assets/logos/sapx.svg',
      'ANTERAJA': 'assets/logos/anteraja.svg',
      'TIKI': 'assets/logos/tiki.svg',
      'PAXEL': 'assets/logos/paxel.svg',
      'WAHANA': 'assets/logos/wahana.svg',
      'FIRSTLOGISTICS': 'assets/logos/first-logistics.svg',
      'JNE': 'assets/logos/jne.svg',
      'LIONPARCEL': 'assets/logos/lion-parcel.svg',
      // Add any other mappings as needed
    };
    
    // Add a getter method to determine the logo URL based on last_mile_code
    get logoUrl(): string {
      if (!this.detailOrder || !this.detailOrder.last_mile || !this.detailOrder.last_mile.last_mile_code) {
        return 'assets/logos/default-courier.svg'; // You might want to add a default logo
      }
      
      const lastMileCode = this.detailOrder.last_mile.last_mile_code.toUpperCase();
      return this.logoMap[lastMileCode] || 'assets/logos/default-courier.svg';
    }

    showPrintMenu: boolean = false;
    isPrinting: boolean = false;
    showloadingPrint: boolean = false;



    // Toggle print menu visibility
    togglePrintMenu(): void {
       this.showPrintMenu = !this.showPrintMenu;
    }

    // Print AWB by size
    printAwbBySize(size: string): void {
       if (!this.detailOrder?.transaction_airwaybill) {
          this.showErrorToast('tidak ada airwaybill yang bisa dicetak');
          return;
       }

       this.isPrinting = true;
       this.showPrintMenu = false;
       this.showloadingPrint = true;
       
       // Convert size parameter to correct format for API
       let sizeParam: string;
       switch(size) {
          case 'ks3':
             sizeParam = 'ks3';
             break;
          case 'a4':
             sizeParam = 'a4';
             break;
          case 'ks8':
          default:
             sizeParam = 'ks8';
             break;
       }

       // Use the service to make the API call
       this.bookingService.printAirwaybill(this.detailOrder.transaction_airwaybill, sizeParam)
          .subscribe({
             next: (response: any) => {
                this.isPrinting = false;
                this.showPrintMenu = false;
                
                if (response.status === 200 && response.data && response.data.view) {
                   // Open the view URL in a new tab
                   window.open(response.data.view, '_blank');
                   this.showloadingPrint = false;
                } else {
                  
                   this.showErrorToast('Gagal mencetak AWB');
                   this.showloadingPrint = false;
                }
             },
             error: (error) => {
                this.isPrinting = false;
                this.showPrintMenu = false;
                this.showloadingPrint = false;
                this.showErrorToast('Gagal mencetak AWB');
                
             }
          });
    }

    trackResi() {
      const airwaybill = this.detailOrder?.transaction_airwaybill;
      
      // Tutup modal terlebih dahulu
      this.visibleDetailOrder = false;
      this.handleCloseModal.emit();
       
      // Verifikasi bahwa nilai sudah berubah
      console.log('Modal closed:', !this.visibleDetailOrder);
      
      // Kemudian navigasi ke halaman cek resi
      if (airwaybill) {
        // Menyimpan airwaybill dalam variabel lokal
        // agar masih bisa diakses setelah detailOrder di-reset
        setTimeout(() => {
          this.router.navigate(['/cek-resi'], { 
             queryParams: { 
                resi: airwaybill,
                autoSearch: 'true'
             } 
          });
        }, 200);
      }
    }

    hasInsurance(): boolean {
      if (!this.detailOrder) return false;
      return typeof this.detailOrder.transaction_insured_value === 'string' && 
             this.detailOrder.transaction_insured_value > '0';
    }
    
    // Property untuk melacak tooltip
    insuranceTooltips: { [key: string]: boolean } = {};
    
    // Method untuk menampilkan tooltip
    handleInsuranceTooltipShow(tooltipId: string, event: MouseEvent): void {
      // Tutup tooltip lain yang mungkin terbuka
      Object.keys(this.insuranceTooltips).forEach(key => {
        if (key !== tooltipId) {
          this.insuranceTooltips[key] = false;
        }
      });
      
      // Tampilkan tooltip ini
      this.insuranceTooltips[tooltipId] = true;
      event.stopPropagation();
    }
    
    // Method untuk menyembunyikan tooltip
    handleInsuranceTooltipHide(tooltipId: string): void {
      this.insuranceTooltips[tooltipId] = false;
    }
    
    // Method untuk toggle tooltip (saat diklik)
    toggleInsuranceTooltip(tooltipId: string, event: MouseEvent): void {
      this.insuranceTooltips[tooltipId] = !this.insuranceTooltips[tooltipId];
      event.stopPropagation();
    }
    
    // Method untuk mengecek apakah tooltip visible
    isInsuranceTooltipVisible(tooltipId: string): boolean {
      return !!this.insuranceTooltips[tooltipId];
    }
    
    // Modifikasi HostListener yang sudah ada untuk menutup tooltip juga
    @HostListener('document:click', ['$event'])
    clickOutside(event: Event): void {
      // Close print menu when clicking outside (kode yang sudah ada)
      if (this.showPrintMenu && !(event.target as HTMLElement).closest('.relative')) {
        this.showPrintMenu = false;
      }
      
      // Close insurance tooltips when clicking outside shield icon
      if (Object.values(this.insuranceTooltips).some(value => value)) {
        if (!(event.target as HTMLElement).closest('shield-check-icon')) {
          // Reset semua tooltip
          Object.keys(this.insuranceTooltips).forEach(key => {
            this.insuranceTooltips[key] = false;
          });
        }
      }
    }

    // Add these methods to the ModalDetailOrderComponent class

// Calculate the sum of item values for a specific koli
calculateKoliTotalValue(koli: any): number {
   if (!koli || !koli.collie_items || !koli.collie_items.length) {
     return 0;
   }
   
   return koli.collie_items.reduce((total: number, item: any) => {
     // Parse the value and multiply by quantity
     const itemValue = parseFloat(item.value || '0') * (parseInt(item.qty) || 1);
     return total + itemValue;
   }, 0);
 }
 
 // Calculate the total value across all kolis
 calculateTotalValue(): number {
   if (!this.detailOrder || !this.detailOrder.collie || !this.detailOrder.collie.length) {
     return 0;
   }
   
   return this.detailOrder.collie.reduce((total: number, koli: any) => {
     return total + this.calculateKoliTotalValue(koli);
   }, 0);
 }

 calculateDiscount(): void {
   const lastMileCode = this.detailOrder?.last_mile?.last_mile_code;
   
   this.isLoadingDiscount = true;
  
   if (!lastMileCode) {
     this.isLoadingDiscount = false;
     return;
   }
 
   this.bookingService.getBusinessInfo().subscribe({
     next: (response) => {
       if (response.status === 200 && response.data) {
         const lastMileInfo = response.data.lastmile.find(
           (info: any) => info.lastmile.last_mile_code === lastMileCode
         );
         
         if (lastMileInfo) {
           // Selalu tampilkan persentase diskon, terlepas dari nilai shipping cost
           this.selectedCourierDiscount = lastMileInfo.discount;
           
           // Hitung discount amount hanya jika ada shipping cost
           const shippingCost = parseFloat(this.detailOrder?.transaction_shipping_cost?.toString() || '0');
           
           if (shippingCost > 0) {
             if (lastMileInfo.discount_type === 'percent') {
               this.discountAmount = (shippingCost * lastMileInfo.discount) / 100;
             } else {
               this.discountAmount = lastMileInfo.discount;
             }
           } else {
             // Jika shipping cost 0, tetapkan discount amount ke 0 tapi TETAP TAMPILKAN persentase
             this.discountAmount = 0;
           }
         }
       }
       this.isLoadingDiscount = true;
     },
     error: (error) => {
       this.showErrorToast('Gagal mendapatkan informasi diskon');
       this.isLoadingDiscount = true;
     }
   });
 }

 isCancelled(): boolean {
  if (!this.detailOrder) return false;
  
  // Cek berdasarkan transaction_status
  const status = this.detailOrder.transaction_status;
  
  // Sesuaikan kondisi ini dengan nilai status yang menunjukkan pembatalan
  // Contoh kemungkinan nilai status untuk pembatalan:
  return status === 2;
}


    private showErrorToast(message: string) {
      this.toastService.show({
        variant: 'closeicon',
        title: '',
        showIcon: false,
        color: 'error',
        message: message,
        detailText: 'Details',
        duration: 5000,
        position: 'top-center',
      });
    }
}