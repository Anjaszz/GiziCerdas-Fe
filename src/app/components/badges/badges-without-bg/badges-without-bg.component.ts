import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeColor = 'default' | 'secondary' | 'green' | 'red' | 'blue' | 'iconBolder';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'pill' | 'default';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badges-without-bg.component.html'
})
export class BadgeComponent {
  @Input() color: BadgeColor = 'default';
  @Input() size: BadgeSize = 'md';
  @Input() variant: BadgeVariant= 'default';

  getBadgeClasses(): string {
    const baseClasses = 'inline-flex items-center bg-surface-default text-text-subtler shadow-sm border border-line-default font-medium';
    
    const sizeClasses = {
      sm: 'px-2 py-0.5 gap-1.5 text-xs',
      md: 'px-3 py-1 gap-2 text-base',
      lg: 'px-3 py-1.5 gap-2.5 text-base'
    };

    const VariantClasses = {
      pill: 'rounded-full',
      default: 'rounded-md'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${VariantClasses[this.variant]}`.trim();
  }

  getDotClasses(): string {
    const ColorClasses = {
      default: 'bg-bold-brand-default',
      secondary: 'bg-bold-yellow-default',
      green: 'bg-bold-green-default',
      red: 'bg-bold-error-default',
      blue: 'bg-bold-blue-default',
      iconBolder: 'bg-icon-bolder'
    };

    const sizeClasses = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5'
    };

    return `rounded-full ${ColorClasses[this.color]} ${sizeClasses[this.size]}`;
  }
}