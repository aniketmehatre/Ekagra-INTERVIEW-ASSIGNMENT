import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';

import { TokenService } from './token';
import { USERS } from '../core/mock/user';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenService =
    inject(TokenService);

  readonly currentUser =
    signal<AuthUser | null>(null);

  readonly role = computed(
    () => this.currentUser()?.role ?? null
  );

  readonly isAuthenticated = computed(
    () => this.currentUser() !== null
  );

  constructor() {
    this.restoreSession();
  }

  login(
    email: string,
    password: string
  ): Observable<boolean> {

    return of(USERS).pipe(

      delay(600),

      map(users => {

        const user = users.find(
          x =>
            x.email === email &&
            x.password === password
        );

        console.log('Matched User =>', user);

        if (!user) {
          return false;
        }

        const authUser: AuthUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };

        this.currentUser.set(authUser);

        sessionStorage.setItem(
          'session_token',
          btoa(JSON.stringify(authUser))
        );

        return true;
      })
    );
  }

  logout(): void {

    this.currentUser.set(null);

    sessionStorage.removeItem(
      'session_token'
    );
  }

  private restoreSession(): void {

    const token =
      sessionStorage.getItem(
        'session_token'
      );

    if (!token) {
      return;
    }

    try {

      const user =
        JSON.parse(atob(token));

      this.currentUser.set(user);

    } catch {

      this.logout();
    }
  }
}