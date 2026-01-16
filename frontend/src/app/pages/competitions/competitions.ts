import { Component, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CompetitionCard } from '../../components/shared/competition-card/competition-card';
import { CompetitionService } from '../../services/competition.service';
import { Competition } from '../../core/models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-competitions',
  imports: [CompetitionCard, ReactiveFormsModule, RouterLink],
  templateUrl: './competitions.html',
  styleUrl: './competitions.scss',
})
export class Competitions {
  private destroyRef = inject(DestroyRef);
  private competitionService = inject(CompetitionService);
  protected readonly authService = inject(AuthService);

  // Estado
  filtroActivo = signal('todas');
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
  competiciones = signal<Competition[]>([]);
  busqueda = signal('');

  // Paginacion
  paginaActual = signal(1);
  itemsPorPagina = 6;

  // Control del input de busqueda
  busquedaControl = new FormControl('');

  constructor() {
    // Cargar competiciones
    this.competitionService
      .obtenerTodas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((comps) => {
        this.competiciones.set(comps);
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

  // Competiciones filtradas por categoría y búsqueda
  get competicionesFiltradas(): Competition[] {
    const filtro = this.filtroActivo();
    const texto = this.busqueda().toLowerCase().trim();
    let resultado = this.competiciones();

    // Filtrar por categoría de edad
    if (filtro !== 'todas') {
      resultado = resultado.filter((c) => c.categoria === filtro);
    }

    // Filtrar por texto de busqueda
    if (texto) {
      resultado = resultado.filter((c) =>
        c.nombre.toLowerCase().includes(texto)
      );
    }

    return resultado;
  }

  // Competiciones de la pagina actual
  get competicionesPaginadas(): Competition[] {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.competicionesFiltradas.slice(inicio, fin);
  }

  // Total de paginas
  get totalPaginas(): number {
    return Math.ceil(this.competicionesFiltradas.length / this.itemsPorPagina);
  }

  // Array de numeros de pagina para mostrar
  get paginas(): number[] {
    const total = this.totalPaginas;
    const actual = this.paginaActual();
    const paginas: number[] = [];

    // Mostrar maximo 5 paginas
    let inicio = Math.max(1, actual - 2);
    let fin = Math.min(total, inicio + 4);

    // Ajustar si estamos cerca del final
    if (fin - inicio < 4) {
      inicio = Math.max(1, fin - 4);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  }

  setFiltro(valor: string): void {
    this.filtroActivo.set(valor);
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
