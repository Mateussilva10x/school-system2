import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '../../shared/interfaces/models';

export interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  error: null
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    error: null
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(AuthActions.logout, () => initialState)
);
