import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { AuthState } from './auth.reducer';
import { AuthService } from '../../core/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);
  const authService = inject(AuthService);

  return store.select('auth').pipe(
    map((authState) => {
      let token = authState.token;

      // 🔹 Se não houver token no Store, buscar no LocalStorage
      if (!token) {
        token = localStorage.getItem('token') || '';
        if (token) {
          authService.restoreSession(token); // ✅ Restaura sessão
        }
      }

      if (!token) {
        router.navigate(['/login']);
        return false;
      }

      return true;
    }),
  );
};
