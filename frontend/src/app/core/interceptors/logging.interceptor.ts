import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { isDevMode } from '@angular/core';

/**
 * Interceptor para logging de peticiones HTTP.
 * Solo activo en modo desarrollo.
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo loguear en desarrollo
  if (!isDevMode()) {
    return next(req);
  }

  const started = Date.now();
  const method = req.method;
  const url = req.urlWithParams;

  console.log(`%c[HTTP] → ${method} ${url}`, 'color: #2196F3; font-weight: bold');

  if (req.body) {
    console.log('%c[HTTP] Body:', 'color: #9E9E9E', req.body);
  }

  return next(req).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          const status = event.status;

          const color = status >= 200 && status < 300 ? '#4CAF50' : '#FF9800';

          console.log(
            `%c[HTTP] ← ${method} ${url} [${status}] (${elapsed}ms)`,
            `color: ${color}; font-weight: bold`
          );

          if (event.body) {
            console.log('%c[HTTP] Response:', 'color: #9E9E9E', event.body);
          }
        }
      },
      error: err => {
        const elapsed = Date.now() - started;
        const status = err.status || 'ERR';

        console.log(
          `%c[HTTP] ✗ ${method} ${url} [${status}] (${elapsed}ms)`,
          'color: #F44336; font-weight: bold'
        );
        console.error('%c[HTTP] Error:', 'color: #F44336', err);
      }
    })
  );
};
