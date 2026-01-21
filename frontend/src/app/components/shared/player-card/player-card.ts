import { Component, input, computed, signal, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlayerPosition } from '../../../core/models';
import { PaisesService } from '../../../core/services';

@Component({
  selector: 'app-player-card',
  imports: [RouterLink],
  templateUrl: './player-card.html',
  styleUrl: './player-card.scss',
})
export class PlayerCard implements OnInit {
  private readonly paisesService = inject(PaisesService);

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
  hideTeamButton = input<boolean>(false);

  private readonly fallbackImage = 'assets/images/players/medium/no_cutout.webp';
  fotoError = signal(false);

  ngOnInit(): void {
    // Cargar mapa de banderas al inicializar
    this.paisesService.buildFlagMap().subscribe();
  }

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

  getTeamLogoSmall(equipoId: number | null): string {
    if (!equipoId) return '';
    return `assets/images/teams/small/${equipoId}.webp`;
  }

  onTeamLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  getFlagCode(nacionalidad: string | undefined): string {
    return this.paisesService.getFlagCodeSync(nacionalidad);
  }
}
