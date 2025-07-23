/* eslint-disable @angular-eslint/no-output-native */
// checkbox.component.ts
import { CommonModule } from '@angular/common'
import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Const } from 'src/definition/global.definition'
import { IconModule } from '../icon/icon.module'
import { CheckboxIconComponent } from "../icon/checkbox-icon";

export const CheckboxTheme = {
  DEFAULT: 'default',
   ERROR: 'error'
} as const

export const CheckboxSize = {
  MEDIUM: 'md',
  SMALL: 'sm',
} as const

export const CheckboxVariant = {
  DEFAULT: 'default',
  INLINE: 'inline',
  RIGHT: 'right'
} as const

const CheckboxSizeClass: Record<Const<typeof CheckboxSize>, string> = {
  [CheckboxSize.MEDIUM]: 'h-5 w-5',
  [CheckboxSize.SMALL]: 'h-4 w-4',
}

const CheckboxThemeClass: Record<Const<typeof CheckboxTheme>, string> = {
  [CheckboxTheme.DEFAULT]: 'bg-alpha-1 border-line-default checked:bg-bold-brand-default checked:border-bold-brand-default focus:ring-bold-brand-default',
  [CheckboxTheme.ERROR]: 'bg-alpha-1 border-[#FF4242] checked:bg-bold-brand-default checked:border-bold-brand-default focus:ring-bold-brand-default'
}

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [CommonModule, IconModule, CheckboxIconComponent],
  templateUrl: './checkbox.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() theme: Const<typeof CheckboxTheme> = CheckboxTheme.DEFAULT;
  @Input() size: Const<typeof CheckboxSize> = CheckboxSize.SMALL;
  @Input() variant: Const<typeof CheckboxVariant> = CheckboxVariant.DEFAULT;
  @Input() styleClass: string = '';
  @Input() description?: string;
  @Input() title?: string;
  @Input() optionalText?: string;
  @Input() disabled: boolean = false;
  @Input() name?: string;
  @Input() required: boolean = false;
  @Input() error: boolean = false;
  @Input() titleClass: string = 'text-text-subtle'; 
  @Input() set checked(value: boolean) {
    this._value = value;
    this._onChange(this._value);
  }
  get checked(): boolean {
    return this._value;
  }

  @Output() change = new EventEmitter<boolean>();
  @Output() blur = new EventEmitter<void>();

  private _value: boolean = false;
  private _onTouched: () => void = () => {};
  private _onChange: (value: boolean) => void = () => {};

  onInputChange(event: Event) {
    event.stopPropagation(); // Hentikan event bubbling
    const checkbox = event.target as HTMLInputElement;
    this._value = checkbox.checked;
    this._onChange(this._value);
    // Emit boolean value only
    this.change.emit(checkbox.checked);
  }

  onBlur() {
    this._onTouched();
    this.blur.emit();
  }

  writeValue(value: boolean): void {
    if (this._value !== value) {
      this._value = value;
    }
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  get isChecked(): boolean {
    return this._value;
  }

  get checkboxBaseClass() {
    return 'peer cursor-pointer transition-all appearance-none rounded-[4px] border focus:outline-none focus:ring-2 focus:ring-offset-2'
  }

  get checkboxSizeClass() {
    return CheckboxSizeClass[this.size];
  }


  getContainerClasses(): string {
    switch (this.variant) {
      case CheckboxVariant.INLINE:
        return 'flex items-center';
      case CheckboxVariant.RIGHT:
        return 'flex items-start justify-between  border-b border-line-default py-3';
      default:
        return 'flex items-start ';
    }
  }
  get checkboxThemeClass() {
    return this.error ? CheckboxThemeClass[CheckboxTheme.ERROR] : CheckboxThemeClass[this.theme];
  }

  getContentClasses(): string {
    switch (this.variant) {
      case CheckboxVariant.INLINE:
        return 'text-sm flex items-center gap-2';
      case CheckboxVariant.RIGHT:
        return 'text-sm flex flex-col gap-2';
      default:
        return 'text-sm flex flex-col gap-2';
    }
  }
}