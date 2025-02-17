import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AuthState } from './auth.reducer';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store<{ auth: AuthState }>);
  const router = inject(Router);

  return store.select('auth').pipe(
    map(authState => {
      if (!authState.token) {
        router.navigate(['/login']);
        return false;
      }
      return true;
    })
  );
};
