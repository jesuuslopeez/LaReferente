import { Component, signal, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PlayerCard } from '../../components/shared/player-card/player-card';
import { PlayerService } from '../../core/services/player.service';
import { Player, PlayerPosition } from '../../core/models';

@Component({
  selector: 'app-players',
  imports: [PlayerCard, ReactiveFormsModule],
  templateUrl: './players.html',
  styleUrl: './players.scss',
})
export class Players {
  private destroyRef = inject(DestroyRef);
  private playerService = inject(PlayerService);

  // Estado
  jugadores = signal<Player[]>([]);
  busqueda = signal('');
  filtroPosicion = signal<PlayerPosition | 'todas'>('todas');

  // Filtros de posición
  posiciones: { valor: PlayerPosition | 'todas'; texto: string }[] = [
    { valor: 'todas', texto: 'Todas' },
    { valor: 'PORTERO', texto: 'Porteros' },
    { valor: 'DEFENSA', texto: 'Defensas' },
    { valor: 'CENTROCAMPISTA', texto: 'Centrocampistas' },
    { valor: 'DELANTERO', texto: 'Delanteros' },
  ];

  // Paginacion
  paginaActual = signal(1);
  itemsPorPagina = 12;

  // Control del input de busqueda
  busquedaControl = new FormControl('');

  constructor() {
    // Cargar jugadores activos
    this.playerService
      .getActive()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((jugadores) => {
        this.jugadores.set(jugadores);
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

  // Jugadores filtrados por posicion y busqueda
  get jugadoresFiltrados(): Player[] {
    const filtro = this.filtroPosicion();
    const texto = this.busqueda().toLowerCase().trim();
    let resultado = this.jugadores();

    // Filtrar por posicion
    if (filtro !== 'todas') {
      resultado = resultado.filter((j) => j.posicion === filtro);
    }

    // Filtrar por texto de busqueda
    if (texto) {
      resultado = resultado.filter(
        (j) =>
          j.nombre.toLowerCase().includes(texto) ||
          j.apellidos.toLowerCase().includes(texto) ||
          (j.equipoNombre && j.equipoNombre.toLowerCase().includes(texto))
      );
    }

    return resultado;
  }

  // Jugadores de la pagina actual
  get jugadoresPaginados(): Player[] {
    const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.jugadoresFiltrados.slice(inicio, fin);
  }

  // Total de paginas
  get totalPaginas(): number {
    return Math.ceil(this.jugadoresFiltrados.length / this.itemsPorPagina);
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

  setFiltroPosicion(posicion: PlayerPosition | 'todas'): void {
    this.filtroPosicion.set(posicion);
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
