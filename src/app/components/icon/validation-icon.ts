// validation-caution-icon.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      [attr.width]="size" 
      [attr.height]="size" 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      [class]="class"
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5ZM10 7.08334C10.3452 7.08334 10.625 7.36309 10.625 7.70834V10.625C10.625 10.9703 10.3452 11.25 10 11.25C9.65482 11.25 9.37500 10.9703 9.37500 10.625V7.70834C9.37500 7.36309 9.65482 7.08334 10 7.08334ZM9.37500 13.125C9.37500 12.7798 9.65482 12.5 10 12.5H10.0083C10.3535 12.5 10.6333 12.7798 10.6333 13.125C10.6333 13.4703 10.3535 13.75 10.0083 13.75H10C9.65482 13.75 9.37500 13.4703 9.37500 13.125Z" fill="currentColor"/>
    </svg>
  `
})
export class ValidationIconComponent {
  @Input() size: number = 20;
  @Input() class: string = '';
}