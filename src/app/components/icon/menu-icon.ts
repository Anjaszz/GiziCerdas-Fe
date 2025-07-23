/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'menu-icon',
  standalone: true,
  template: `
    <svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.22461 6.00078C4.22461 5.33804 4.76187 4.80078 5.42461 4.80078H19.8246C20.4874 4.80078 21.0246 5.33804 21.0246 6.00078C21.0246 6.66352 20.4874 7.20078 19.8246 7.20078H5.42461C4.76187 7.20078 4.22461 6.66352 4.22461 6.00078Z"
         [attr.fill]="color"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.22461 12.0008C4.22461 11.338 4.76187 10.8008 5.42461 10.8008H19.8246C20.4874 10.8008 21.0246 11.338 21.0246 12.0008C21.0246 12.6635 20.4874 13.2008 19.8246 13.2008H5.42461C4.76187 13.2008 4.22461 12.6635 4.22461 12.0008Z"
         [attr.fill]="color"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.22461 18.0008C4.22461 17.338 4.76187 16.8008 5.42461 16.8008H19.8246C20.4874 16.8008 21.0246 17.338 21.0246 18.0008C21.0246 18.6635 20.4874 19.2008 19.8246 19.2008H5.42461C4.76187 19.2008 4.22461 18.6635 4.22461 18.0008Z"
        [attr.fill]="color"
      />
    </svg>
  `,
})
export class MenuIconComponent {
  @Input() size: string = '24';
  @Input() color: string = '#44546F';
}
