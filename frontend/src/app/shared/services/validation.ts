import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api';

  private usedUsernames = ['admin', 'root', 'user', 'test'];

  checkEmailUnique(email: string): Observable<boolean> {
    if (!email) return of(true);

    return this.http.get<boolean>(`${this.apiUrl}/auth/check-email`, {
      params: { email }
    }).pipe(
      map(exists => !exists),
      catchError(() => of(true))
    );
  }

  checkUsernameAvailable(username: string): Observable<boolean> {
    if (!username || username.length < 3) return of(true);
    const isAvailable = !this.usedUsernames.includes(username.toLowerCase());
    return of(isAvailable);
  }
}
