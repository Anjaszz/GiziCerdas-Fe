/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ic-trash',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.666 4.66667L12.0878 12.7617C12.038 13.4594 11.4574 14 10.7579 14H5.24084C4.54132 14 3.96073 13.4594 3.9109 12.7617L3.33268 4.66667M6.66602 7.33333V11.3333M9.33268 7.33333V11.3333M9.99935 4.66667V2.66667C9.99935 2.29848 9.70087 2 9.33268 2H6.66602C6.29783 2 5.99935 2.29848 5.99935 2.66667V4.66667M2.66602 4.66667H13.3327"
        [attr.stroke]="color"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
})
export class TrashIconComponent {
  @Input() size: string = '16'; // Default size
  @Input() color: string = '#111827'; // Default color
}
