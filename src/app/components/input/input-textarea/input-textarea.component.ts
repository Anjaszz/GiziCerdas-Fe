import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-textarea',
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextareaComponent),
      multi: true
    }
  ]
})
export class InputTextareaComponent  implements ControlValueAccessor {
  @Input()
  placeholder: string = '';

  @Input()
  type: HTMLInputElement['type'] = 'text';

  @Input()
  inputmode: 'email' | 'tel' | 'numeric' | '' = '';

  @Input()
  resetable?: any;

  @Input()
  label: string = '';

  @Input()
  labelInfo: string = '';

  @Input()
  labelOptional: string = '';
  
  @Input()
  readonly: any = false;

  @Input()
  helper: string = '';

  @Input()
  error: boolean = false;

  @Input()
  rows: number | string = '3';

  val = '';
  onChange: any = () => {}
  onTouch: any = () => {}

  set value(val: string) {
    if (val !== undefined && this.val !== val) {
      this.val = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }
  get value() {
    return this.val;
  }

  constructor() { }

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
