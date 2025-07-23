import { CommonModule } from '@angular/common';
import { Component, Input, output, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Const } from 'src/definition/global.definition';

export const ButtonVariant = {
  ICON_ONLY: 'icon-only',
  WITH_TEXT: 'with-text'
} as const;

export const ButtonTheme = {
  SOLID_PURPLE: 'solid-purple',
  SOLID_SECONDARY: 'solid-secondary',
  SOLID_GREEN: 'solid-green',
  SOLID_RED: 'solid-red',
  SOLID_INFO: 'solid-info',
  SOLID_DISCOVERY: 'solid-discovery',
  SUBTLE_PUPLE: 'tint-brand-default',
  SUBTLE_SECONDARY: 'tint-yellow-default',
  SUBTLE_GREEN: 'tint-green-default',
  SUBTLE_RED: 'tint-error-default',
  SUBTLE_INFO: 'tint-cyan-default',
  SUBTLE_DISCOVERY: 'tint-blue-default',
  GENERAL_DISABLE: 'disable-btn',
  GENERAL_NO_BORDER: 'general-no-border',
  GENERAL_OUTLINE: 'general-outline'
} as const;

export const ButtonSize = {
  EXTRA_LARGE: 'xl',
  LARGE: 'lg',
  MEDIUM: 'md',
  SMALL: 'sm',
  EXTRA_SMALL: 'xs',
  EXTRAS_SMALL: 'xss',
} as const;

const ButtonSizeClass: Record<Const<typeof ButtonSize>, string> = {
  [ButtonSize.EXTRA_LARGE]: 'h-[50px] py-6 text-base font-bold tracking-[-0.2px]',
  [ButtonSize.LARGE]: 'h-[42px] py-[22px] text-base font-bold tracking-[-0.2px]',
  [ButtonSize.MEDIUM]: 'h-[36px] py-[20px] font-[14px] leading-[16px] font-bold tracking-[-0.2px]',
  [ButtonSize.SMALL]: 'h-[32px] py-[18px] font-[14px] font-semibold tracking-[-0.2px]',
  [ButtonSize.EXTRA_SMALL]: 'h-[28px] py-[16px] font-[14px] leading-[16px] font-bold tracking-[-0.2px]',
  [ButtonSize.EXTRAS_SMALL]: 'h-[24px] py-[14px] font-[12px] leading-[16px] font-bold tracking-[-0.2px]',
};

// Define padding for each size and variant combination
const ButtonPaddingClass: Record<Const<typeof ButtonSize>, {
  [ButtonVariant.ICON_ONLY]: string;
  [ButtonVariant.WITH_TEXT]: string;
}> = {
  [ButtonSize.EXTRA_LARGE]: {
    [ButtonVariant.ICON_ONLY]: 'px-3.5',
    [ButtonVariant.WITH_TEXT]: 'px-[20px]'
  },
  [ButtonSize.LARGE]: {
    [ButtonVariant.ICON_ONLY]: 'px-3',
    [ButtonVariant.WITH_TEXT]: 'px-[18px]'
  },
  [ButtonSize.MEDIUM]: {
    [ButtonVariant.ICON_ONLY]: 'px-3',
    [ButtonVariant.WITH_TEXT]: 'px-[18px]'
  },
  [ButtonSize.SMALL]: {
    [ButtonVariant.ICON_ONLY]: 'px-3',
    [ButtonVariant.WITH_TEXT]: 'px-[16px]'
  },
  [ButtonSize.EXTRA_SMALL]: {
    [ButtonVariant.ICON_ONLY]: 'px-2.5',
    [ButtonVariant.WITH_TEXT]: 'px-[14px]'
  },
  [ButtonSize.EXTRAS_SMALL]: {
    [ButtonVariant.ICON_ONLY]: 'px-2 py-1',
    [ButtonVariant.WITH_TEXT]: 'px-[12px]'
  },
};

const ButtonThemeClass: Record<Const<typeof ButtonTheme>, string> = {
  [ButtonTheme.SOLID_PURPLE]: 'bg-gradient-to-r from-bold-brand-default to-bold-brand-subtle',
  [ButtonTheme.SOLID_SECONDARY]: 'bg-gradient-to-r from-bold-yellow-default to-bold-yellow-subtle',
  [ButtonTheme.SOLID_RED]: 'bg-bold-error-default',
  [ButtonTheme.SOLID_GREEN]: 'bg-bold-green-default',
  [ButtonTheme.SOLID_INFO]: 'bg-bold-cyan-default',
  [ButtonTheme.SOLID_DISCOVERY]: 'bg-bold-blue-default',
  [ButtonTheme.SUBTLE_PUPLE]: 'bg-tint-brand-default',
  [ButtonTheme.SUBTLE_GREEN]: 'bg-tint-green-default',
  [ButtonTheme.SUBTLE_RED]: 'bg-tint-error-default',
  [ButtonTheme.SUBTLE_INFO]: 'bg-tint-cyan-default',
  [ButtonTheme.SUBTLE_SECONDARY]: 'bg-tint-yellow-default',
  [ButtonTheme.SUBTLE_DISCOVERY]: 'bg-tint-blue-default',
  [ButtonTheme.GENERAL_DISABLE]: 'bg-alpha-1',
  [ButtonTheme.GENERAL_NO_BORDER]: 'bg-surface-default',
  [ButtonTheme.GENERAL_OUTLINE]: 'bg-surface-default border border-line-default',
};

