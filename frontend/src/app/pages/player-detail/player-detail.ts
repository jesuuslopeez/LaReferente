import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlayerService } from '../../core/services/player.service';
import { Player, AgeCategory } from '../../core/models';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './player-detail.html',
  styleUrl: './player-detail.scss',
})
export class PlayerDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private playerService = inject(PlayerService);

  player = signal<Player | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPlayer(+id);
    }
  }

  private loadPlayer(id: number): void {
    this.playerService.getById(id).subscribe({
      next: (player) => {
        this.player.set(player);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('No se pudo cargar el jugador');
        this.loading.set(false);
      },
    });
  }

  getImageUrl(player: Player): string {
    if (player.fotoUrl) {
      if (player.fotoUrl.startsWith('/api')) {
        return `http://localhost:8080${player.fotoUrl}`;
      }
      return player.fotoUrl;
    }
    return `assets/images/players/medium/${player.id}.webp`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/players/medium/no_cutout.webp';
  }

  getCategoriaTexto(categoria: AgeCategory): string {
    const map: Record<AgeCategory, string> = {
      SENIOR: 'Senior',
      JUVENIL: 'Juvenil',
      CADETE: 'Cadete',
      INFANTIL: 'Infantil',
      ALEVIN: 'Alevín',
      BENJAMIN: 'Benjamín',
      PREBENJAMIN: 'Prebenjamín',
    };
    return map[categoria] || categoria;
  }

  getPosicionTexto(posicion: string): string {
    const map: Record<string, string> = {
      PORTERO: 'Portero',
      DEFENSA: 'Defensa',
      CENTROCAMPISTA: 'Centrocampista',
      DELANTERO: 'Delantero',
    };
    return map[posicion] || posicion;
  }
}
