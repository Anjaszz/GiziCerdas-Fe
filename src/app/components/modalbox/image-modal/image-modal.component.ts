// image-modal.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [CommonModule,IconModule],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="relative bg-white p-2 rounded-lg lg:max-w-3xl lg:max-h-[90vh] sm:max-w-2xl sm:max-h-[60vh] max-w-xl max-h-[50vh]">
        <div class="absolute sm:top-6 sm:right-6 top-3 right-3 flex gap-2">
          <!-- Download Button -->
          <button 
            (click)="downloadImage()" 
            class="text-gray-600 bg-surface-default lg:p-4 p-2 rounded-full "
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>

          <!-- Close Button -->
          <button 
            (click)="closeModal()" 
            class="text-gray-600 bg-surface-default lg:p-4 p-2 rounded-full"
          >
            <close-icon ></close-icon>
          </button>
        </div>
        
        <img 
          [src]="imageUrl || ''" 
          alt="Enlarged image" 
          class="lg:max-h-[80vh] sm:max-h-[50vh] max-h-[40vh] w-auto"
        >
      </div>
    </div>
  `
})
export class ImageModalComponent {
  @Input() imageUrl?: string;
  isOpen: boolean = false;

  openModal() {
    if (this.imageUrl) {
      this.isOpen = true;
    }
  }

  closeModal() {
    this.isOpen = false;
  }

  downloadImage() {
    if (this.imageUrl) {
      // Membuat anchor element
      const link = document.createElement('a');
      link.href = this.imageUrl;
      
      // Mengambil nama file dari URL atau menggunakan default
      const fileName = this.imageUrl.split('/').pop() || 'downloaded-image.jpg';
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}