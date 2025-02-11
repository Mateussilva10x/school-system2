import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginRequest),
    exhaustMap(action =>
      this.authService.login(action.email, action.password).pipe(
        map(user => AuthActions.loginSuccess({ user })),
        catchError(error => of(AuthActions.loginFailure({ error: error.message })))
      )
    )
  ));

  loginSuccess$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginSuccess),
    tap(({ user }) => {
      // Salva o usuário no localStorage
      localStorage.setItem('user', JSON.stringify(user));
      // Navega para a home
      this.router.navigate(['/home']);
    })
  ), { dispatch: false });

  loginFailure$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.loginFailure),
    tap(({ error }) => {
      this.snackBar.open('Credenciais inválidas', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    })
  ), { dispatch: false });

  logout$ = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.logout),
    tap(() => {
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
    })
  ), { dispatch: false });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
}
