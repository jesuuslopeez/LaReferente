import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  error = signal<string | null>(null);
  modoRegistro = signal(false);
  nombre = '';
  apellidos = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get cargando() {
    return this.authService.cargando;
  }

  cambiarModo(): void {
    this.modoRegistro.set(!this.modoRegistro());
    this.error.set(null);
  }

  enviar(): void {
    this.error.set(null);

    if (this.modoRegistro()) {
      this.authService
        .registro({
          email: this.email,
          password: this.password,
          nombre: this.nombre,
          apellidos: this.apellidos,
        })
        .subscribe({
          next: () => this.router.navigate(['/usuario']),
          error: (err) => this.error.set(err.error?.message || 'Error al registrarse'),
        });
    } else {
      this.authService
        .login({
          email: this.email,
          password: this.password,
        })
        .subscribe({
          next: () => this.router.navigate(['/usuario']),
          error: (err) => this.error.set(err.error?.message || 'Credenciales incorrectas'),
        });
    }
  }
}
