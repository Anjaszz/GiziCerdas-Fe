/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-chevron-fill-up',
  standalone: true,
  template: `
    <svg
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.704579 4.09087H7.06812C7.19123 4.09087 7.2978 4.04592 7.38772 3.95594C7.4776 3.86599 7.52272 3.75947 7.52272 3.63636C7.52272 3.51325 7.47762 3.40678 7.38772 3.31671L4.20594 0.134926C4.11604 0.0450749 4.00955 0 3.88636 0C3.76318 0 3.65668 0.0450749 3.56671 0.134926L0.384926 3.31671C0.29495 3.40668 0.25 3.51325 0.25 3.63636C0.25 3.75945 0.29495 3.86599 0.384926 3.95594C0.475001 4.04592 0.581494 4.09087 0.704579 4.09087Z"
        [attr.fill]="color"
      />
    </svg>
  `,
})
export class ChevronFillUpIcon {
  @Input() color: string = '#8993A5'; 
}
