import { Component, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TeamCard } from '../../components/shared/team-card/team-card';
import { TeamService } from '../../core/services/team.service';
import { Team } from '../../core/models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-teams',
  imports: [TeamCard, ReactiveFormsModule, RouterLink],
  templateUrl: './teams.html',
  styleUrl: './teams.scss',
})
export class Teams {
  private destroyRef = inject(DestroyRef);
  private teamService = inject(TeamService);
  protected readonly authService = inject(AuthService);

  // Estado
  equipos = signal<Team[]>([]);
  busqueda = signal('');
  filtroPais = signal('todos');

  // Paginacion
  paginaActual = signal(1);
  itemsPorPagina = 8;

  // Control del input de busqueda
  busquedaControl = new FormControl('');

  // Paises disponibles (se calculan de los equipos cargados)
  get paisesDisponibles(): string[] {
    const paises = new Set(this.equipos().map((e) => e.pais));
    return ['Todos', ...Array.from(paises).sort()];
  }

  constructor() {
    // Cargar equipos activos
    this.teamService
      .getActive()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((equipos) => {
        this.equipos.set(equipos);
      });

    // Busqueda con debounce
    this.busquedaControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((valor) => {
        this.busqueda.set(valor || '');
        this.paginaActual.set(1);
      });
  }

  // Equipos filtrados por pais y busqueda
  get equiposFiltrados(): Team[] {
    const filtro = this.filtroPais();
    const texto = this.busqueda().toLowerCase().trim();
    let resultado = this.equipos();

    // Filtrar por pais
    if (filtro !== 'todos') {
      resultado = resultado.filter((e) => e.pais === filtro);
    }

    // Filtrar por texto de busqueda
    if (texto) {
      resultado = resultado.filter(
        (e) =>
          e.nombre.toLowerCase().includes(texto) ||
          e.nombreCompleto.toLowerCase().includes(texto) ||
          e.ciudad.toLowerCase().includes(texto)
      );
    }

    return resultado;
  }

  // Equipos de la pagina actual
  get equiposPaginados(): Team[] {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.equiposFiltrados.slice(inicio, fin);
  }

  // Total de paginas
  get totalPaginas(): number {
    return Math.ceil(this.equiposFiltrados.length / this.itemsPorPagina);
  }

  // Array de numeros de pagina para mostrar
  get paginas(): number[] {
    const total = this.totalPaginas;
    const actual = this.paginaActual();
    const paginas: number[] = [];

    let inicio = Math.max(1, actual - 2);
    let fin = Math.min(total, inicio + 4);

    if (fin - inicio < 4) {
      inicio = Math.max(1, fin - 4);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  setFiltroPais(pais: string): void {
    this.filtroPais.set(pais.toLowerCase() === 'todos' ? 'todos' : pais);
    this.paginaActual.set(1);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual.set(pagina);
    }
  }

  paginaAnterior(): void {
    this.irAPagina(this.paginaActual() - 1);
  }

  paginaSiguiente(): void {
    this.irAPagina(this.paginaActual() + 1);
  }
}
