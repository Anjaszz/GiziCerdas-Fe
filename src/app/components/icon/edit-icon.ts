/* eslint-disable @angular-eslint/component-selector */
// arrow-right.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'edit-icon',
  standalone: true,
  template: `
<svg [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.33325 1.3335H5.99992C2.66659 1.3335 1.33325 2.66684 1.33325 6.00017V10.0002C1.33325 13.3335 2.66659 14.6668 5.99992 14.6668H9.99992C13.3333 14.6668 14.6666 13.3335 14.6666 10.0002V8.66684M9.93992 2.76684C10.3866 4.36017 11.6333 5.60684 13.2333 6.06017M10.6933 2.0135L5.43992 7.26684C5.23992 7.46684 5.03992 7.86017 4.99992 8.14684L4.71325 10.1535C4.60659 10.8802 5.11992 11.3868 5.84659 11.2868L7.85325 11.0002C8.13325 10.9602 8.52659 10.7602 8.73325 10.5602L13.9866 5.30684C14.8933 4.40017 15.3199 3.34684 13.9866 2.0135C12.6533 0.680168 11.5999 1.10684 10.6933 2.0135Z" [attr.stroke]="color" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `
})
export class EditIconComponent {
  @Input() size: string = '16';  
  @Input() color: string = '#44546F';  
}