import { HttpInterceptorFn } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

/**
 * Interceptor que añade el token de autenticación a las peticiones HTTP.
 * Excluye las rutas públicas como login y register.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Solo acceder a localStorage en el navegador
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // Rutas públicas que no necesitan token
  const publicUrls = ['/auth/login', '/auth/register', '/public'];
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  if (isPublicUrl) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  // Clonar la request y añadir el header de autorización
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
