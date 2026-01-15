import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = '';
  password = '';
  error = signal<string | null>(null);
  modoRegistro = signal(false);
  nombre = '';
  apellidos = '';

  /** URL a la que redirigir después del login (si viene de una ruta protegida) */
  private returnUrl = '/usuario';

  ngOnInit(): void {
    // Leer la URL de retorno desde queryParams
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/usuario';
  }

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
          next: () => this.router.navigateByUrl(this.returnUrl),
          error: (err) => this.error.set(err.error?.message || 'Error al registrarse'),
        });
    } else {
      this.authService
        .login({
          email: this.email,
          password: this.password,
        })
        .subscribe({
          next: () => this.router.navigateByUrl(this.returnUrl),
          error: (err) => this.error.set(err.error?.message || 'Credenciales incorrectas'),
        });
    }
  }
}
