/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-x-icon',
  standalone: true,
  template: `
   <svg [attr.width]="size" 
   [attr.height]="size" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.99999 4.99999L1 1M5.00001 1L1 5.00001" [attr.stroke]="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  `
})
export class XIconComponent {
  @Input() color: string = '#FF4242';  // Default color
  @Input() size: string = '6';  // Default size
}

// Cara penggunaan dalam template:
// <ic-check-simple color="red"></ic-check-simple>
// <ic-check-simple color="#00ff00"></ic-check-simple>
// <ic-check-simple color="rgb(0, 0, 255)"></ic-check-simple>