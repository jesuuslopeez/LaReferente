import { Component, input, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlayerPosition } from '../../../core/models';

@Component({
  selector: 'app-player-card',
  imports: [RouterLink],
  templateUrl: './player-card.html',
  styleUrl: './player-card.scss',
})
export class PlayerCard {
  id = input.required<number>();
  nombre = input.required<string>();
  apellidos = input.required<string>();
  posicion = input.required<PlayerPosition>();
  dorsal = input<number | null>();
  edad = input<number>();
  nacionalidad = input<string>();
  fotoUrl = input<string | null>();
  equipoNombre = input<string | null>();
  equipoId = input<number | null>();

  private readonly fallbackImage = 'assets/images/players/medium/no_cutout.webp';
  fotoError = signal(false);

  get fotoSrc(): string {
    if (this.fotoError()) {
      return this.fallbackImage;
    }
    return `assets/images/players/medium/${this.id()}.webp`;
  }

  onImageError(): void {
    this.fotoError.set(true);
  }

  get nombreCompleto(): string {
    return `${this.nombre()} ${this.apellidos()}`;
  }

  // Texto legible de posición
  posicionTexto = computed(() => {
    const pos = this.posicion();
    switch (pos) {
      case 'PORTERO':
        return 'Portero';
      case 'DEFENSA':
        return 'Defensa';
      case 'CENTROCAMPISTA':
        return 'Centrocampista';
      case 'DELANTERO':
        return 'Delantero';
      default:
        return pos;
    }
  });
}
