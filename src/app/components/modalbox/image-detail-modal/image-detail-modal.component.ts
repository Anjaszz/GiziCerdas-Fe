// image-modal.component.ts
import { Component, Input, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconModule } from '../../icon/icon.module';

@Component({
  selector: 'app-image-detail-modal',
  templateUrl: './image-detail-modal.component.html',
  styleUrls: ['./image-detail-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IconModule]
})
export class ImageDetailModalComponent  {
  @Input() images: {id: number, url: string}[] = [];
  @Input() initialIndex: number = 0;
  
  currentIndex: number = 0;
  isOpen: boolean = false;

  openModal() {
    if (this.images && this.images.length > 0) {
      this.currentIndex = this.initialIndex;
      this.isOpen = true;
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    this.isOpen = false;
    // Re-enable scrolling
    document.body.style.overflow = '';
  }

  nextImage() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Loop back to the first image
    }
  }

  prevImage() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.images.length - 1; // Loop to the last image
    }
  }

  selectImage(index: number) {
    this.currentIndex = index;
  }

  downloadImage() {
    const currentImage = this.images[this.currentIndex];
    if (currentImage?.url) {
      // Create anchor element
      const link = document.createElement('a');
      link.href = currentImage.url;
      
      // Get filename from URL or use default
      const fileName = currentImage.url.split('/').pop() || `payment-proof-${currentImage.id}.jpg`;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}