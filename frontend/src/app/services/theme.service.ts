import { Injectable, signal, effect, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

/**
 * Servicio para gestionar el tema de la aplicacion (claro/oscuro)
 * Demuestra: localStorage, matchMedia, addEventListener para cambios del sistema en tiempo real
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  private readonly THEME_KEY = 'app-theme';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly themeSignal = signal<Theme>(this.getInitialTheme());

  // Referencia al MediaQueryList para poder eliminar el listener
  private mediaQuery: MediaQueryList | null = null;
  // Handler para el evento de cambio de preferencia del sistema
  private mediaQueryHandler: ((e: MediaQueryListEvent) => void) | null = null;

  constructor() {
    // Efecto reactivo que aplica y guarda el tema cuando cambia
    effect(() => {
      const theme = this.themeSignal();
      this.applyTheme(theme);
      this.saveTheme(theme);
    });

    // Listener para detectar cambios de preferencia del sistema en tiempo real
    this.setupSystemThemeListener();
  }

  /**
   * Configura un listener para detectar cambios en la preferencia de tema del sistema
   * Usa matchMedia.addEventListener('change') para escuchar cambios en tiempo real
   */
  private setupSystemThemeListener(): void {
    if (!this.isBrowser) return;

    // Solo escuchar cambios si el usuario no ha guardado una preferencia
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) return;

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Handler para el evento de cambio
    this.mediaQueryHandler = (event: MediaQueryListEvent) => {
      // Solo cambiar si no hay preferencia guardada por el usuario
      const userPreference = localStorage.getItem(this.THEME_KEY);
      if (!userPreference) {
        this.themeSignal.set(event.matches ? 'dark' : 'light');
      }
    };

    // Usar addEventListener para detectar cambios en tiempo real
    this.mediaQuery.addEventListener('change', this.mediaQueryHandler);
  }

  /**
   * Limpia el listener al destruir el servicio
   */
  ngOnDestroy(): void {
    if (this.mediaQuery && this.mediaQueryHandler) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryHandler);
    }
  }

  get theme() {
    return this.themeSignal.asReadonly();
  }

  toggleTheme(): void {
    this.themeSignal.update(current => current === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) {
      return 'light'; // Default para SSR
    }

    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${theme}`);
  }

  private saveTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    localStorage.setItem(this.THEME_KEY, theme);
  }
}
