import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, retry } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  /**
   * GET request
   */
  get<T>(endpoint: string, params?: HttpParams | { [key: string]: string | number }): Observable<T> {
    const options = params ? { params: this.buildParams(params) } : {};
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
      retry({ count: 2, delay: 1000 }),
      catchError(this.handleError)
    );
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * PUT request (reemplazo completo)
   */
  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * PATCH request (actualización parcial)
   */
  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * POST con FormData para subida de archivos
   */
  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Construye HttpParams desde un objeto
   */
  private buildParams(params: HttpParams | { [key: string]: string | number }): HttpParams {
    if (params instanceof HttpParams) {
      return params;
    }

    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
        httpParams = httpParams.set(key, String(params[key]));
      }
    });
    return httpParams;
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor';
    } else if (error.status === 400) {
      errorMessage = error.error?.message || 'Datos inválidos';
    } else if (error.status === 401) {
      errorMessage = 'Sesión expirada. Por favor, inicia sesión de nuevo';
    } else if (error.status === 403) {
      errorMessage = 'No tienes permisos para realizar esta acción';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 409) {
      errorMessage = error.error?.message || 'Conflicto con los datos existentes';
    } else if (error.status >= 500) {
      errorMessage = 'Error interno del servidor';
    }

    console.error('[API Error]', error);
    return throwError(() => ({ status: error.status, message: errorMessage, original: error }));
  }
}
