/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'copy-icon',
  standalone: true,
  template: `
  <svg [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.33341 4.66667V10C5.33341 10.7364 5.93037 11.3333 6.66675 11.3333H10.6667M5.33341 4.66667V3.33333C5.33341 2.59695 5.93037 2 6.66675 2H9.72394C9.90075 2 10.0703 2.07024 10.1953 2.19526L13.1382 5.13807C13.2632 5.2631 13.3334 5.43266 13.3334 5.60948V10C13.3334 10.7364 12.7365 11.3333 12.0001 11.3333H10.6667M5.33341 4.66667H4.66675C3.56218 4.66667 2.66675 5.5621 2.66675 6.66667V12.6667C2.66675 13.403 3.2637 14 4.00008 14H8.66675C9.77132 14 10.6667 13.1046 10.6667 12V11.3333" [attr.stroke]="color" stroke-linecap="round" stroke-linejoin="round"/>
</svg>



  `
})
export class CopyIconComponent {
  @Input() size: string = '16';  
  @Input() color: string = '#44546F';  
}