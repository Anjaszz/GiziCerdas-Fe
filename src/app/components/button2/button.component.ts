import { CommonModule } from '@angular/common';
import { Component, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ObjectVal } from 'src/definition/global.definition';

export const ButtonVariant = {
  ICON_ONLY: 'icon-only',
  WITH_TEXT: 'with-text'
} as const;

export const ButtonTheme = {
  SOLID_GREEN: 'solid-green',
  SOLID_RED: 'solid-red',
  SOLID_MAROON: 'solid-maroon',
  SOLID_ORANGE: 'solid-orange',
  SOLID_YELLOW: 'solid-yellow',
  SOLID_MAGENTA: 'solid-magenta',
  SOLID_PURPLE: 'solid-purple',
  SOLID_BLUE: 'solid-blue',
  SOLID_CYAN: 'solid-cyan',
  SOLID_TEAL: 'solid-teal',
  SOLID_SECONDARY: 'solid-secondary',
  SOLID_INFO: 'solid-info',
  SOLID_DISCOVERY: 'solid-discovery',
  TINT_GREEN: 'tint-green',
  TINT_RED: 'tint-red',
  TINT_MAROON: 'tint-maroon',
  TINT_ORANGE: 'tint-orange',
  TINT_YELLOW: 'tint-yellow',
  TINT_MAGENTA: 'tint-magenta',
  TINT_BLUE: 'tint-blue',
  TINT_CYAN: 'tint-cyan',
  TINT_TEAL: 'tint-teal',
  TINT_SECONDARY: 'tint-yellow-default',
  TINT_INFO: 'tint-cyan-default',
  TINT_DISCOVERY: 'tint-blue-default',
  GENERAL_DISABLE: 'alpha-1',
  GENERAL_NO_BORDER: 'general-no-border',
  
  TINT_GREY: 'tint-grey',
  GENERAL_OUTLINE: 'general-outline',
  TINT_PUPLE: 'tint-purple',
} as const;

export const ButtonSize = {
  EXTRA_LARGE: 'xl',
  LARGE: 'lg',
  MEDIUM: 'md',
  SMALL: 'sm',
  EXTRA_SMALL: 'xs',
  EXTRAS_SMALL: 'xss',
} as const;

const ButtonSizeClass: Record<ObjectVal<typeof ButtonSize>, string> = {
  [ButtonSize.EXTRA_LARGE]: 'text-base font-bold ',
  [ButtonSize.LARGE]: ' text-base font-bold ',
  [ButtonSize.MEDIUM]: '  text-sm font-bold ',
  [ButtonSize.SMALL]: '  text-xs font-bold ',
  [ButtonSize.EXTRA_SMALL]: ' text-xs font-bold ',
  [ButtonSize.EXTRAS_SMALL]: ' text-2xs  leading-[12px] font-semibold ',
};

// Define padding for each size and variant combination
const ButtonPaddingClass: Record<ObjectVal<typeof ButtonSize>, {
  [ButtonVariant.ICON_ONLY]: string;
  [ButtonVariant.WITH_TEXT]: string;
}> = {
  [ButtonSize.EXTRA_LARGE]: {
    [ButtonVariant.ICON_ONLY]: 'p-3.5',
    [ButtonVariant.WITH_TEXT]: 'px-3.5 py-2'
  },
  [ButtonSize.LARGE]: {
    [ButtonVariant.ICON_ONLY]: 'p-3',
    [ButtonVariant.WITH_TEXT]: 'py-1.5 px-3'
  },
  [ButtonSize.MEDIUM]: {
    [ButtonVariant.ICON_ONLY]: 'p-2',
    [ButtonVariant.WITH_TEXT]: 'px-2 py-1.5'
  },
  [ButtonSize.SMALL]: {
    [ButtonVariant.ICON_ONLY]: 'p-2',
    [ButtonVariant.WITH_TEXT]: 'px-2 py-1.5'
  },
  [ButtonSize.EXTRA_SMALL]: {
    [ButtonVariant.ICON_ONLY]: 'p-2',
    [ButtonVariant.WITH_TEXT]: 'py-1 px-2'
  },
  [ButtonSize.EXTRAS_SMALL]: {
    [ButtonVariant.ICON_ONLY]: 'p-1',
    [ButtonVariant.WITH_TEXT]: 'py-1 px-1'
  },
};

