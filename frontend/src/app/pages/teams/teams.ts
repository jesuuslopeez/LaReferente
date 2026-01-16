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
  filtroCategoria = signal('todas');
  categorias = [
    { valor: 'todas', texto: 'Todas' },
    { valor: 'SENIOR', texto: 'Senior' },
    { valor: 'JUVENIL', texto: 'Juvenil' },
    { valor: 'CADETE', texto: 'Cadete' },
    { valor: 'INFANTIL', texto: 'Infantil' },
    { valor: 'ALEVIN', texto: 'Alevín' },
    { valor: 'BENJAMIN', texto: 'Benjamín' },
    { valor: 'PREBENJAMIN', texto: 'Prebenjamín' },
  ];

  // Paginacion
  paginaActual = signal(1);
  itemsPorPagina = 8;

  // Control del input de busqueda
  busquedaControl = new FormControl('');

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

  // Equipos filtrados por categoría y búsqueda
  get equiposFiltrados(): Team[] {
    const filtro = this.filtroCategoria();
    const texto = this.busqueda().toLowerCase().trim();
    let resultado = this.equipos();

    // Filtrar por categoría de edad
    if (filtro !== 'todas') {
      resultado = resultado.filter((e) => e.categoria === filtro);
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

  setFiltroCategoria(valor: string): void {
    this.filtroCategoria.set(valor);
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
