/* eslint-disable @angular-eslint/no-output-native */
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IconModule } from 'src/app/components/icon/icon.module';

export const RadioTheme = {
  DEFAULT: 'default',
} as const;

export const RadioSize = {
  MEDIUM: 'md',
  SMALL: 'sm',
} as const;

export const RadioVariant = {
  DEFAULT: 'default',
  NO_DESC: 'no-desc',
  INLINE_DESC: 'inline-desc'
} as const;

type RadioSizeType = typeof RadioSize[keyof typeof RadioSize];
type RadioThemeType = typeof RadioTheme[keyof typeof RadioTheme];
type RadioVariantType = typeof RadioVariant[keyof typeof RadioVariant];

const RadioSizeClass: Record<RadioSizeType, { radio: string; dot: string; label: string }> = {
  'md': {
    radio: 'h-[1.2rem] w-[1.2rem]',
    dot: 'w-2 h-2',
    label: 'text-lg',
  },
  'sm': {
    radio: 'h-[1rem] w-[1rem]',
    dot: 'w-1.5 h-1.5',
    label: 'text-base',
  },
};

const RadioThemeClass: Record<RadioThemeType, { unchecked: string; checked: string }> = {
  'default': {
    unchecked: 'border-line-default bg-alpha-1 ',
    checked: 'checked:border-bold-brand-default checked:bg-bold-brand-default',
  },
};

@Component({
  selector: 'app-radio-simple',
  standalone: true,
  imports: [CommonModule, IconModule],
  templateUrl: './radio-with-desc.component.html',
})
export class RadioWithDescComponent {
  @Input() theme: RadioThemeType = 'default';
  @Input() size: RadioSizeType = 'sm';
  @Input() variant: RadioVariantType = 'default';
  @Input() name: string = 'radio';
  @Input() label?: string = '';
  @Input() desc?: string = '';
  @Input() value: any = null;
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() styleClass: string = '';
  @Input() iconName?: string = ''; // Tambahkan input untuk nama icon

  @Output() valueChange = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();

  radioId = `radio-${Math.random().toString(36).substring(2, 11)}`;

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.checked && !this.disabled) {
      this.checked = true;
      this.valueChange.emit(this.value);
      this.change.emit({
        value: this.value,
        checked: this.checked
      });
    }
  }

  get radioSizeClass() {
    return RadioSizeClass[this.size];
  }

  get radioThemeClass() {
    return RadioThemeClass[this.theme];
  }
}