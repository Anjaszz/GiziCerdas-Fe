/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'sms-square-icon',
  standalone: true,
  template: `
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"
        stroke="#3815FF"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class SmsSquareIcon {
  @Input() size: string = '24';
  @Input() color: string = '#3815FF';
}
