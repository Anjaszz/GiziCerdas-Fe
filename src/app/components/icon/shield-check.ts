/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'shield-check-icon',
  standalone: true,
  template: `
   <svg [attr.width]="size" 
   [attr.height]="size" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 9.99952L9.16667 11.6662L12.5 8.33285M17.1816 4.98646C17.011 4.99511 16.8394 4.99949 16.6667 4.99949C14.1055 4.99949 11.7691 4.03662 9.99994 2.45312C8.23076 4.03656 5.89449 4.99939 3.33333 4.99939C3.16065 4.99939 2.98898 4.99501 2.81844 4.98636C2.61059 5.78937 2.5 6.63153 2.5 7.49952C2.5 12.1591 5.68693 16.0744 10 17.1845C14.3131 16.0744 17.5 12.1591 17.5 7.49952C17.5 6.63157 17.3894 5.78944 17.1816 4.98646Z" [attr.stroke]="color" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


  `
})
export class ShieldCheckIcon {
  @Input() size: string = '20';  // Default size
  @Input() color: string = '#8993A5';  // Default color
}