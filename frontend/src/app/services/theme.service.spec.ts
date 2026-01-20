import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID, provideZonelessChangeDetection, ApplicationRef } from '@angular/core';
import { ThemeService, Theme } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Browser Environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });

      service = TestBed.inject(ThemeService);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should load saved theme from localStorage', () => {
      localStorage.setItem('app-theme', 'dark');

      // Recrear el servicio para que cargue el tema guardado
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'browser' }
        ]
      });

      const newService = TestBed.inject(ThemeService);
      expect(newService.theme()).toBe('dark');
    });

    it('should return a theme value', () => {
      expect(service.theme()).toBeDefined();
    });

    it('should toggle theme from light to dark', () => {
      service.setTheme('light');

      service.toggleTheme();

      expect(service.theme()).toBe('dark');
    });

    it('should toggle theme from dark to light', () => {
      service.setTheme('dark');

      service.toggleTheme();

      expect(service.theme()).toBe('light');
    });

    it('should set theme directly', () => {
      service.setTheme('dark');
      expect(service.theme()).toBe('dark');

      service.setTheme('light');
      expect(service.theme()).toBe('light');
    });

    it('should persist theme to localStorage', (done) => {
      service.setTheme('dark');

      // Trigger change detection to flush effects
      TestBed.inject(ApplicationRef).tick();

      // Give time for effects to run
      setTimeout(() => {
        expect(localStorage.getItem('app-theme')).toBe('dark');
        done();
      }, 10);
    });

    it('should apply theme class to document', (done) => {
      service.setTheme('dark');

      // Trigger change detection to flush effects
      TestBed.inject(ApplicationRef).tick();

      // Give time for effects to run
      setTimeout(() => {
        expect(document.documentElement.classList.contains('theme-dark')).toBe(true);
        done();
      }, 10);
    });
  });

  describe('Server Environment', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideZonelessChangeDetection(),
          ThemeService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });

      service = TestBed.inject(ThemeService);
    });

    it('should default to light theme on server', () => {
      expect(service.theme()).toBe('light');
    });
  });
});
