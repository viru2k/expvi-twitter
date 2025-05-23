import { Configuration } from './api/configuration';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { componentStateReducer } from './store/component-state.reducer';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LocalStorageService } from './services/storage/local-storage.service';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
          preset: Aura
      }
  }),
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },
  {
    provide: Configuration,
    useFactory: apiConfigFactory,
    deps: [LocalStorageService],
  },
  // NgRx Store Global
  provideStore({
    componentState: componentStateReducer
  }),

  // Devtools de NgRx
  provideStoreDevtools({
    maxAge: 25,
    logOnly: true
  })
  ],
};

export function apiConfigFactory(localStorage: LocalStorageService): Configuration {
  return new Configuration({
    basePath: 'http://127.0.0.1:8000/api',
    accessToken: () => localStorage.getToken() || '',
  });
}
