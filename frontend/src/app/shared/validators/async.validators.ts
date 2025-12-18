import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ValidationService } from '../services/validation';

export function uniqueEmail(validationService: ValidationService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return timer(0).pipe(map(() => null));

    return timer(500).pipe(
      switchMap(() => validationService.checkEmailUnique(control.value)),
      map(isUnique => (isUnique ? null : { emailTaken: true }))
    );
  };
}

export function usernameAvailable(validationService: ValidationService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const username = control.value;
    if (!username || username.length < 3) return timer(0).pipe(map(() => null));

    return timer(400).pipe(
      switchMap(() => validationService.checkUsernameAvailable(username)),
      map(isAvailable => (isAvailable ? null : { usernameTaken: true }))
    );
  };
}
