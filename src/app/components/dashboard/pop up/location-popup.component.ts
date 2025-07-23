import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-popup',
  standalone: true,
  imports: [CommonModule, IconModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 h-fit z-50 my-auto flex md:block md:fixed md:inset-auto">
        <div class="popup-content bg-white rounded-lg shadow-lg border border-gray-200 
                    w-[calc(100%-32px)] max-w-[280px] mx-auto mt-auto mb-auto relative
                    md:absolute md:right-0 md:top-2 md:mt-5 md:mx-0 md:w-[260px]">
          <close-icon class="absolute right-2 top-1 cursor-pointer" (click)="closePopup()"/>
          <img src="assets/bg-location.svg" alt="Location Icon" class="w-full h-full">
          <div class="bg-white px-4 pb-4 flex flex-col gap-3">
            <div>
              <h2 class="text-base font-semibold text-text-bolder">Cek Resi Publik</h2>
              <p class="text-text-subtler max-w-[15rem] text-sm">
                Halaman ini dikhususkan untuk customer kamu jika dia mau Cek Resi dari pesanannya
              </p>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center rounded-lg border border-line-default">
                <span class="text-text-bolder py-2 px-3 text-sm tracking-custom truncate border-r border-line-default">
                  {{publicUrl}}
                </span>
                <!-- Perbaikan di sini: pointer-events-auto dan z-index -->
                <button 
                  class="flex items-center gap-[6px] py-2 p-2 pointer-events-auto relative"
                  (click)="copyToClipboard($event)"
                  [class.text-success-default]="copied">
                  <copy-icon></copy-icon>
                  <span class="text-text-bolder text-sm font-semibold">
                    {{copied ? 'Copied!' : 'Copy'}}
                  </span>
                </button>
              </div>
              <div class="flex gap-2 items-center justify-center">
                <div class="border border-line-default rounded-md p-2 w-full">
                  <button class="flex items-center justify-center w-full gap-[6px] text-sm font-semibold text-text-subtle" 
                          (click)="onEdit()">
                    <span>Edit</span>
                    <edit-icon></edit-icon>
                  </button>
                </div>
                <div class="border border-line-default rounded-md p-2 w-full">
                  <button class="flex items-center justify-center w-full gap-[6px] text-sm font-semibold text-text-subtle"
                          (click)="onVisit()">
                    <span>Kunjungi</span>
                    <visit-link-icon></visit-link-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }

    @media (max-width: 768px) {
      .popup-content {
        animation: slideUp 0.3s ease-out forwards;
        pointer-events: auto; /* Penting: memastikan events bisa ditangkap */
      }

      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    }
  `]
})
export class LocationPopupComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();
  
  publicUrl = 'pakdome.com/transaksi/sfbvceinviev';
  copied = false;
  
  constructor(private router: Router) {}
  
  async copyToClipboard(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    try {
      await navigator.clipboard.writeText(this.publicUrl);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      
    }
  }
  
  onEdit() {
    this.router.navigate(['/transaksi/edit', 'sfbvceinviev']);
    alert('Edit clicked');
  }
  
  onVisit() {
    const url = `https://${this.publicUrl}`;
    window.open(url, '_blank');
  }

  closePopup() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}