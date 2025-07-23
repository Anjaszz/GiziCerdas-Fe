import { Component, Input, ContentChild, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeBgColor = 'default' | 'secondary' | 'green' | 'red' | 'blue' | 'gray' | 'cyan';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'pill' | 'default';

@Component({
  selector: 'app-badge-with-bg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badges-with-bg.component.html'
})
export class BadgeWithBgComponent {
  @Input() bgColor: BadgeBgColor = 'default';
  @Input() size: BadgeSize = 'md';
  @Input() variant: BadgeVariant = 'default';

  // Output untuk close event
  closed = output<void>();

  @ContentChild('icon') icon?: any;

  getBadgeClasses(): string {
    const baseClasses = 'inline-flex items-center font-medium';
    
    const sizeClasses = {
      sm: 'px-[6px] py-[2px] gap-1 text-sm',
      md: 'px-2 py-1 gap-1.5 text-base',
      lg: 'px-2 py-1 gap-2 text-base'
    };

    const variantClasses = {
      pill: 'rounded-full',
      default: 'rounded-md'
    };

    const bgClasses = {
      default: 'bg-tint-brand-default text-bold-brand-subtle',
      secondary: 'bg-tint-yellow-default text-text-secondary',
      green: 'bg-tint-green-default text-text-success',
      red: 'bg-tint-error-default text-text-error',
      blue: 'bg-tint-blue-default text-text-discovery',
      cyan: 'bg-tint-cyan-default text-text-info',
      gray: 'bg-alpha-2 text-text-subtler'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${variantClasses[this.variant]} ${bgClasses[this.bgColor]}`.trim();
  }

  getIconClasses(): string {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return sizeClasses[this.size];
  }

  onClose(event: Event) {
    event.stopPropagation(); // Mencegah event bubbling
    this.closed.emit();
  }
}