const ButtonThemeClass: Record<ObjectVal<typeof ButtonTheme>, string> = {
  [ButtonTheme.SOLID_RED]: 'bg-solid-red text-white',
  [ButtonTheme.SOLID_GREEN]: 'bg-solid-green text-white',
  [ButtonTheme.SOLID_MAROON]: 'bg-solid-maroon text-white',
  [ButtonTheme.SOLID_ORANGE]: 'bg-solid-orange text-white',
  [ButtonTheme.SOLID_YELLOW]: 'bg-solid-yellow text-white',
  [ButtonTheme.SOLID_MAGENTA]: 'bg-solid-magenta text-white',
  
  [ButtonTheme.SOLID_BLUE]: 'bg-solid-blue text-white',
  [ButtonTheme.SOLID_CYAN]: 'bg-solid-cyan text-white',
  [ButtonTheme.SOLID_TEAL]: 'bg-solid-teal text-white',
  [ButtonTheme.SOLID_SECONDARY]: 'bg-gradient-to-r from-bold-yellow-default to-bold-yellow-subtle text-bold-brand-subtle',
  [ButtonTheme.SOLID_INFO]: 'bg-bold-cyan-default text-white',
  [ButtonTheme.SOLID_DISCOVERY]: 'bg-bold-blue-default text-white',
  [ButtonTheme.TINT_GREEN]: 'bg-tint-green text-text-green',
  [ButtonTheme.TINT_RED]: 'bg-tint-red text-text-red',
  [ButtonTheme.TINT_ORANGE]: 'bg-tint-orange text-text-orange',
  [ButtonTheme.TINT_YELLOW]: 'bg-tint-yellow text-text-yellow',
  
  [ButtonTheme.TINT_MAGENTA]: 'bg-tint-magenta text-text-magenta',
  [ButtonTheme.TINT_MAROON]: 'bg-tint-maroon text-text-maroon',
  [ButtonTheme.TINT_BLUE]: 'bg-tint-blue text-text-blue',
  [ButtonTheme.TINT_CYAN]: 'bg-tint-cyan text-text-cyan',
  [ButtonTheme.TINT_TEAL]: 'bg-tint-teal text-text-teal',
  [ButtonTheme.TINT_INFO]: 'bg-tint-cyan-default text-bold-cyan-default',
  [ButtonTheme.TINT_SECONDARY]: 'bg-tint-yellow-default text-text-secondary',
  [ButtonTheme.TINT_DISCOVERY]: 'bg-tint-blue-default text-text-discovery',
  [ButtonTheme.GENERAL_DISABLE]: 'bg-elevation-sunken text-text-subtle',
  [ButtonTheme.GENERAL_NO_BORDER]: '',
  [ButtonTheme.GENERAL_OUTLINE]: 'bg-text-whitte text-text-subtle border-1 border-line-default',

  [ButtonTheme.TINT_GREY]: 'bg-elevation-sunken text-text-bolder',
  [ButtonTheme.TINT_PUPLE]: 'bg-tint-brand-default text-text-primary',
  [ButtonTheme.SOLID_PURPLE]: 'bg-gradient-to-r from-bold-brand-default to-bold-brand-subtle text-white',
};



/**
 * A versatile button component that supports multiple themes, sizes, and states.
 * 
 * @example
 * <app-button
 *   theme="solid-cyan"
 *   size="md"
 *   [loading]="isLoading"
 *   (clicked)="handleClick($event)"
 * >
 *   Submit
 * </app-button>
 * 
 * if loading is true, then you must set customWidth accordingly to text width
 */
@Component({
  selector: 'app-button2',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ProgressSpinnerModule
  ],
  templateUrl: './button.component.html',
})
export class Button2Component {
  /**
   * Input Properties:
   * ----------------
   * @property {ObjectVal<typeof ButtonTheme>} theme - Visual style of the button (e.g., 'solid-cyan', 'tint-red')
   * @property {ObjectVal<typeof ButtonSize>} size - Size of the button (xl, lg, md, sm, xs, xss)
   * @property {HTMLButtonElement['type']} type - HTML button type (button, submit, reset)
   * @property {string} styleClass - Additional CSS classes
   * @property {string} href - URL for anchor tag buttons
   * @property {string} target - Target attribute for anchor tag buttons
   * @property {ObjectVal<typeof ButtonVariant>} variant - Button style variant (icon-only, with-text)
   * @property {boolean} disabled - Whether the button is disabled
   * @property {boolean} loading - Shows loading spinner when true
   * @property {boolean} fullWidth - Makes button take full width of container
   * @property {string} tooltip - Tooltip text
   * @property {string} ariaLabel - Accessibility label
   * @property {string} name - Form control name
   * @property {string} value - Form control value
   * @property {string} form - Associates button with form ID
   * @property {string} customTextColor - Custom text color class
   * @property {string} customWidth - Custom width class
   */
  @Input() theme: ObjectVal<typeof ButtonTheme> = ButtonTheme.SOLID_PURPLE;
  @Input() size: ObjectVal<typeof ButtonSize> = ButtonSize.MEDIUM;
  @Input() type: HTMLButtonElement['type'] = 'button';
  @Input() styleClass: string = '';
  @Input() href?: string;
  @Input() target?: string;
  @Input() variant: ObjectVal<typeof ButtonVariant> = ButtonVariant.WITH_TEXT;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() tooltip?: string;
  @Input() ariaLabel: string = 'button';
  @Input() name?: string;
  @Input() value?: string;
  @Input() form?: string;
  @Input() customTextColor: string = '';
  @Input() customWidth: string = '';

  // Outputs
  @Output() clicked = new EventEmitter<MouseEvent>();
  @Output() focused = new EventEmitter<FocusEvent>();
  @Output() blurred = new EventEmitter<FocusEvent>();

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
    text-nowrap
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
      this.customWidth,
      this.ButtonBaseClass,
      this.ButtonSizeClass[this.size],
      this.ButtonThemeClass[this.theme],
      this.styleClass,
      ButtonPaddingClass[this.size][this.variant],
      this.fullWidth ? ' w-full' : (this.variant !== 'icon-only' ? 'min-w-[61px]' : ''),
      this.isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
      this._isPressed ? 'brightness-90 scale-[0.98]' : '',
      this.customTextColor
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