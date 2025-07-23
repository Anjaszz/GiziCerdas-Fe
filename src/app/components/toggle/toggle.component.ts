// toggle.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Const } from 'src/definition/global.definition';

export const ToggleTheme = {
  DEFAULT: 'default',
} as const;

export const ToggleSize = {
  MEDIUM: 'md',
  SMALL: 'sm',
} as const;

export const ToggleVariant = {
  DEFAULT: 'default',
  WITH_DESCRIPTION: 'with-description'
} as const;

const ToggleSizeClass: Record<Const<typeof ToggleSize>, { 
  container: string, 
  slider: string, 
  translateChecked: string 
}> = {
  [ToggleSize.MEDIUM]: {
    container: 'w-11 h-5',
    slider: 'w-[17px] h-[16px]',
    translateChecked: 'peer-checked:translate-x-[1.45rem]'
  },
  [ToggleSize.SMALL]: {
    container: 'w-9 h-4',
    slider: 'w-4 h-4',
    translateChecked: 'peer-checked:translate-x-5'
  }
};

const ToggleThemeClass: Record<Const<typeof ToggleTheme>, { 
  background: string, 
  checkedBackground: string 
}> = {
  [ToggleTheme.DEFAULT]: {
    background: 'bg-alpha-1',
    checkedBackground: 'checked:bg-bold-brand-default'
  }
};

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle.component.html'
})
export class ToggleComponent {
  @Input() theme: Const<typeof ToggleTheme> = ToggleTheme.DEFAULT;
  @Input() size: Const<typeof ToggleSize> = ToggleSize.MEDIUM;
  @Input() variant: Const<typeof ToggleVariant> = ToggleVariant.DEFAULT;
  @Input() label: string = '';
  @Input() span: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() checked: boolean = false;
  
  @Output() checkedChange = new EventEmitter<boolean>();

  toggleId = `toggle-${Math.random().toString(36).substring(2, 11)}`;

  get toggleSizeClass() {
    return ToggleSizeClass[this.size];
  }

  get toggleThemeClass() {
    return ToggleThemeClass[this.theme];
  }

  onToggleChange(event: any): void {
    this.checkedChange.emit(event.target.checked);
  }
}