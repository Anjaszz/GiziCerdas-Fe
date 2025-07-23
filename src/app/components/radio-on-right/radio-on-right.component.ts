/* eslint-disable @angular-eslint/no-output-native */
// radio-on-right-card.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, Injector, Inject } from '@angular/core';
import { IconModule } from 'src/app/components/icon/icon.module';
import { UserCircleIcon } from '../icon/sidebar/user-circle';
import { OfficeIcon } from '../icon/sidebar/office-icon';
import { IndividualIcon } from '../icon/individual-icon';
import { CompanyIcon } from '../icon/company-icon';

export const RadioTheme = {
  DEFAULT: 'default',
} as const;

export const RadioSize = {
  MEDIUM: 'md',
  SMALL: 'sm',
} as const;

export const RadioVariant = {
  DEFAULT: 'default',
  BOTTOM_BORDER: 'bottom-border',
  LABEL_ONLY: 'label-only',
  ICON_LEFT: 'icon-left', // New variant
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
    unchecked: 'border-line-default bg-alpha-1',
    checked: 'checked:border-bold-brand-default checked:bg-bold-brand-default',
  },
};

@Component({
  selector: 'app-radio-on-right',
  standalone: true,
  imports: [CommonModule, IconModule],
  templateUrl: './radio-on-right.component.html',
})
export class RadioOnRightComponent {
  @Input() theme: RadioThemeType = 'default';
  @Input() size: RadioSizeType = 'sm';
  @Input() variant: 'default' | 'bottom-border' | 'label-only' | 'icon-left' = 'default';
  @Input() name: string = 'radio';
  @Input() label?: string = '';
  @Input() label2?: string = '';
  @Input() desc?: string = '';
  @Input() value: any = null;
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() styleClass: string = '';
  @Input() iconName?: string = ''; // New input for icon name

  @Output() valueChange = new EventEmitter<any>();
  @Output() change = new EventEmitter<any>();

  radioId = `radio-${Math.random().toString(36).substring(2, 11)}`;

  constructor(private injector: Injector) {}

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (!this.disabled) {
      this.checked = target.checked;
      if (this.checked) {
        this.valueChange.emit(this.value);
        this.change.emit({
          value: this.value,
          checked: this.checked
        });
      }
    }
  }

  // Menambahkan method baru untuk menangani klik pada container
  onContainerClick(): void {
    if (!this.disabled && !this.checked) {
      this.checked = true;
      this.valueChange.emit(this.value);
      this.change.emit({
        value: this.value,
        checked: this.checked
      });
      
      // Trigger event pada input radio asli
      const radioInput = document.getElementById(this.radioId) as HTMLInputElement;
      if (radioInput) {
        radioInput.checked = true;
      }
    }
  }

  get radioSizeClass() {
    return RadioSizeClass[this.size];
  }

  get radioThemeClass() {
    return RadioThemeClass[this.theme];
  }

  getIconComponent() {
    if (!this.iconName) return null;


    const iconRegistry: Record<string, any> = {
      'person': IndividualIcon,
      'business': CompanyIcon,
    };
    
    return this.iconName in iconRegistry ? iconRegistry[this.iconName] : null;
  }

  getIconInjector() {
 
    const iconColor = this.checked ? '#3815FF' : '#8993A5';
    const bgColor = this.checked ? '#F6F0FF' : '#E3E4E8';
    const fillOpacity = this.checked ? '1' : '0.3';

    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: 'color', useValue: iconColor },
        { provide: 'bgColor', useValue: bgColor },
        { provide: 'fillOpacity', useValue: fillOpacity }
      ]
    });
  }
}