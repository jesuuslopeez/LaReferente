import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../core/services/team.service';
import { PlayerService } from '../../core/services/player.service';
import { CompetitionService } from '../../services/competition.service';
import { MunicipiosService } from '../../core/services/municipios.service';
import { AuthService } from '../../services/auth.service';
import { Team, Player, AgeCategory, UpdateTeamDto, Competition, CompetitionType } from '../../core/models';
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
  private competitionService = inject(CompetitionService);
  private municipiosService = inject(MunicipiosService);
  authService = inject(AuthService);

  team = signal<Team | null>(null);
  players = signal<Player[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Competiciones disponibles para asignar
  availableCompetitions = signal<Competition[]>([]);

  // Autocompletado de municipios
  municipioSugerencias = signal<{ municipio: string; provincia: string }[]>([]);
  municipioInput = signal<string>('');
  showSugerencias = signal(false);
  municipioValido = signal(true);

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

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTeam(+id);
    }
    this.loadCompetitions();
  }

  private loadCompetitions(): void {
    this.competitionService.obtenerTodas().subscribe({
      next: (competitions) => {
        this.availableCompetitions.set(competitions);
      },
      error: () => {
        // Silently fail
      },
    });
  }

  // Métodos para autocompletado de municipios
  onMunicipioInputChange(valor: string): void {
    this.municipioInput.set(valor);
    this.municipioValido.set(false);
    this.updateFormField('ciudad', undefined);

    if (valor.length >= 2) {
      this.municipiosService.buscarMunicipios(valor).subscribe({
        next: (sugerencias) => {
          this.municipioSugerencias.set(sugerencias);
          this.showSugerencias.set(sugerencias.length > 0);
        },
      });
    } else {
      this.municipioSugerencias.set([]);
      this.showSugerencias.set(false);
    }
  }

  seleccionarMunicipio(sugerencia: { municipio: string; provincia: string }): void {
    this.municipioInput.set(sugerencia.municipio);
    this.updateFormField('ciudad', sugerencia.municipio);
    this.municipioValido.set(true);
    this.showSugerencias.set(false);
    this.municipioSugerencias.set([]);
  }

  ocultarSugerencias(): void {
    // Pequeño delay para permitir el click en una sugerencia
    setTimeout(() => {
      this.showSugerencias.set(false);
    }, 200);
  }

  mostrarSugerencias(): void {
    if (this.municipioSugerencias().length > 0) {
      this.showSugerencias.set(true);
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
      competicionIds: t.competicionIds ?? [],
    });

    // Inicializar el input de municipio con la ciudad actual
    if (t.ciudad) {
      this.municipioInput.set(t.ciudad);
      this.municipioValido.set(true);
    } else {
      this.municipioInput.set('');
      this.municipioValido.set(true);
    }
    this.municipioSugerencias.set([]);
    this.showSugerencias.set(false);

    this.saveError.set(null);
    this.showEditModal.set(true);
  }

  // Obtener competiciones filtradas por categoría del equipo
  getFilteredCompetitions(): Competition[] {
    const t = this.team();
    if (!t) return [];
    return this.availableCompetitions().filter(c => c.categoria === t.categoria);
  }

  // Verificar si ya hay una liga seleccionada
  private hasLeagueSelected(): boolean {
    const currentIds = this.editForm().competicionIds ?? [];
    return this.availableCompetitions().some(
      c => currentIds.includes(c.id) && c.tipo === 'LIGA'
    );
  }

  // Verificar si una competición está deshabilitada (es liga y ya hay otra liga seleccionada)
  isCompetitionDisabled(competition: Competition): boolean {
    if (competition.tipo !== 'LIGA') return false;
    const currentIds = this.editForm().competicionIds ?? [];
    // Si esta liga ya está seleccionada, no está deshabilitada
    if (currentIds.includes(competition.id)) return false;
    // Si hay otra liga seleccionada, esta está deshabilitada
    return this.hasLeagueSelected();
  }

  toggleCompetition(competition: Competition): void {
    // No permitir toggle si está deshabilitada
    if (this.isCompetitionDisabled(competition)) return;

    const currentIds = this.editForm().competicionIds ?? [];
    const index = currentIds.indexOf(competition.id);
    if (index > -1) {
      // Remove
      this.updateFormField('competicionIds', currentIds.filter(id => id !== competition.id));
    } else {
      // Add
      this.updateFormField('competicionIds', [...currentIds, competition.id]);
    }
  }

  isCompetitionSelected(competitionId: number): boolean {
    return (this.editForm().competicionIds ?? []).includes(competitionId);
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
