import { Component, input, computed } from '@angular/core';
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

  get fotoSrc(): string {
    return this.fotoUrl() || 'assets/images/players/default-player.webp';
  }

  get nombreCompleto(): string {
    return `${this.nombre()} ${this.apellidos()}`;
  }

  // Color basado en posición
  posicionClass = computed(() => {
    const pos = this.posicion();
    switch (pos) {
      case 'PORTERO':
        return 'player-card--portero';
      case 'DEFENSA':
        return 'player-card--defensa';
      case 'CENTROCAMPISTA':
        return 'player-card--centrocampista';
      case 'DELANTERO':
        return 'player-card--delantero';
      default:
        return '';
    }
  });

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
