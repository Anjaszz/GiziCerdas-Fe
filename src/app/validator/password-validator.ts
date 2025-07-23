import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  
  if (!value) {
    return null;
  }

  const hasMinLength = value.length >= 8;
  const hasNumber = /[0-9]/.test(value);
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const requirements = {
    minLength: hasMinLength,
    hasNumber: hasNumber,
    hasLetter: hasLetter,
    hasSpecialChar: hasSpecialChar
  };

  const isValid = hasMinLength && hasNumber && hasLetter && hasSpecialChar;

  return !isValid ? { password: requirements } : null;
}