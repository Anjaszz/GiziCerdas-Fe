import { Directive, ElementRef, HostListener, Input } from '@angular/core';

export type InputRule = '' | 'float' | 'currency' | 'number';

@Directive({
  selector: '[appInputRule]',
  standalone: true,
})
export class InputRuleDirective {
  @Input('input-rule')
  inputRule: InputRule = '';
  @Input() max: number | null = null;

  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent) {
    const key = event.data;
    
    if (event.inputType === 'deleteContentBackward') {
      return true
    }

    if (key === null) {
      return false
    }

    if (this.inputRule === 'float') {
      // const regex = new RegExp(/^\d+[.]?\d{0,2}$/);
      const regex = new RegExp(/[\d.]/);
      const splitedVal = this.el.value.split('.');

      // 9999 is a fallback value for cursor position
      const cursorPos = this.el.selectionStart ?? 9999;
      

      // Handle if key pressed not dot or number
      if(!regex.test(key)) {
        return false;
      }

      // Handle condition where input dot as first character
      if ((this.el.value === '' || this.el.value === undefined) && key === '.') {
        return false;
      }

      // Handle condition where input value already contains a dot
      if (splitedVal.length > 1 && key === '.') {
        return false;
      }

      // Handle condition where numbers after dot already reach total of 2
      if (splitedVal.length > 1 && splitedVal[1].length >= 2 && cursorPos > splitedVal[0].length) {
        return false;
      }

      return true;
    }

    if (this.inputRule === 'number') {
      const regex = new RegExp(/^[0-9]*$/);
      if(!regex.test(key)) {
        return false;
      }
    }

    if (this.inputRule === 'currency') {
      const regex = new RegExp(/^[0-9]*$/);
  
      if(!regex.test(key)) {
        return false;
      }

      if (key == '0' && !this.el.value) {
        return false;
      }

      const currentValue = this.el.value + key;

      // Check if the max value is set and the new value would exceed it
      
      if (this.max === null) return;
      if (this.max !== null && +currentValue > this.max) {
        return false;
      }
    }

    return true
  }
}
