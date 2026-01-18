import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../core/services/team.service';
import { PlayerService } from '../../core/services/player.service';
import { AuthService } from '../../services/auth.service';
import { Team, Player, AgeCategory, UpdateTeamDto } from '../../core/models';
import { PlayerCard } from '../../components/shared/player-card/player-card';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [RouterLink, PlayerCard, FormsModule],
  templateUrl: './team-detail.html',
  styleUrl: './team-detail.scss',
})
export class TeamDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private teamService = inject(TeamService);
  private playerService = inject(PlayerService);
  authService = inject(AuthService);

  team = signal<Team | null>(null);
  players = signal<Player[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Estado del modal de edición
  showEditModal = signal(false);
  closingModal = signal(false);
  saving = signal(false);
  saveError = signal<string | null>(null);

  // Datos del formulario de edición
  editForm = signal<UpdateTeamDto>({});

  // Opciones para selects
  categorias: { value: AgeCategory; label: string }[] = [
    { value: 'SENIOR', label: 'Senior' },
    { value: 'JUVENIL', label: 'Juvenil' },
    { value: 'CADETE', label: 'Cadete' },
    { value: 'INFANTIL', label: 'Infantil' },
    { value: 'ALEVIN', label: 'Alevín' },
    { value: 'BENJAMIN', label: 'Benjamín' },
    { value: 'PREBENJAMIN', label: 'Prebenjamín' },
  ];

  paises: string[] = [
    'España', 'Francia', 'Alemania', 'Italia', 'Portugal', 'Inglaterra',
    'Brasil', 'Argentina', 'Países Bajos', 'Bélgica'
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTeam(+id);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showEditModal() && !this.closingModal()) {
      this.closeEditModal();
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

  openEditModal(): void {
    const t = this.team();
    if (!t) return;

    this.editForm.set({
      nombre: t.nombre,
      nombreCompleto: t.nombreCompleto ?? undefined,
      categoria: t.categoria,
      letra: t.letra ?? undefined,
      pais: t.pais,
      ciudad: t.ciudad ?? undefined,
      estadio: t.estadio ?? undefined,
      fundacion: t.fundacion ?? undefined,
      descripcion: t.descripcion ?? undefined,
      activo: t.activo,
      logoUrl: t.logoUrl ?? undefined,
    });
    this.saveError.set(null);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.closingModal.set(true);
    setTimeout(() => {
      this.showEditModal.set(false);
      this.closingModal.set(false);
    }, 300);
  }

  updateFormField(field: keyof UpdateTeamDto, value: any): void {
    this.editForm.update(form => ({ ...form, [field]: value }));
  }

  saveTeam(): void {
    const t = this.team();
    if (!t) return;

    this.saving.set(true);
    this.saveError.set(null);

    this.teamService.update(t.id, this.editForm()).subscribe({
      next: (updatedTeam) => {
        this.team.set(updatedTeam);
        this.saving.set(false);
        this.showEditModal.set(false);
        this.closingModal.set(false);
      },
      error: () => {
        this.saveError.set('Error al guardar los cambios');
        this.saving.set(false);
      },
    });
  }

  getLogoUrl(team: Team): string {
    if (team.logoUrl) {
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
