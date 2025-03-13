import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './store/auth/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './store/auth/auth.effects';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './store/auth/auth.interceptor';
import { TranslateProviders } from '../../translate-config';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(MatNativeDateModule),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({ auth: authReducer }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    provideEffects([AuthEffects]),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      },
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt-br',
    },
    TranslateProviders,
  ],
};
