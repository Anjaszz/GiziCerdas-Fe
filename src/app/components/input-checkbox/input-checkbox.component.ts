import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconModule } from '../icon/icon.module';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IconModule, ProgressSpinnerModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheckboxComponent),
      multi: true,
    },
  ],
})
export class InputCheckboxComponent implements ControlValueAccessor {
  @Input()
  label: string = '';

  @Input()
  styleClass: string = '';

  @Input()
  checkboxStyleClass: string = '';

  @Input()
  labelStyleClass: string = '';

  @Input()
  loading: boolean = false;

  @Input()
  disabled: boolean = false;

  @Input()
  set value(val: boolean | undefined) {
    if (this.val !== (val ?? false)) {
      this.val = val ?? false;
      this.onChange(this.val);
      this.onTouch(this.val);
    }
  }
  get value() {
    return this.val;
  }

  val = false;
  onChange: any = () => {};
  onTouch: any = () => {};

  toggleValue() {
    this.value = !this.val;
    
  }

  writeValue(value: any): void {
    this.value = value;
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
