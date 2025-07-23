/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-cash',
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
        d="M14.1667 7.49999V5.83332C14.1667 4.91285 13.4205 4.16666 12.5 4.16666H4.16667C3.24619 4.16666 2.5 4.91285 2.5 5.83332V10.8333C2.5 11.7538 3.24619 12.5 4.16667 12.5H5.83333M7.5 15.8333H15.8333C16.7538 15.8333 17.5 15.0871 17.5 14.1667V9.16666C17.5 8.24618 16.7538 7.49999 15.8333 7.49999H7.5C6.57953 7.49999 5.83333 8.24618 5.83333 9.16666V14.1667C5.83333 15.0871 6.57953 15.8333 7.5 15.8333ZM13.3333 11.6667C13.3333 12.5871 12.5871 13.3333 11.6667 13.3333C10.7462 13.3333 10 12.5871 10 11.6667C10 10.7462 10.7462 9.99999 11.6667 9.99999C12.5871 9.99999 13.3333 10.7462 13.3333 11.6667Z"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class CashIcon {
  @Input() size: string = '20';
  @Input() color: string = '#8993A5';
}
