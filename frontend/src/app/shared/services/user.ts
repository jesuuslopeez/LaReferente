import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.usersSubject.asObservable();

  getUsers(): Observable<User[]> {
    const mockUsers: User[] = [
      { id: 1, name: 'Ana García', email: 'ana@example.com', active: true },
      { id: 2, name: 'Carlos López', email: 'carlos@example.com', active: true },
      { id: 3, name: 'María Pérez', email: 'maria@example.com', active: false },
    ];

    return of(mockUsers).pipe(delay(1000));
  }

  getActiveUsers(): Observable<User[]> {
    return of(this.usersSubject.value.filter(u => u.active));
  }

  setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }
}
