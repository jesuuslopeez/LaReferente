import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatch(controlName: string, matchControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const matchControl = group.get(matchControlName);

    if (!control || !matchControl) return null;
    if (matchControl.errors && !matchControl.errors['mismatch']) return null;

    return control.value === matchControl.value ? null : { mismatch: true };
  };
}

export function totalMinimo(min: number): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const price = group.get('price')?.value || 0;
    const quantity = group.get('quantity')?.value || 0;
    const total = price * quantity;

    return total >= min ? null : { totalMinimo: { min, actual: total } };
  };
}

export function atLeastOneRequired(...fields: string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const hasOne = fields.some(field => {
      const value = group.get(field)?.value;
      return value && value.toString().trim().length > 0;
    });
    return hasOne ? null : { atLeastOneRequired: { fields } };
  };
}
