// toast.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, Alert,AlertColor, AlertPosition, WithListAlert, ActionAlert,DetailAlert,CompletedAlert,CompletedBorderAlert } from './alertservice';
import { 
  trigger, 
  state, 
  style, 
  animate, 
  transition,
  keyframes
} from '@angular/animations';
import { map } from 'rxjs/operators';
import { IconModule } from '../icon/icon.module';


@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule,IconModule],
  templateUrl: './alert.component.html',
  animations: [
    trigger('toastAnimation', [
      state('visible', style({ 
        transform: 'translate(0, 0)',
        opacity: 1
      })),

      // Top Right position
      transition('void => visible-top-right', [
        style({ transform: 'translate(100%, 0)', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition('visible-top-right => void', [
        animate('200ms ease-in', 
          style({ transform: 'translate(-100%, 0)', opacity: 0 })
        )
      ]),

      // Top Left position
      transition('void => visible-top-left', [
        style({ transform: 'translate(-100%, 0)', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition('visible-top-left => void', [
        animate('200ms ease-in', 
          style({ transform: 'translate(-100%, 0)', opacity: 0 })
        )
      ]),

      // Bottom Right position
      transition('void => visible-bottom-right', [
        style({ transform: 'translate(100%, 100%)', opacity: 0 }),
        animate('300ms ease-out', 
          style({ transform: 'translate(0, 0)', opacity: 1 })
        )
      ]),
      transition('visible-bottom-right => void', [
        animate('200ms ease-in', 
          style({ transform: 'translate(0, 100%)', opacity: 0 })
        )
      ]),

      // Bottom Left position
      transition('void => visible-bottom-left', [
        style({ transform: 'translate(-100%, 100%)', opacity: 0 }),
        animate('300ms ease-out', 
          style({ transform: 'translate(0, 0)', opacity: 1 })
        )
      ]),
      transition('visible-bottom-left => void', [
        animate('200ms ease-in', 
          style({ transform: 'translate(0, 100%)', opacity: 0 })
        )
      ]),

      // Top Center position
      transition('void => visible-top-center', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition('visible-top-center => void', [
        animate('200ms ease-in', 
          style({ transform: 'translateY(-100%)', opacity: 0 })
        )
      ]),

      // Bottom Center position
      transition('void => visible-bottom-center', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition('visible-bottom-center => void', [
        animate('200ms ease-in', 
          style({ transform: 'translateY(100%)', opacity: 0 })
        )
      ])
    ])
  ]
})
export class AlertComponent {
  positions: AlertPosition[] = ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'];
  
  constructor(private toastService: AlertService) {}

  getAlertsByPosition(position: AlertPosition) {
    return this.toastService.toasts$.pipe(
      map(toasts => toasts.filter(toast => toast.position === position))
    );
  }

  getAlertItems(toast: Alert): string[] {
    return this.isWithListAlert(toast) ? toast.items : [];
  }

  getAlertMessage(toast: Alert): string {
    if (this.isActionAlert(toast) || toast.variant === 'simple') {
      return toast.message;
    }
    return '';
  }

  isActionAlert(toast: Alert): toast is ActionAlert {
    return ['withaction'].includes(toast.variant);
  }

  isWithListAlert(toast: Alert): toast is WithListAlert {
    return toast.variant === 'withlist';
  }
  isCompletedStyleAlert(toast: Alert): toast is CompletedAlert | CompletedBorderAlert {
    return toast.variant === 'completed' || toast.variant === 'completedborder';
  }

  getPositionClasses(position: AlertPosition): string {
    const baseClasses = 'fixed z-[80] flex flex-col gap-2 text-text-bolder';
    const positionClasses = {
      'top-right': 'top-4 right-1',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
    };

    return `${baseClasses} ${positionClasses[position]}`;
  }

  dismiss(id: number) {
    this.toastService.dismiss(id);
  }

  onViewStatus(toast: Alert) {
    if (this.isActionAlert(toast)) {
    
    }
  }
  private getColorSet(color: AlertColor) {
    const colorSets = {
      error: {
        background: 'bg-tint-error-default border-text-error',
        content: 'text-text-error'
      },
      brand: {
        background: 'bg-tint-brand-default border-text-primary-tint',
        content: 'text-text-primary-tint'
      },
      success: {
        background: 'bg-tint-green-default border-text-success',
        content: 'text-text-success'
      },
      info: {
        background: 'bg-tint-cyan-default border-text-info',
        content: 'text-text-info'
      },
      warning: {
        background: 'bg-tint-yellow-default border-text-secondary',
        content: 'text-text-secondary'
      },
      discovery: {
        background: 'bg-tint-blue-default border-text-discovery',
        content: 'text-text-discovery'
      },
      green: {
        background: 'bg-tint-green-default border-text-success',
        content: 'text-text-success'
      },
      custom: {
        background: 'bg-tint-custom border-text-custom',
        content: 'text-text-custom'
      }
    };
    return color ? colorSets[color] : null;
  }

  getAlertClasses(toast: Alert) {
    const baseClasses = 'flex gap-3 lg:p-5 p-2 rounded-lg lg:max-w-2xl max-w-sm';
    
    // If color is provided, use it instead of variant-based colors
    const colorSet = this.getColorSet(toast.color);
    if (colorSet) {
      const borderClass = toast.variant === 'accentborder' || toast.variant === 'completedborder' 
        ? `border-l-4 border-current rounded-l-none` 
        : '';
      return `${baseClasses} ${colorSet.background} ${borderClass}`;
    }
    
    const variantClasses = {
      simple: 'bg-tint-yellow-default',
      withlist: 'bg-tint-brand-default',
      withaction: 'bg-tint-green-default',
      detail: 'bg-tint-error-default',
      accentborder: 'bg-tint-cyan-default border-l-4 border-text-info rounded-l-none',
      closeicon: 'bg-tint-blue-default',
      completed: 'bg-tint-yellow-default',
      completedborder: 'bg-tint-yellow-default border-l-4 border-text-secondary rounded-l-none'
    };
  
    return `${baseClasses} ${variantClasses[toast.variant]}`;
  }

  getHeadingColor(toast: Alert) {
    return this.getContentColor(toast);
  }

  getContentColor(toast: Alert) {
    const colorSet = this.getColorSet(toast.color);
    if (colorSet) {
      return `${colorSet.content}`;
    }
  
    const colors = {
      simple: 'text-text-secondary',
      withlist: 'text-bold-brand-subtle',
      withaction: 'text-text-success',
      detail: 'text-text-error',
      accentborder: 'text-text-info',
      closeicon: 'text-text-discovery',
      completed: 'text-text-secondary',
      completedborder: 'text-text-secondary'
    };
  
    return colors[toast.variant];
  }

  isDetailStyleAlert(toast: Alert): toast is DetailAlert {
    return toast.variant === 'detail' || toast.variant === 'accentborder' || toast.variant === 'closeicon';
  }
  shouldShowIcon(toast: Alert): boolean {
    // Jika showIcon explicitly diset false, return false
    if (toast.showIcon === false) {
      return false;
    }
    
    // Jika showIcon explicitly diset true, return true
    if (toast.showIcon === true) {
      return true;
    }

    // Default behavior untuk backward compatibility
    return this.isIconStyleAlert(toast);
  }

  // Update isIconStyleAlert method
  isIconStyleAlert(toast: Alert): boolean {
    return toast.variant !== 'completed' && toast.variant !== 'completedborder';
  }
  

  onPrimaryAction(toast: CompletedAlert) {
   
  }

  onSecondaryAction(toast: CompletedAlert) {
    
  
  }
  getActionColor(toast: Alert) {
   
    return `font-semibold lg:text-base text-sm leading-5 cursor-pointer ${this.getContentColor(toast)} hover:opacity-80`;
  }

  onAlertMouseEnter(id: number) {
    this.toastService.pauseTimer(id);
  }

  onAlertMouseLeave(id: number) {
    this.toastService.resumeTimer(id);
  }

  
}

