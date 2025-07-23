/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-receipt-search',
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
        d="M17.0834 9.41668V5.86669C17.0834 2.50836 16.3001 1.66669 13.1501 1.66669H6.85008C3.70008 1.66669 2.91675 2.50836 2.91675 5.86669V15.25C2.91675 17.4667 4.13342 17.9917 5.60842 16.4084L5.61674 16.4C6.30007 15.675 7.34174 15.7333 7.93341 16.525L8.77508 17.65M18.3334 18.3334L17.5001 17.5M6.66675 5.83335H13.3334M7.50008 9.16669H12.5001M17.8334 15.1667C17.8334 16.6395 16.6395 17.8333 15.1668 17.8333C13.694 17.8333 12.5001 16.6395 12.5001 15.1667C12.5001 13.6939 13.694 12.5 15.1668 12.5C16.6395 12.5 17.8334 13.6939 17.8334 15.1667Z"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class ReceiptSearchIcon {
  @Input() size: string = '20';
  @Input() color: string = '#8993A5';
}
