import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError } from 'rxjs';

export interface Usuario {
  email: string;
  nombre: string;
  rol: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  nombre: string;
  rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private platformId = inject(PLATFORM_ID);

  usuario = signal<Usuario | null>(null);
  cargando = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.cargarUsuarioGuardado();
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private cargarUsuarioGuardado(): void {
    if (!this.isBrowser) return;

    const token = localStorage.getItem('token');
    const usuarioStr = localStorage.getItem('usuario');

    if (token && usuarioStr) {
      try {
        this.usuario.set(JSON.parse(usuarioStr));
      } catch {
        this.cerrarSesion();
      }
    }
  }

  login(datos: LoginRequest): Observable<LoginResponse> {
    this.cargando.set(true);

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, datos).pipe(
      tap((respuesta) => {
        if (this.isBrowser) {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem(
            'usuario',
            JSON.stringify({
              email: respuesta.email,
              nombre: respuesta.nombre,
              rol: respuesta.rol,
            })
          );
        }
        this.usuario.set({
          email: respuesta.email,
          nombre: respuesta.nombre,
          rol: respuesta.rol,
        });
        this.cargando.set(false);
      }),
      catchError((error) => {
        this.cargando.set(false);
        throw error;
      })
    );
  }

  registro(datos: RegisterRequest): Observable<LoginResponse> {
    this.cargando.set(true);

    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, datos).pipe(
      tap((respuesta) => {
        if (this.isBrowser) {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem(
            'usuario',
            JSON.stringify({
              email: respuesta.email,
              nombre: respuesta.nombre,
              rol: respuesta.rol,
            })
          );
        }
        this.usuario.set({
          email: respuesta.email,
          nombre: respuesta.nombre,
          rol: respuesta.rol,
        });
        this.cargando.set(false);
      }),
      catchError((error) => {
        this.cargando.set(false);
        throw error;
      })
    );
  }

  cerrarSesion(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    this.usuario.set(null);
    this.router.navigate(['/']);
  }

  estaAutenticado(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('token');
  }

  obtenerToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  esAdmin(): boolean {
    const usuario = this.usuario();
    return usuario?.rol === 'ADMIN';
  }

  esEditor(): boolean {
    const usuario = this.usuario();
    return usuario?.rol === 'EDITOR' || usuario?.rol === 'ADMIN';
  }
}
