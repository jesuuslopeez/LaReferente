import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { authInterceptor, errorInterceptor, loggingInterceptor } from './core/interceptors';
import { SelectivePreloadStrategy } from './core/preload-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withPreloading(SelectivePreloadStrategy),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withViewTransitions()
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,    // Añade token de autenticación
        errorInterceptor,   // Manejo global de errores
        loggingInterceptor  // Logging en desarrollo
      ])
    ),
    provideClientHydration(withEventReplay()),
  ],
};
