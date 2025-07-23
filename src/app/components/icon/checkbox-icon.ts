/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'checkbox-icon',
  standalone: true,
  template: `
    <svg
      width="15"
      height="15"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.33366 2.5L3.75033 7.08333L1.66699 5"
        [attr.stroke]="color"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class CheckboxIconComponent {
  @Input() color: string = 'currentColor';
}

// Cara penggunaan dalam template:
// <ic-check-simple color="red"></ic-check-simple>
// <ic-check-simple color="#00ff00"></ic-check-simple>
// <ic-check-simple color="rgb(0, 0, 255)"></ic-check-simple>
