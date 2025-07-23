// avatar.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../icon/icon.module';

type ThemeColor = 'purple' | 'blue' | 'green' | 'red' | 'cyan';
type StatusType = 'Aktif' | 'Nonaktif' | 'Locked' | 'Suspend';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  standalone: true,
  imports: [CommonModule,IconModule],
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class AvatarComponent implements OnChanges {
  @Input() name?: string;
  @Input() username?: string;
  @Input() brandname?: string;
  @Input() description?: string;
  @Input() imageUrl?: string;
  @Input() variant: 'rounded' | 'square' = 'rounded';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showStatus = false;
  @Input() showInfo = true;
  @Input() status: 'online' | 'offline' | 'busy' = 'offline';
  @Input() className = '';
  @Input() fallbackType: 'initials' | 'icon' = 'initials';
  @Input() theme: ThemeColor = 'purple';
  @Input() statusBadge?: string; // New input for status badge

  @Output() avatarClick = new EventEmitter<MouseEvent>();

  hasImageError = false;
  showCopyNotification: boolean = false;

  sizeMap = {
    sm: '40px',
    md: '48px',
    lg: '56px',
    xl: '60px'
  };

  fontSizeMap = {
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px'
  };

  iconSizeMap = {
    sm: '34',
    md: '42',
    lg: '46',
    xl: '50'
  };

  statusColorMap = {
    online: 'bg-bold-green-default',
    offline: 'bg-bold-error-default',
    busy: 'bg-bold-yellow-default'
  };

  themeColorMap = {
    purple: 'bg-surface-logo',
    blue: 'bg-bold-blue-default',
    green: 'bg-bold-green-default',
    red: 'bg-bold-error-default',
    cyan: 'bg-bold-cyan-default',
  };

  get shouldShowInitials(): boolean {
    const hasNoImage = !this.imageUrl || this.hasImageError;
    const hasName = Boolean(this.name);
    const isInitialsFallback = this.fallbackType === 'initials';
    
    return hasNoImage && hasName && isInitialsFallback;
  }

  get shouldShowIcon(): boolean {
    const hasNoImage = !this.imageUrl || this.hasImageError;
    const isIconFallback = this.fallbackType === 'icon';
    const hasNoName = !this.name;
    
    return hasNoImage && (isIconFallback || hasNoName);
  }

  get containerClasses(): string {
    const baseClasses = 'relative inline-flex border-2 border-white'; 
    const variantClasses = this.variant === 'rounded' ? 'rounded-full' : 'rounded-lg';
    return `${baseClasses} ${variantClasses} ${this.className}`.trim();
  }

  get statusClasses(): string {
    const baseClasses = 'absolute top-0 right-0 rounded-full border border-white';
    const sizeClasses = {
      sm: 'w-2.5 h-2.5',
      md: 'w-3 h-3',
      lg: 'w-3.5 h-3.5',
      xl: 'w-4 h-4'
    };
    return `${baseClasses} ${sizeClasses[this.size]}`;
  }

  getInitials(): string {
    if (!this.name) return '';
    return this.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getStatusBadgeClasses(): string {
    let baseClasses = 'text-xs px-2 py-0.5 rounded-[4px] inline-block';
    
    if (!this.statusBadge) return baseClasses;
    
    // Apply different styles based on status text
    switch (this.statusBadge) {
      case 'Aktif':
        return `${baseClasses} bg-tint-green-default text-text-success`;
      case 'Nonaktif':
      case 'Locked':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'Suspend':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  handleImageError(): void {
    this.hasImageError = true;
  }

  onClick(event: MouseEvent): void {
    this.avatarClick.emit(event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl']) {
      this.hasImageError = false;
    }
  }

  copyname(name: string, event: Event) {
    event.stopPropagation();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(name)
        .then(() => {
          this.showCopySuccessNotification(name);
        })
        .catch(err => {
          console.warn('Clipboard API failed, trying fallback method', err);
          this.copynameFallback(name);
        });
    } else {
      this.copynameFallback(name);
    }
  }
  private copynameFallback(name: string) {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = name;
      
      textarea.style.position = 'fixed';
      textarea.style.left = '0';
      textarea.style.top = '0';
      textarea.style.opacity = '0';
      
      document.body.appendChild(textarea);
      
      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        const range = document.createRange();
        range.selectNodeContents(textarea);
        
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        
        textarea.setSelectionRange(0, 999999);
      } else {
        textarea.select();
      }
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        this.showCopySuccessNotification(name);
      } else {
       console.error('Failed to copy text using fallback method');
      }
    } catch (err) {
     console.error('Fallback copy failed', err);
    }
  }

  private showCopySuccessNotification(name: string) {
    this.showCopyNotification = true;
    
    setTimeout(() => {
      this.showCopyNotification = false;
    }, 3000);
  }
}