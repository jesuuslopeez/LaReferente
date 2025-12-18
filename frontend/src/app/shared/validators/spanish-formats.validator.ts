import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function nif(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const nif = control.value?.toUpperCase();
    if (!nif) return null;

    const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    if (!nifRegex.test(nif)) return { invalidNif: true };

    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const position = parseInt(nif.substring(0, 8)) % 23;
    return letters[position] === nif[8] ? null : { invalidNif: true };
  };
}

export function telefono(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return /^(6|7)[0-9]{8}$/.test(control.value) ? null : { invalidTelefono: true };
  };
}

export function codigoPostal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return /^\d{5}$/.test(control.value) ? null : { invalidCP: true };
  };
}
