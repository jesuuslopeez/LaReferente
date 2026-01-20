import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { PLATFORM_ID, provideZonelessChangeDetection } from '@angular/core';
import { AuthService, LoginRequest, RegisterRequest, LoginResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockLoginResponse: LoginResponse = {
    token: 'mock-jwt-token',
    email: 'test@example.com',
    nombre: 'Test User',
    rol: 'USER'
  };

  const mockAdminResponse: LoginResponse = {
    token: 'mock-admin-token',
    email: 'admin@example.com',
    nombre: 'Admin User',
    rol: 'ADMIN'
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    // Clear localStorage before each test
    localStorage.clear();

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and store token', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginData).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
        expect(localStorage.getItem('token')).toBe('mock-jwt-token');
        expect(service.usuario()).toEqual({
          email: 'test@example.com',
          nombre: 'Test User',
          rol: 'USER'
        });
      });

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockLoginResponse);
    });

    it('should set cargando to true while loading', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      service.login(loginData).subscribe();
      expect(service.cargando()).toBe(true);

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockLoginResponse);
      expect(service.cargando()).toBe(false);
    });

    it('should handle login error', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      service.login(loginData).subscribe({
        error: (error) => {
          expect(service.cargando()).toBe(false);
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('registro', () => {
    it('should register successfully and store token', () => {
      const registerData: RegisterRequest = {
        email: 'new@example.com',
        password: 'password123',
        nombre: 'New',
        apellidos: 'User'
      };

      service.registro(registerData).subscribe(response => {
        expect(response).toBeTruthy();
        expect(localStorage.getItem('token')).toBeTruthy();
        expect(service.usuario()).toBeTruthy();
      });

      const req = httpMock.expectOne('/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockLoginResponse);
    });
  });

  describe('cerrarSesion', () => {
    it('should clear user data and redirect to home', () => {
      // First login
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('usuario', JSON.stringify({ email: 'test@example.com' }));

      service.cerrarSesion();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('usuario')).toBeNull();
      expect(service.usuario()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('estaAutenticado', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'valid-token');
      expect(service.estaAutenticado()).toBe(true);
    });

    it('should return false when no token', () => {
      expect(service.estaAutenticado()).toBe(false);
    });
  });

  describe('obtenerToken', () => {
    it('should return the stored token', () => {
      localStorage.setItem('token', 'my-token');
      expect(service.obtenerToken()).toBe('my-token');
    });

    it('should return null when no token', () => {
      expect(service.obtenerToken()).toBeNull();
    });
  });

  describe('esAdmin', () => {
    it('should return true for admin users', () => {
      service.login({ email: 'admin@example.com', password: 'admin' }).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockAdminResponse);

      expect(service.esAdmin()).toBe(true);
    });

    it('should return false for regular users', () => {
      service.login({ email: 'user@example.com', password: 'user' }).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockLoginResponse);

      expect(service.esAdmin()).toBe(false);
    });

    it('should return false when not authenticated', () => {
      expect(service.esAdmin()).toBe(false);
    });
  });

  describe('esEditor', () => {
    it('should return true for admin users', () => {
      service.login({ email: 'admin@example.com', password: 'admin' }).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockAdminResponse);

      expect(service.esEditor()).toBe(true);
    });

    it('should return true for editor users', () => {
      service.login({ email: 'editor@example.com', password: 'editor' }).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush({ ...mockLoginResponse, rol: 'EDITOR' });

      expect(service.esEditor()).toBe(true);
    });

    it('should return false for regular users', () => {
      service.login({ email: 'user@example.com', password: 'user' }).subscribe();
      const req = httpMock.expectOne('/api/auth/login');
      req.flush(mockLoginResponse);

      expect(service.esEditor()).toBe(false);
    });
  });

  describe('cargarUsuarioGuardado', () => {
    it('should load user from localStorage on init', () => {
      // Set localStorage before creating service
      localStorage.setItem('token', 'stored-token');
      localStorage.setItem('usuario', JSON.stringify({
        email: 'stored@example.com',
        nombre: 'Stored User',
        rol: 'USER'
      }));

      // Reset TestBed and recreate everything to get a fresh service instance
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          AuthService,
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: Router, useValue: routerSpy },
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });

      const freshService = TestBed.inject(AuthService);

      expect(freshService.usuario()).toEqual({
        email: 'stored@example.com',
        nombre: 'Stored User',
        rol: 'USER'
      });
    });
  });
});
