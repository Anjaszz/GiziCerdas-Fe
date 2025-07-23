// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-right',
  standalone: true,
  template: `
    <svg 
      [attr.width]="size" 
      [attr.height]="size" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M9.61914 3.95331L13.6658 7.99998L9.61914 12.0466" 
        [attr.stroke]="color" 
        stroke-width="2" 
        stroke-miterlimit="10" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
      <path 
        d="M2.33398 8H13.554" 
        [attr.stroke]="color" 
        stroke-width="2" 
        stroke-miterlimit="10" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      />
    </svg>
  `
})
export class ArrowRightComponent {
  @Input() size: string = '16';  // Default size
  @Input() color: string = '#44546F';  // Default color
}