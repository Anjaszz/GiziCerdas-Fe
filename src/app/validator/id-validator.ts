import { AbstractControl, ValidatorFn } from '@angular/forms';

export function ktpValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }
    
    const value = control.value.toString().replace(/\D/g, ''); // Remove non-digits
    
    // Check if KTP is exactly 16 digits
    if (value.length !== 16) {
      return { invalidKtp: true };
    }
    
    return null;
  };
}

export function npwpValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }
    
    const value = control.value.toString().replace(/[^0-9]/g, ''); // Remove non-digits
    
    // Check if NPWP is 15 or 16 digits (maximum 16)
    if (value.length < 15 || value.length > 17) {
      return { invalidNpwp: true };
    }
    
    return null;
  };
}