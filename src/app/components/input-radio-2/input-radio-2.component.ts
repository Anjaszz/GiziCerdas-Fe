import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconModule } from '../icon/icon.module';



@Component({
  selector: 'app-input-radio-2',
  templateUrl: './input-radio-2.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRadio2Component),
      multi: true,
    },
  ],
})

// CEKLIS AKAN MUNCUL KETIKA VALUE SAMA DENGAN RADIO VALUE
export class InputRadio2Component implements ControlValueAccessor {
  @Input()
  radioValue: string = '';

  @Input()
  label: string = '';

  @Input()
  styleClass: string = '';

  @Input()
  radioStyleClass: string = '';

  @Input()
  labelStyleClass: string = '';

  @Input()
  set value(val: string | undefined) {
    this.val = val ?? '';
    // console.log(val)
    this.onChange(val);
    this.onTouch(val);
  }
  get value() {
    return this.val;
  }

  val = '';
  onChange: any = () => {};
  onTouch: any = () => {};


  constructor() {}

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
