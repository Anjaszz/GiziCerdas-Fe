/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-book-open',
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
        d="M10 5.21049V16.0438M10 5.21049C9.02675 4.56389 7.70541 4.1665 6.25 4.1665C4.79459 4.1665 3.47325 4.56389 2.5 5.21049V16.0438C3.47325 15.3972 4.79459 14.9998 6.25 14.9998C7.70541 14.9998 9.02675 15.3972 10 16.0438M10 5.21049C10.9732 4.56389 12.2946 4.1665 13.75 4.1665C15.2054 4.1665 16.5268 4.56389 17.5 5.21049V16.0438C16.5268 15.3972 15.2054 14.9998 13.75 14.9998C12.2946 14.9998 10.9732 15.3972 10 16.0438"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class BookOpenIcon {
  @Input() size: string = '20';
  @Input() color: string = '#8993A5';
}
