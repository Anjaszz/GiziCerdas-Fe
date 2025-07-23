/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-box',
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
        d="M2.6417 6.19999L10 10.4583L17.3083 6.22497M10 18.0083V10.45M14.1667 11.0333V7.98334L6.25836 3.41664M8.27501 2.06666L3.82502 4.54168C2.81668 5.10002 1.9917 6.5 1.9917 7.65V12.3584C1.9917 13.5084 2.81668 14.9083 3.82502 15.4667L8.27501 17.9417C9.22501 18.4667 10.7833 18.4667 11.7333 17.9417L16.1834 15.4667C17.1917 14.9083 18.0167 13.5084 18.0167 12.3584V7.65C18.0167 6.5 17.1917 5.10002 16.1834 4.54168L11.7333 2.06666C10.775 1.53332 9.22501 1.53332 8.27501 2.06666Z"
       [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class BoxIcon {
  @Input() size: string = '20';
  @Input() color: string = '#8993A5';
}
