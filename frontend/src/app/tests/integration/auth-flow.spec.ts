import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router, provideRouter } from '@angular/router';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { AuthService, LoginResponse } from '../../services/auth.service';

/**
 * Tests de integración del flujo de autenticación
 * Prueba el flujo completo: login -> almacenamiento -> verificación -> logout
 */
describe('Auth Flow Integration', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  const mockLoginResponse: LoginResponse = {
    token: 'jwt-token-123',
    email: 'usuario@test.com',
    nombre: 'Usuario Test',
    rol: 'USER'
  };

  const mockAdminResponse: LoginResponse = {
    token: 'admin-token-456',
    email: 'admin@test.com',
    nombre: 'Admin User',
    rol: 'ADMIN'
  };

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(router, 'navigateByUrl');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Flujo de Login Completo', () => {
    it('debe realizar login, almacenar token y actualizar estado', () => {
      // 1. Usuario no autenticado inicialmente
      expect(authService.estaAutenticado()).toBe(false);
      expect(authService.usuario()).toBeNull();

      // 2. Realizar login
      authService.login({ email: 'usuario@test.com', password: 'password123' }).subscribe();

      // 3. Simular respuesta del servidor
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockLoginResponse);

      // 4. Verificar que el estado se actualizó
      expect(authService.estaAutenticado()).toBe(true);
      expect(authService.usuario()).toEqual({
        email: 'usuario@test.com',
        nombre: 'Usuario Test',
        rol: 'USER'
      });

      // 5. Verificar que se guardó en localStorage
      expect(localStorage.getItem('token')).toBe('jwt-token-123');
    });

    it('debe mantener sesión después de recargar (simulado)', () => {
      // 1. Login inicial
      authService.login({ email: 'usuario@test.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      // 2. Verificar que hay token
      expect(localStorage.getItem('token')).toBeTruthy();

      // 3. Crear nuevo servicio (simula recarga)
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          provideHttpClient(),
          provideHttpClientTesting(),
          provideRouter([]),
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });

      const newService = TestBed.inject(AuthService);

      // 4. El servicio debe cargar usuario desde localStorage
      expect(newService.estaAutenticado()).toBe(true);
      expect(newService.usuario()?.email).toBe('usuario@test.com');
    });
  });

  describe('Flujo de Logout', () => {
    it('debe cerrar sesión y limpiar datos', () => {
      // 1. Login primero
      authService.login({ email: 'usuario@test.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(authService.estaAutenticado()).toBe(true);

      // 2. Cerrar sesión
      authService.cerrarSesion();

      // 3. Verificar limpieza
      expect(authService.estaAutenticado()).toBe(false);
      expect(authService.usuario()).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Verificación de Roles', () => {
    it('usuario normal no debe ser admin ni editor', () => {
      authService.login({ email: 'usuario@test.com', password: 'pass' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockLoginResponse);

      expect(authService.esAdmin()).toBe(false);
      expect(authService.esEditor()).toBe(false);
    });

    it('admin debe ser admin y editor', () => {
      authService.login({ email: 'admin@test.com', password: 'admin' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(mockAdminResponse);

      expect(authService.esAdmin()).toBe(true);
      expect(authService.esEditor()).toBe(true);
    });

    it('editor debe ser editor pero no admin', () => {
      const editorResponse: LoginResponse = {
        ...mockLoginResponse,
        rol: 'EDITOR'
      };

      authService.login({ email: 'editor@test.com', password: 'editor' }).subscribe();
      httpMock.expectOne('/api/auth/login').flush(editorResponse);

      expect(authService.esAdmin()).toBe(false);
      expect(authService.esEditor()).toBe(true);
    });
  });

  describe('Flujo de Registro', () => {
    it('debe registrar usuario y autenticarlo automáticamente', () => {
      expect(authService.estaAutenticado()).toBe(false);

      authService.registro({
        email: 'nuevo@test.com',
        password: 'password123',
        nombre: 'Nuevo',
        apellidos: 'Usuario'
      }).subscribe();

      const req = httpMock.expectOne('/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'nuevo@test.com',
        password: 'password123',
        nombre: 'Nuevo',
        apellidos: 'Usuario'
      });

      req.flush(mockLoginResponse);

      // Después del registro, debe estar autenticado
      expect(authService.estaAutenticado()).toBe(true);
      expect(localStorage.getItem('token')).toBeTruthy();
    });
  });

  describe('Manejo de Errores', () => {
    it('debe manejar error de credenciales incorrectas', () => {
      let errorReceived: any = null;

      authService.login({ email: 'usuario@test.com', password: 'wrongpass' }).subscribe({
        error: (err) => errorReceived = err
      });

      httpMock.expectOne('/api/auth/login').flush(
        { message: 'Credenciales incorrectas' },
        { status: 401, statusText: 'Unauthorized' }
      );

      expect(errorReceived).toBeTruthy();
      expect(errorReceived.status).toBe(401);
      expect(authService.estaAutenticado()).toBe(false);
    });

    it('debe resetear estado de carga después de error', () => {
      authService.login({ email: 'usuario@test.com', password: 'pass' }).subscribe({
        error: () => {}
      });

      expect(authService.cargando()).toBe(true);

      httpMock.expectOne('/api/auth/login').flush(
        {},
        { status: 500, statusText: 'Server Error' }
      );

      expect(authService.cargando()).toBe(false);
    });
  });
});
