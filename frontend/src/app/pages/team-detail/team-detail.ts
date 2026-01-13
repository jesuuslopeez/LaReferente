import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TeamService } from '../../core/services/team.service';
import { PlayerService } from '../../core/services/player.service';
import { Team, Player, AgeCategory } from '../../core/models';
import { PlayerCard } from '../../components/shared/player-card/player-card';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [RouterLink, PlayerCard],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.scss',
})
export class TeamDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private teamService = inject(TeamService);
  private playerService = inject(PlayerService);

  team = signal<Team | null>(null);
  players = signal<Player[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTeam(+id);
    }
  }

  private loadTeam(id: number): void {
    this.teamService.getById(id).subscribe({
      next: (team) => {
        this.team.set(team);
        this.loading.set(false);
        this.loadPlayers(id);
      },
      error: () => {
        this.error.set('No se pudo cargar el equipo');
        this.loading.set(false);
      },
    });
  }

  private loadPlayers(teamId: number): void {
    this.playerService.getByTeam(teamId).subscribe({
      next: (players) => {
        this.players.set(players);
      },
      error: () => {
        // Silently fail, players list will be empty
      },
    });
  }

  getLogoUrl(team: Team): string {
    if (team.logoUrl) {
      if (team.logoUrl.startsWith('/api')) {
        return `http://localhost:8080${team.logoUrl}`;
      }
      return team.logoUrl;
    }
    return 'assets/images/teams/default-logo.png';
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/teams/default-logo.png';
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

  getDisplayName(team: Team): string {
    let name = team.nombre;
    if (team.letra) {
      name += ` ${team.letra}`;
    }
    return name;
  }
}
