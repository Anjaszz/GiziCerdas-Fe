/* eslint-disable @angular-eslint/component-class-suffix */
/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-arrow-up-right',
  standalone: true,
  template: `
    <svg
     [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 14.6667L16 10.6667M16 10.6667L20 14.6667M16 10.6667L16 21.3333M16 4C22.6274 4 28 9.37258 28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4Z"
        [attr.stroke]="color"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class ArrowUpRightIcon {
  @Input() size: string = '32';
  @Input() color: string = '#3815FF';
}
