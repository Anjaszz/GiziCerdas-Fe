/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-credit-card',
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
        d="M2.5 8.33317H17.5M5.83333 12.4998H6.66667M10 12.4998H10.8333M5 15.8332H15C16.3807 15.8332 17.5 14.7139 17.5 13.3332V6.6665C17.5 5.28579 16.3807 4.1665 15 4.1665H5C3.61929 4.1665 2.5 5.28579 2.5 6.6665V13.3332C2.5 14.7139 3.61929 15.8332 5 15.8332Z"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class CreditCardIcon {
  @Input() size: string = '20';
  @Input() color: string = '#8993A5';
}
