import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObjectVal } from 'src/definition/global.definition';
import { IconModule } from '../icon/icon.module';


export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'pill' | 'default';

export const ThemeColor= {
  RED: 'solid-brand',
  GREEN: 'solid-green',
  MAROON: 'solid-maroon',
  YELLOW: 'solid-yellow',
  CYAN: 'solid-cyan',
  BLUE: 'solid-blue',
  TEAL: 'solid-teal',
  MAGENTA: 'solid-magenta',
  ORANGE:  'solid-orange',
  ICON_SUBTLE: 'icon-subtle',
  ALPHA_ON_HIGH: 'alpha-on-high',
  TINT_RED: 'tint-red',
  TINT_MAROON: 'tint-maroon',
  TINT_YELLOW: 'tint-yellow',
  TINT_CYAN: 'tint-cyan',
  TINT_BLUE: 'tint-blue',
  TINT_TEAL: 'tint-teal',
  TINT_MAGENTA: 'tint-magenta',
  TINT_ORANGE: 'tint-orange',

  TINT_GREEN: 'tint-green',
} as const

export const SolidThemeColor= {
  RED: 'solid-brand',
  GREEN: 'solid-green',
  MAROON: 'solid-maroon',
  YELLOW: 'solid-yellow',
  CYAN: 'solid-cyan',
  BLUE: 'solid-blue',
  TEAL: 'solid-teal',
  MAGENTA: 'solid-magenta',
  ORANGE:  'solid-orange',
  PURPLE: 'solid-purple'
} as const




export const BadgeThemeClass: Record<ObjectVal<typeof ThemeColor>, {background: string, textColor: string, borderColor: string}> = {
  [ThemeColor.RED]: {background: 'bg-solid-brand', textColor: 'text-text-white', borderColor: 'border-solid-brand'},
  [ThemeColor.GREEN]: {background: 'bg-solid-green', textColor: 'text-text-white', borderColor: 'border-solid-green'},
  [ThemeColor.MAROON]: {background: 'bg-solid-maroon', textColor: 'text-text-white', borderColor: 'border-solid-maroon'},
  [ThemeColor.YELLOW]: {background: 'bg-solid-yellow', textColor: 'text-text-white', borderColor: 'border-solid-yellow'},
  [ThemeColor.CYAN]: {background: 'bg-solid-cyan', textColor: 'text-text-white', borderColor: 'border-solid-cyan'},
  [ThemeColor.BLUE]: {background: 'bg-solid-blue', textColor: 'text-text-white', borderColor: 'border-solid-blue'},
  [ThemeColor.TEAL]: {background: 'bg-solid-teal', textColor: 'text-text-white', borderColor: 'border-solid-teal'},
  [ThemeColor.MAGENTA]: {background: 'bg-solid-magenta', textColor: 'text-text-white', borderColor: 'border-solid-magenta'},
  [ThemeColor.ORANGE]: {background: 'bg-solid-orange', textColor: 'text-text-white', borderColor: 'border-solid-orange'},
  [ThemeColor.ICON_SUBTLE]: {background: 'bg-icon-subtle', textColor: 'text-text-subtle', borderColor: 'border-icon-subtle'},
  [ThemeColor.TINT_RED]: {background: 'bg-tint-red', textColor: 'text-solid-brand', borderColor: 'border-solid-brand'},
  [ThemeColor.TINT_MAROON]: {background: 'bg-tint-maroon', textColor: 'text-solid-maroon', borderColor: 'border-solid-maroon'},
  [ThemeColor.TINT_YELLOW]: {background: 'bg-tint-yellow', textColor: 'text-solid-yellow', borderColor: 'border-solid-yellow'},
  [ThemeColor.TINT_CYAN]: {background: 'bg-tint-cyan', textColor: 'text-solid-cyan', borderColor: 'border-solid-cyan'},
  [ThemeColor.TINT_BLUE]: {background: 'bg-tint-blue', textColor: 'text-solid-blue', borderColor: 'border-solid-blue'},
  [ThemeColor.TINT_TEAL]: {background: 'bg-tint-teal', textColor: 'text-solid-teal', borderColor: 'border-solid-teal'},
  [ThemeColor.TINT_MAGENTA]: {background: 'bg-tint-magenta', textColor: 'text-solid-magenta', borderColor: 'border-solid-magenta'},
  [ThemeColor.TINT_ORANGE]: {background: 'bg-tint-orange', textColor: 'text-solid-orange', borderColor: 'border-solid-orange'},
  
  [ThemeColor.TINT_GREEN]: {background: 'bg-green-subtle-default', textColor: 'text-text-success', borderColor: 'border-solid-green'},
  [ThemeColor.ALPHA_ON_HIGH]: {background: 'bg-elevation-surface', textColor: 'text-text-subtler', borderColor: 'border-icon-subtle'},
}


@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule, IconModule],
  templateUrl: './badges-without-bg.component.html'
})
export class BadgeComponent {
  @Input() theme: ObjectVal<typeof ThemeColor> = ThemeColor.RED;
  @Input() size: BadgeSize = 'md';
  @Input() variant: BadgeVariant= 'default';
  @Input()
  hasShowButton:boolean = false;

  isShow: boolean = true;


  get themeClass() {
    return BadgeThemeClass[this.theme];
  }

  get getBadgeClasses(): string {
    const baseClasses = 'inline-flex items-center shadow-sm border border-line-default font-medium';
    
    const sizeClasses = {
      sm: 'px-1 py-1 gap-1.5 text-3xs leading-none',
      md: 'px-1.5 py-1 gap-2 text-3xs leading-none',
      lg: 'px-1.5 py-1.5 gap-2.5 text-xs leading-none'
    };
 
    const VariantClasses = {
      pill: 'rounded-full',
      default: 'rounded-md'
    };

    return `${baseClasses} ${sizeClasses[this.size]} ${VariantClasses[this.variant]} ${this.themeClass.background} ${this.themeClass.textColor}`.trim();
  }

  get getCloseButtonClasses(): string {
    const closeButtonClasses = {
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return `inline-block ${this.themeClass.textColor} ${closeButtonClasses[this.size]}`;
  }
}