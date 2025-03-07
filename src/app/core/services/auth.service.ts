import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../shared/interfaces/models';
import { environment } from '../../../environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userKey = 'user';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private store: Store,
  ) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((user) => {
          if (user && user.token) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('role', user.role);
            localStorage.setItem(this.userKey, JSON.stringify(user));

            this.store.dispatch(
              loginSuccess({ token: user.token, role: user.role }),
            );
          }
        }),
        catchError((error) => {
          this.showErrorSnackbar(error.error.message || 'Erro ao fazer login');
          return throwError(() => error);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem(this.userKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  checkSession(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.http
        .post<{ token: string }>(`${this.apiUrl}/refresh-token`, {})
        .subscribe({
          next: (response) => {
            localStorage.setItem('token', response.token); // Atualiza o token
          },
          error: () => {
            this.logout(); // Se der erro, faz logout
          },
        });
    }
  }

  restoreSession(token: string): void {
    const role = localStorage.getItem('role'); // Recupera a role salva
    if (role) {
      this.store.dispatch(loginSuccess({ token, role })); // Reinsere no Store
    }
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  private showErrorSnackbar(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
