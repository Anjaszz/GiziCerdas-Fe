/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'add-square-icon',
  standalone: true,
  template: `
    <svg
    [attr.width]="size" 
    [attr.height]="size" 
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.66699 10H13.3337"
         [attr.stroke]="color" 
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10 13.3332V6.6665"
         [attr.stroke]="color" 
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7.50033 18.3332H12.5003C16.667 18.3332 18.3337 16.6665 18.3337 12.4998V7.49984C18.3337 3.33317 16.667 1.6665 12.5003 1.6665L7.50033 1.6665C3.33366 1.6665 1.66699 3.33317 1.66699 7.49984L1.66699 12.4998C1.66699 16.6665 3.33366 18.3332 7.50033 18.3332Z"
         [attr.stroke]="color" 
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class AddSquareIcon{
  @Input() size: string = '20'; // Default size
  @Input() color: string = '#8993A5'; // Default color
}
