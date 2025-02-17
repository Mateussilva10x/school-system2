import { createAction, props } from '@ngrx/store';
import { User } from '../../shared/interfaces/models';

// Inicia o login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>()
);

// Sucesso no login
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);

// Falha no login
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Logout
export const logout = createAction('[Auth] Logout');
