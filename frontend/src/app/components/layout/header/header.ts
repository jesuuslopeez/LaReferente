import {
  Component,
  inject,
  computed,
  signal,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { AccountModal } from '../../shared/account-modal/account-modal';
import { LoginForm } from '../../shared/login-form/login-form';
import { RegisterForm } from '../../shared/register-form/register-form';

/**
 * Componente Header con menu mobile, modales y dropdown de cuenta
 * Demuestra: @HostListener (document:click, document:keydown.escape), ViewChild, ElementRef
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AccountModal, LoginForm, RegisterForm],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly themeService = inject(ThemeService);
  private readonly elementRef = inject(ElementRef);
  protected readonly authService = inject(AuthService);

  protected readonly isDarkMode = computed(() => this.themeService.theme() === 'dark');
  protected readonly accountMenuOpen = signal(false);
  protected readonly showLoginModal = signal(false);
  protected readonly showRegisterModal = signal(false);
  protected readonly mobileMenuOpen = signal(false);
  protected readonly searchDropdownOpen = signal(false);

  // Referencias al DOM mediante ViewChild
  @ViewChild('hamburgerButton') hamburgerButton!: ElementRef;
  @ViewChild('accountButton') accountButton!: ElementRef;

  // Evento global: cierra menus y modales con click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.accountMenuOpen()) {
      this.accountMenuOpen.set(false);
    }
  }

  // Evento global: cierra menus y modales con tecla ESC
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.mobileMenuOpen()) {
      this.mobileMenuOpen.set(false);
      // Devolver foco al boton hamburguesa
      this.hamburgerButton?.nativeElement?.focus();
    }
    if (this.accountMenuOpen()) {
      this.accountMenuOpen.set(false);
      this.accountButton?.nativeElement?.focus();
    }
    if (this.searchDropdownOpen()) {
      this.searchDropdownOpen.set(false);
    }
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected toggleAccountMenu(): void {
    this.accountMenuOpen.update((open) => !open);
  }

  protected openLoginModal(): void {
    this.showLoginModal.set(true);
    this.accountMenuOpen.set(false);
  }

  protected openRegisterModal(): void {
    this.showRegisterModal.set(true);
    this.accountMenuOpen.set(false);
  }

  protected closeLoginModal(): void {
    this.showLoginModal.set(false);
  }

  protected closeRegisterModal(): void {
    this.showRegisterModal.set(false);
  }

  protected switchToRegister(): void {
    this.showLoginModal.set(false);
    this.showRegisterModal.set(true);
  }

  protected switchToLogin(): void {
    this.showRegisterModal.set(false);
    this.showLoginModal.set(true);
  }

  protected onLoginSuccess(): void {
    this.showLoginModal.set(false);
  }

  protected onRegisterSuccess(): void {
    this.showRegisterModal.set(false);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected toggleSearchDropdown(): void {
    this.searchDropdownOpen.update((open) => !open);
  }

  protected closeSearchDropdown(): void {
    this.searchDropdownOpen.set(false);
  }

  protected cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.accountMenuOpen.set(false);
  }
}
