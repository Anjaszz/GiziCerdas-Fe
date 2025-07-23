/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-shield-exclamation',
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
        d="M10 7.50001V9.16668M10 12.5H10.0083M17.1816 4.98695C17.011 4.9956 16.8394 4.99998 16.6667 4.99998C14.1055 4.99998 11.7691 4.03711 9.99994 2.45361C8.23076 4.03705 5.89449 4.99987 3.33333 4.99987C3.16065 4.99987 2.98898 4.9955 2.81844 4.98685C2.61059 5.78986 2.5 6.63202 2.5 7.50001C2.5 12.1596 5.68693 16.0749 10 17.185C14.3131 16.0749 17.5 12.1596 17.5 7.50001C17.5 6.63206 17.3894 5.78993 17.1816 4.98695Z"
       [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class ShieldExclamationIcon {
  @Input() size: string = '20';
  @Input() color: string = '#8993A5';
}
