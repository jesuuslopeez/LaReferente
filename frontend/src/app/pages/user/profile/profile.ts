import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FormularioConCambios } from '../../../guards/form.guard';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements FormularioConCambios {
  nombre = '';
  email = '';
  cambiosRealizados = signal(false);
  guardando = signal(false);
  mensaje = signal<string | null>(null);

  constructor(private authService: AuthService) {
    const usuario = this.authService.usuario();
    if (usuario) {
      this.nombre = usuario.nombre;
      this.email = usuario.email;
    }
  }

  tieneCambiosSinGuardar(): boolean {
    return this.cambiosRealizados();
  }

  marcarCambio(): void {
    this.cambiosRealizados.set(true);
    this.mensaje.set(null);
  }

  guardar(): void {
    this.guardando.set(true);

    // Simulamos guardado
    setTimeout(() => {
      this.cambiosRealizados.set(false);
      this.guardando.set(false);
      this.mensaje.set('Perfil actualizado correctamente');
    }, 1000);
  }
}
