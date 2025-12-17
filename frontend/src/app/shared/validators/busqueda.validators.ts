import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function rangoEdad(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const edadMin = group.get('edadMin')?.value;
    const edadMax = group.get('edadMax')?.value;

    if (!edadMin || !edadMax) return null;

    return edadMin <= edadMax ? null : { rangoInvalido: true };
  };
}

export function rangoDorsal(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const dorsalMin = group.get('dorsalMin')?.value;
    const dorsalMax = group.get('dorsalMax')?.value;

    if (dorsalMin === null || dorsalMax === null) return null;

    return dorsalMin <= dorsalMax ? null : { dorsalRangoInvalido: true };
  };
}
