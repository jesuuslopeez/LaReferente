import { Component, EventEmitter, Input, Output, signal, inject, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TeamService } from '../../../core/services/team.service';
import { Team, AgeCategory } from '../../../core/models';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-team-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './team-search.html',
  styleUrl: './team-search.scss',
})
export class TeamSearch implements OnChanges {
  private teamService = inject(TeamService);
  private searchSubject = new Subject<string>();

  @Input() label = '';
  @Input() categoria: AgeCategory = 'SENIOR';
  @Input() selectedTeamId: number | null = null;
  @Output() teamSelected = new EventEmitter<{ id: number; nombre: string } | null>();

  searchTerm = '';
  results = signal<Team[]>([]);
  selectedTeam = signal<Team | null>(null);
  isOpen = signal(false);
  isLoading = signal(false);

  constructor() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((term) => {
      this.performSearch(term);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoria'] && !changes['categoria'].firstChange) {
      // Si cambia la categoría, limpiar selección
      this.clearSelection();
    }
    if (changes['selectedTeamId'] && this.selectedTeamId) {
      this.loadSelectedTeam();
    }
  }

  private loadSelectedTeam(): void {
    if (this.selectedTeamId) {
      this.teamService.getById(this.selectedTeamId).subscribe({
        next: (team) => {
          this.selectedTeam.set(team);
        },
        error: () => {
          this.selectedTeam.set(null);
        },
      });
    }
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFocus(): void {
    this.isOpen.set(true);
    if (this.results().length === 0) {
      this.performSearch('');
    }
  }

  onBlur(): void {
    // Delay para permitir click en resultados
    setTimeout(() => {
      this.isOpen.set(false);
    }, 200);
  }

  private performSearch(term: string): void {
    this.isLoading.set(true);
    this.teamService.search(this.categoria, term || undefined).subscribe({
      next: (teams) => {
        this.results.set(teams);
        this.isLoading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.isLoading.set(false);
      },
    });
  }

  selectTeam(team: Team): void {
    this.selectedTeam.set(team);
    this.searchTerm = '';
    this.isOpen.set(false);
    this.teamSelected.emit({ id: team.id, nombre: team.nombre });
  }

  clearSelection(): void {
    this.selectedTeam.set(null);
    this.searchTerm = '';
    this.teamSelected.emit(null);
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
}
