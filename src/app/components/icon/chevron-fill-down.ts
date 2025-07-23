/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-chevron-fill-down',
  standalone: true,
  template: `
    <svg
      [attr.width]="width"
      [attr.height]="height"
      viewBox="0 0 8 5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.06812 0.910156H0.704579C0.581395 0.910156 0.474902 0.955132 0.384926 1.04501C0.29495 1.13498 0.25 1.24148 0.25 1.36459C0.25 1.4877 0.29495 1.59426 0.384926 1.68419L3.56671 4.86592C3.65678 4.9559 3.76328 5.00095 3.88636 5.00095C4.00945 5.00095 4.11604 4.9559 4.20594 4.86592L7.38772 1.68417C7.4776 1.59426 7.52272 1.4877 7.52272 1.36456C7.52272 1.24148 7.47762 1.13498 7.38772 1.04498C7.29782 0.955032 7.19123 0.910156 7.06812 0.910156Z"
        [attr.fill]="color"
      />
    </svg>
  `,
})
export class ChevronFillDownIcon {
  @Input() color: string = '#8993A5';
  @Input() width: string = '8';
  @Input() height: string = '5';
}
