/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'location-fill-icon',
  standalone: true,
  template: `
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.1282 8.5641C16.1282 15.1282 9.5641 18 9.5641 18C9.5641 18 3 15.1282 3 8.5641C3 4.93885 5.93885 2 9.5641 2C13.1894 2 16.1282 4.93885 16.1282 8.5641Z"
        [attr.fill]="color"
      />
      <circle cx="9.5633" cy="8.5633" r="3.28205" fill="white" />
    </svg>
  `,
})
export class LocationFillIconComponent {
  @Input() size: string = '20';
  @Input() color: string = '#3815FF';
}
