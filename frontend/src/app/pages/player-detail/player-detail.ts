import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PlayerService } from '../../core/services/player.service';
import { TeamService } from '../../core/services/team.service';
import { PaisesService, Pais } from '../../core/services/paises.service';
import { AuthService } from '../../services/auth.service';
import { Player, Team, AgeCategory, PlayerPosition, UpdatePlayerDto } from '../../core/models';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './player-detail.html',
  styleUrl: './player-detail.scss',
})
export class PlayerDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private playerService = inject(PlayerService);
  private teamService = inject(TeamService);
  private paisesService = inject(PaisesService);
  authService = inject(AuthService);

  player = signal<Player | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  // Estado del modal de edición
  showEditModal = signal(false);
  closingModal = signal(false);
  saving = signal(false);
  saveError = signal<string | null>(null);
  teams = signal<Team[]>([]);

  // Datos del formulario de edición
  editForm = signal<UpdatePlayerDto>({});

  // Opciones para selects
  posiciones: { value: PlayerPosition; label: string }[] = [
    { value: 'PORTERO', label: 'Portero' },
    { value: 'DEFENSA', label: 'Defensa' },
    { value: 'CENTROCAMPISTA', label: 'Centrocampista' },
    { value: 'DELANTERO', label: 'Delantero' },
  ];

  categorias: { value: AgeCategory; label: string }[] = [
    { value: 'SENIOR', label: 'Senior' },
    { value: 'JUVENIL', label: 'Juvenil' },
    { value: 'CADETE', label: 'Cadete' },
    { value: 'INFANTIL', label: 'Infantil' },
    { value: 'ALEVIN', label: 'Alevín' },
    { value: 'BENJAMIN', label: 'Benjamín' },
    { value: 'PREBENJAMIN', label: 'Prebenjamín' },
  ];

  // Autocompletado de países
  paisSugerencias = signal<Pais[]>([]);
  paisInput = signal<string>('');
  showPaisSugerencias = signal(false);
  paisValido = signal(true);

  ngOnInit(): void {
    // Cargar mapa de banderas
    this.paisesService.buildFlagMap().subscribe();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPlayer(+id);
      this.loadTeams();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showEditModal() && !this.closingModal()) {
      this.closeEditModal();
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

  private loadTeams(): void {
    this.teamService.getActive().subscribe({
      next: (teams) => this.teams.set(teams),
      error: () => {},
    });
  }

  // Métodos para autocompletado de países
  onPaisInputChange(valor: string): void {
    this.paisInput.set(valor);
    this.paisValido.set(false);
    this.updateFormField('nacionalidad', undefined);

    if (valor.length >= 1) {
      this.paisesService.buscarPaises(valor).subscribe({
        next: (sugerencias) => {
          this.paisSugerencias.set(sugerencias);
          this.showPaisSugerencias.set(sugerencias.length > 0);
        },
      });
    } else {
      this.paisSugerencias.set([]);
      this.showPaisSugerencias.set(false);
    }
  }

  seleccionarPais(pais: Pais): void {
    this.paisInput.set(pais.es_name);
    this.updateFormField('nacionalidad', pais.es_name);
    this.paisValido.set(true);
    this.showPaisSugerencias.set(false);
    this.paisSugerencias.set([]);
  }

  ocultarPaisSugerencias(): void {
    setTimeout(() => {
      this.showPaisSugerencias.set(false);
    }, 200);
  }

  mostrarPaisSugerencias(): void {
    if (this.paisSugerencias().length > 0) {
      this.showPaisSugerencias.set(true);
    }
  }

  openEditModal(): void {
    const p = this.player();
    if (!p) return;

    this.editForm.set({
      nombre: p.nombre,
      apellidos: p.apellidos,
      fechaNacimiento: p.fechaNacimiento,
      nacionalidad: p.nacionalidad,
      posicion: p.posicion,
      categoria: p.categoria,
      dorsal: p.dorsal ?? undefined,
      altura: p.altura ?? undefined,
      peso: p.peso ?? undefined,
      biografia: p.biografia ?? undefined,
      equipoId: p.equipoId ?? undefined,
      activo: p.activo,
      fotoUrl: p.fotoUrl ?? undefined,
    });

    // Inicializar el input de país con la nacionalidad actual
    if (p.nacionalidad) {
      this.paisInput.set(p.nacionalidad);
      this.paisValido.set(true);
    } else {
      this.paisInput.set('');
      this.paisValido.set(true);
    }
    this.paisSugerencias.set([]);
    this.showPaisSugerencias.set(false);

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

  updateFormField(field: keyof UpdatePlayerDto, value: any): void {
    this.editForm.update(form => ({ ...form, [field]: value }));
  }

  savePlayer(): void {
    const p = this.player();
    if (!p) return;

    this.saving.set(true);
    this.saveError.set(null);

    this.playerService.update(p.id, this.editForm()).subscribe({
      next: (updatedPlayer) => {
        this.player.set(updatedPlayer);
        this.saving.set(false);
        this.showEditModal.set(false);
      },
      error: (err) => {
        this.saveError.set('Error al guardar los cambios');
        this.saving.set(false);
      },
    });
  }

  getImageUrl(player: Player): string {
    if (player.fotoUrl) {
      return player.fotoUrl;
    }
    return `assets/images/players/medium/${player.id}.webp`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/players/medium/no_cutout.webp';
  }

  onTeamLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
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

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  getAlturaMetros(altura: number): string {
    // La altura ya viene en metros desde la BD
    return altura.toFixed(2).replace('.', ',') + ' m';
  }

  getTeamLogoSmall(equipoId: number | null): string {
    if (!equipoId) return '';
    return `assets/images/teams/small/${equipoId}.webp`;
  }

  getFlagCode(nacionalidad: string): string {
    return this.paisesService.getFlagCodeSync(nacionalidad);
  }
}
