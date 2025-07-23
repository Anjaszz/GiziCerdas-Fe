import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconModule } from "../../icons/icon.module";
import { IconPencilSquare } from "../../icons/icon-pencil-square";

@Component({
  selector: 'input-textarea-2',
  templateUrl: './input-textarea-2.component.html',
  imports: [CommonModule, FormsModule, IconModule],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextarea2Component),
      multi: true
    }
  ]
})
export class InputTextarea2Component  implements ControlValueAccessor, AfterContentInit {
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

  @Input()
  variant: 'default' | 'accordion' = 'default';

  styleClass: string = '';

  private _isExpanded: boolean = false;

  get isExpanded() {
    return this._isExpanded;
  }

  set isExpanded(val: boolean) {
    val ? this.styleClass = 'expanded' : this.styleClass = '';
    
    this._isExpanded = val;
  }



  val = '';
  onChange: any = () => {}
  onTouch: any = () => {}

  @ViewChild('InputArea') 
  InputArea!: ElementRef<HTMLTextAreaElement>;

  // Handle keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isExpanded) {
      if (event.key === 'Escape') {
        this.cancelEraseAction();
      } else if (event.key === 'Enter' && event.shiftKey) {
        this.saveEditAction();
      }
    }
  }
  
  wordCache: string = '';

  _isDisabled: boolean = false;
  get isDisabled() {
    return this._isDisabled;
  }
  set isDisabled(val: boolean) {
    if (val === false) {
       this.InputArea.nativeElement.focus();
    }
    this._isDisabled = val;
  }

  set value(val: string) {
    if (val !== undefined && this.val !== val) {
      if (this.variant == 'accordion' ) {
        
        
      }
      this.val = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }
  get value() {
    return this.val;
  }

  constructor() { 
    // console.log('jom');
    
   
  }

  ngAfterContentInit() {
    // console.log('jomwdw');
    
    if (this.variant == 'accordion' && this.value.length) {
      this.wordCache = this.value

      console.log('masuk sini');
      
      this.isDisabled = true
      console.log(this.isDisabled);
      
    }
  }

  saveEditAction() {
    // (click)="isDisabled = false; InputArea.focus()"
    this.isDisabled = !this.isDisabled
    if (!this.isDisabled) {
      this.isExpanded = false
      this.InputArea.nativeElement.focus()
    } else {
      this.wordCache = this.value
      this.InputArea.nativeElement.blur()
    }
  }

  cancelEraseAction() {
    this.isDisabled = !this.isDisabled

    if (this.isDisabled) {
      this.value = this.wordCache
    } else {
     this.isExpanded = true
     this.value = ''
     this.InputArea.nativeElement.focus()
    }
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
