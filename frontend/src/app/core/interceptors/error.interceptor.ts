import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast';

/**
 * Interceptor global para manejo de errores HTTP.
 * Muestra notificaciones solo para acciones del usuario (POST, PUT, DELETE)
 * y errores críticos (401). Los errores en peticiones GET de carga se manejan silenciosamente.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Error inesperado. Inténtalo de nuevo más tarde.';

      // Solo mostrar toast para acciones del usuario (no GET) o errores críticos
      const isUserAction = req.method !== 'GET';
      let showToast = isUserAction;

      switch (error.status) {
        case 0:
          message = 'No hay conexión con el servidor.';
          break;

        case 400:
          message = error.error?.message || 'Los datos enviados no son válidos.';
          break;

        case 401:
          message = 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.';
          // Limpiar token y redirigir a login
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          router.navigate(['/login']);
          // 401 siempre muestra toast (sesión expirada es crítico)
          showToast = true;
          break;

        case 403:
          message = 'No tienes permisos para realizar esta acción.';
          break;

        case 404:
          message = 'El recurso solicitado no existe.';
          // 404 nunca muestra toast
          showToast = false;
          break;

        case 409:
          message = error.error?.message || 'Conflicto con datos existentes.';
          break;

        case 422:
          message = error.error?.message || 'Error de validación.';
          break;

        case 429:
          message = 'Demasiadas peticiones. Espera un momento.';
          break;

        default:
          if (error.status >= 500) {
            message = 'Error interno del servidor. Inténtalo más tarde.';
          }
      }

      if (showToast) {
        toast.error(message);
      }

      return throwError(() => ({
        status: error.status,
        message,
        original: error
      }));
    })
  );
};
