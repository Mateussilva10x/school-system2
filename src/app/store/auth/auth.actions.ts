import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../shared/interfaces/models';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Login Request': props<{ email: string; password: string }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),
    'Logout': emptyProps(),
    'Clear Error': emptyProps(),
  }
});
