import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-user-icon',
  standalone: true,
  imports: [],
  template: `
             <svg 
  xmlns="http://www.w3.org/2000/svg" 
  [attr.width]="size"
  [attr.height]="size"
  class="scale-150 transform translate-y-1"
  viewBox="0 0 24 24"
  fill="#b5b7bb">
  <path d="M12 11.5c1.93 0 3.5-1.57 3.5-3.5S13.93 4.5 12 4.5 8.5 6.07 8.5 8s1.57 3.5 3.5 3.5zm0 2c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"/>
</svg>

  `
})
export class UserIconComponent {
    @Input() size: string = '50';
}