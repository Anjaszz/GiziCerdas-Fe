/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'notif-popup',
  standalone: true,
  imports: [CommonModule, IconModule,RouterLink],
  template: `
<div 
  *ngIf="isOpen"
  class="absolute right-0 top-full mt-2 bg-surface-sunken rounded-lg shadow-lg border border-gray-200 w-[380px] h-[480px] z-50 flex flex-col">
    
    <!-- Header Notifikasi -->
    <div class="bg-surface-default p-3 flex gap-3 justify-between items-center">
        <div class="text-text-bolder font-semibold text-base tracking-custom">Notifikasi</div>
        <div class="p-1">
        <setting-icon  routerLink="/set-notifikasi" class="cursor-pointer"></setting-icon>
        </div>
    </div>
    
    <!-- Konten Notifikasi -->
    <div class="flex-1 flex flex-col justify-center items-center text-center gap-6 p-3">
        <div class="w-[120px] h-[120px]">
            <img src="assets/cek-tarif/empty-result.svg" alt="Notifikasi Icon" class="w-full h-full">
        </div>
        <div class="flex flex-col gap-1 max-w-[18rem] mx-auto">
            <p class="text-text-bolder text-sm font-semibold tracking-custom">
                Belum Ada Notifikasi
            </p>
            <p class="text-text-subtler text-sm tracking-custom">
                Tenang aja kalo ada info menarik, dengan senang hati Pakdome siap kabari
            </p>
        </div>
    </div>
</div>

  `,
})
export class NotifPopupComponent {
  @Input() isOpen = false;

  // The public URL for the receipt check
  publicUrl = 'pakdome.com/transaksi/sfbvceinviev';

  // Track copy state
  copied = false;

  constructor(private router: Router) {}

  // Copy URL to clipboard
  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.publicUrl);
      this.copied = true;

      // Reset copy state after 2 seconds
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
    
    }
  }

  // Navigate to edit page
  onEdit() {
    // You can modify this to navigate to your specific edit route
    this.router.navigate(['/transaksi/edit', 'sfbvceinviev']);
  }

  // Open link in new tab
  onVisit() {
    const url = `https://${this.publicUrl}`;
    window.open(url, '_blank');
  }
}
