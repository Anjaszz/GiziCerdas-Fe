import { Component, Input } from '@angular/core';

@Component({
  selector: 'hamburger-icon',
  standalone: true,
  template: `
    <div class="relative w-8 h-8 cursor-pointer" [class.active]="isOpen">
      <!-- Menu Icon -->
      <svg class="absolute transform-gpu transition-all duration-500 ease-in-out" 
           [class.opacity-0]="isOpen"
           [class.rotate-0]="!isOpen"
           [class.rotate-45]="isOpen"
           [class.scale-0]="isOpen"
           width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Garis atas -->
        <rect class="transform transition-all duration-500 ease-in-out origin-center"
              [class.translate-y-7]="isOpen"
              x="3" y="7" width="25.6" height="3" rx="1.5" fill="#3815FF"/>
        <!-- Garis tengah -->
        <rect class="transform transition-all duration-500 ease-in-out origin-center"
              [class.translate-y-2]="isOpen"
              x="3" y="14" width="25.6" height="3" rx="1.5" fill="#3815FF"/>
        <!-- Garis bawah -->
        <rect class="transform transition-all duration-500 ease-in-out origin-center"
              [class.translate-y-[-7px]]="isOpen"
              [class.translate-x-[12.8px]]="isOpen"
              [class.scale-x-2]="isOpen"
              x="3" y="21" width="12.8" height="3" rx="1.5" fill="#FEBB2B"/>
      </svg>

      <!-- Close Icon -->
      <svg class="absolute transform-gpu transition-all duration-500 ease-in-out" 
           [class.opacity-0]="!isOpen || isFullyOpen"
           [class.scale-0]="!isOpen"
           [class.scale-100]="isOpen && !isFullyOpen"
           [class.rotate-90]="isFullyOpen"
           width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 16.5C3 15.6716 3.67157 15 4.5 15H14.3C15.1284 15 15.8 15.6716 15.8 16.5C15.8 17.3284 15.1284 18 14.3 18H4.5C3.67157 18 3 17.3284 3 16.5Z" fill="#FEBB2B"/>
        <path d="M3 16.5C3 15.6716 3.67157 15 4.5 15H27.1C27.9284 15 28.6 15.6716 28.6 16.5C28.6 17.3284 27.9284 18 27.1 18H4.5C3.67157 18 3 17.3284 3 16.5Z" fill="#3815FF"/>
      </svg>

      <!-- Final Icon -->
      <svg class="absolute transform-gpu transition-all duration-500 ease-in-out" 
           [class.opacity-0]="!isFullyOpen"
           [class.scale-0]="!isFullyOpen"
           [class.scale-100]="isFullyOpen"
           width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="23.8789" y="26" width="25.6" height="3" rx="1.5" transform="rotate(-135 23.8789 26)" fill="#3815FF"/>
        <rect x="26" y="7.89795" width="25.6" height="3" rx="1.5" transform="rotate(135 26 7.89795)" fill="#3815FF"/>
      </svg>
    </div>
  `,
  styles: [`
    .relative {
      position: relative;
    }
    svg {
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      transform-origin: center;
    }
    .scale-0 {
      transform: scale(0);
    }
    .scale-100 {
      transform: scale(1);
    }
  `]
})
export class HamburgerIconComponent {
  @Input() isOpen: boolean = false;
  @Input() isFullyOpen: boolean = false;
}