const defaultTextColors: Record<Const<typeof ButtonTheme>, string> = {
  [ButtonTheme.SOLID_PURPLE]: 'text-text-white',
  [ButtonTheme.SOLID_SECONDARY]: 'text-bold-brand-subtle',
  [ButtonTheme.SOLID_RED]: 'text-white',
  [ButtonTheme.SOLID_GREEN]: ' text-white',
  [ButtonTheme.SOLID_INFO]: 'text-white',
  [ButtonTheme.SOLID_DISCOVERY]: ' text-white',
  [ButtonTheme.SUBTLE_PUPLE]: ' text-text-primary',
  [ButtonTheme.SUBTLE_GREEN]: ' text-text-success',
  [ButtonTheme.SUBTLE_RED]: ' text-bold-error-default',
  [ButtonTheme.SUBTLE_INFO]: ' text-bold-cyan-default',
  [ButtonTheme.SUBTLE_SECONDARY]: ' text-text-secondary',
  [ButtonTheme.SUBTLE_DISCOVERY]: 'text-text-discovery',
  [ButtonTheme.GENERAL_DISABLE]: 'text-text-subtle',
  [ButtonTheme.GENERAL_NO_BORDER]: ' text-text-subtle',
[ButtonTheme.GENERAL_OUTLINE]: ' border border-line-default text-text-subtle',
};


@Component({
  selector: 'app-pakdome-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  // Base Inputs
  @Input() theme: Const<typeof ButtonTheme> = ButtonTheme.SOLID_PURPLE;
  @Input() size: Const<typeof ButtonSize> = ButtonSize.MEDIUM;
  @Input() type: HTMLButtonElement['type'] = 'button';
  @Input() styleClass: string = '';
  @Input() href?: string;
  @Input() target?: string;
  @Input() variant: Const<typeof ButtonVariant> = ButtonVariant.WITH_TEXT;
  // Additional Inputs
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() tooltip?: string;
  @Input() ariaLabel?: string;
  @Input() name?: string;
  @Input() value?: string;
  @Input() form?: string;
  @Input() textColor?: string;

  // Outputs
  clicked = output<MouseEvent>();
  focused = output<FocusEvent>();
  blurred = output<FocusEvent>();

  // Internal state
  private _isPressed: boolean = false;

  // Base Classes
  ButtonBaseClass = `
    flex items-center 
    rounded-md 
    hover:brightness-75 
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    transition-all 
    duration-200 
    justify-center
    gap-2
    w-full
  `.trim();

  ButtonSizeClass = ButtonSizeClass;
  ButtonThemeClass = ButtonThemeClass;
  ButtonVariant = ButtonVariant;


  // Getters
  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }

  get computedClasses(): string {
    const classes = [
      this.ButtonBaseClass,
      this.ButtonSizeClass[this.size],
      this.ButtonThemeClass[this.theme],
      this.styleClass,
      ButtonPaddingClass[this.size][this.variant],
      this.fullWidth ? 'w-full' : '',
      this.isDisabled ? ' cursor-not-allowed ' : '',
      this._isPressed ? 'brightness-90 scale-[0.98]' : '',
      this.textColor || defaultTextColors[this.theme],
    ];
  
    return classes.filter(Boolean).join(' ');
  }

  // Event Handlers
  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent): void {
    if (this.isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }

  @HostListener('mousedown')
  handleMouseDown(): void {
    if (!this.isDisabled) {
      this._isPressed = true;
    }
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  handleMouseUp(): void {
    this._isPressed = false;
  }

  @HostListener('focus', ['$event'])
  handleFocus(event: FocusEvent): void {
    if (!this.isDisabled) {
      this.focused.emit(event);
    }
  }

  @HostListener('blur', ['$event'])
  handleBlur(event: FocusEvent): void {
    if (!this.isDisabled) {
      this.blurred.emit(event);
    }
  }

  @HostListener('keydown.space', ['$event'])
  @HostListener('keydown.enter', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.isDisabled) {
      event.preventDefault();
      this.clicked.emit(new MouseEvent('click'));
    }
  }
}