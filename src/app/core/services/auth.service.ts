import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../../shared/interfaces/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUser: User = {
    id: '1',
    email: 'admin@school.com',
    role: 'ADMIN',
    token: 'mock-jwt-token'
  };

  login(email: string, password: string): Observable<User> {
    console.log(email)
    if (email === 'admin@school.com' && password === 'admin123') {
      return of(this.mockUser).pipe(delay(1000)); // Simula delay de rede
    }
    return throwError(() => new Error('Credenciais inválidas'));
  }

  logout(): Observable<void> {
    return of(void 0).pipe(delay(500));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }
}
