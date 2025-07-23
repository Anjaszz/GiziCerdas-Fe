/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-grid',
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
        d="M3.33325 5.00001C3.33325 4.07954 4.07944 3.33334 4.99992 3.33334H6.66659C7.58706 3.33334 8.33325 4.07954 8.33325 5.00001V6.66668C8.33325 7.58715 7.58706 8.33334 6.66659 8.33334H4.99992C4.07944 8.33334 3.33325 7.58715 3.33325 6.66668V5.00001Z"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.6666 5.00001C11.6666 4.07954 12.4128 3.33334 13.3333 3.33334H14.9999C15.9204 3.33334 16.6666 4.07954 16.6666 5.00001V6.66668C16.6666 7.58715 15.9204 8.33334 14.9999 8.33334H13.3333C12.4128 8.33334 11.6666 7.58715 11.6666 6.66668V5.00001Z"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.33325 13.3333C3.33325 12.4129 4.07944 11.6667 4.99992 11.6667H6.66659C7.58706 11.6667 8.33325 12.4129 8.33325 13.3333V15C8.33325 15.9205 7.58706 16.6667 6.66659 16.6667H4.99992C4.07944 16.6667 3.33325 15.9205 3.33325 15V13.3333Z"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.6666 13.3333C11.6666 12.4129 12.4128 11.6667 13.3333 11.6667H14.9999C15.9204 11.6667 16.6666 12.4129 16.6666 13.3333V15C16.6666 15.9205 15.9204 16.6667 14.9999 16.6667H13.3333C12.4128 16.6667 11.6666 15.9205 11.6666 15V13.3333Z"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class GridIcon {
  @Input() size: string = '20';
  @Input() color: string = '#8993A5';
}
