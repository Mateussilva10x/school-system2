import { createReducer, on } from '@ngrx/store';
import { loginSuccess, logout } from './auth.actions';

export interface AuthState {
  token: string | null;
  role: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'), // 🔹 Pega do LocalStorage ao iniciar
  role: localStorage.getItem('role'),
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { token, role }) => {
    localStorage.setItem('token', token);
    if (role !== null) {
      localStorage.setItem('role', role);
    }
    return { token, role };
  }),
  on(logout, () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return { token: null, role: null };
  }),
);
