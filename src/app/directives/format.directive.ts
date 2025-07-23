import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[ktpFormat]',
  standalone: true
})
export class KtpFormatDirective {
  constructor(private el: ElementRef, private control: NgControl) {}
  
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const input = event.target.value.replace(/\D/g, '');
    
    // Limit to 16 digits
    const limited = input.substring(0, 16);
    
    // Update the input value
    this.el.nativeElement.value = limited;
    
    // Update the form control
    this.control.control?.setValue(limited, { emitEvent: false });
  }
}

@Directive({
  selector: '[npwpFormat]',
  standalone: true
})
export class NpwpFormatDirective {
  constructor(private el: ElementRef, private control: NgControl) {}
  
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = event.target.value;
    
    // Remove all non-digits
    let value = initialValue.replace(/\D/g, '');
    
    // Limit to 16 digits (changed from 15 to 16)
    value = value.substring(0, 16);
    
    // Format: XX.XXX.XXX.X-XXX.XXX untuk 15 digit
    // Format: XX.XXX.XXX.X-XXX.XXXX untuk 16 digit
    let formatted = '';
    if (value.length > 0) formatted += value.substring(0, 2);
    if (value.length > 2) formatted += '.' + value.substring(2, 5);
    if (value.length > 5) formatted += '.' + value.substring(5, 8);
    if (value.length > 8) formatted += '.' + value.substring(8, 9);
    if (value.length > 9) formatted += '-' + value.substring(9, 12);
    if (value.length > 12) {
      // Support both 15 and 16 digit formats
      if (value.length <= 15) {
        formatted += '.' + value.substring(12, 15);
      } else {
        formatted += '.' + value.substring(12, 16);
      }
    }
    
    // Update the input value with formatted text
    this.el.nativeElement.value = formatted;
    
    // Store the raw value in the form control
    const rawValue = value;
    this.control.control?.setValue(rawValue, { emitEvent: false });
  }
}