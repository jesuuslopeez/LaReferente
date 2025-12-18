import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private usedEmails = ['admin@lareferente.com', 'user@test.com', 'info@example.com'];
  private usedUsernames = ['admin', 'root', 'user', 'test'];

  checkEmailUnique(email: string): Observable<boolean> {
    if (!email) return of(true);
    const isUnique = !this.usedEmails.includes(email.toLowerCase());
    return of(isUnique).pipe(delay(800));
  }

  checkUsernameAvailable(username: string): Observable<boolean> {
    if (!username || username.length < 3) return of(true);
    const isAvailable = !this.usedUsernames.includes(username.toLowerCase());
    return of(isAvailable).pipe(delay(600));
  }
}
