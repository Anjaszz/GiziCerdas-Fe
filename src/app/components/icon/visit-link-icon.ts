/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'visit-link-icon',
  standalone: true,
  template: `
<svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.16675 3.99984H4.50008C3.7637 3.99984 3.16675 4.59679 3.16675 5.33317V11.9998C3.16675 12.7362 3.7637 13.3332 4.50008 13.3332H11.1667C11.9031 13.3332 12.5001 12.7362 12.5001 11.9998V9.33317M9.83341 2.6665H13.8334M13.8334 2.6665V6.6665M13.8334 2.6665L7.16675 9.33317"  [attr.stroke]="color" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

  `
})
export class VisitLinkIconComponent {
  @Input() size: string = '16';  
  @Input() color: string = '#44546F';  
}