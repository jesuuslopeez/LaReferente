import { Component, signal, inject, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatchService } from '../../core/services/match.service';
import { Match, MatchStatus } from '../../core/models';

@Component({
  selector: 'app-calendar',
  imports: [DatePipe],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  private destroyRef = inject(DestroyRef);
  private matchService = inject(MatchService);

  // Estado
  partidos = signal<Match[]>([]);
  filtroEstado = signal<MatchStatus | 'todos'>('todos');

  // Filtros de estado
  estados: { valor: MatchStatus | 'todos'; texto: string }[] = [
    { valor: 'todos', texto: 'Todos' },
    { valor: 'PROGRAMADO', texto: 'Programados' },
    { valor: 'EN_CURSO', texto: 'En curso' },
    { valor: 'FINALIZADO', texto: 'Finalizados' },
    { valor: 'APLAZADO', texto: 'Aplazados' },
  ];

  constructor() {
    // Cargar todos los partidos
    this.matchService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((partidos) => {
        this.partidos.set(partidos);
      });
  }

  // Partidos filtrados por estado
  partidosFiltrados = computed(() => {
    const filtro = this.filtroEstado();
    let resultado = this.partidos();

    if (filtro !== 'todos') {
      resultado = resultado.filter((p) => p.estado === filtro);
    }

    // Ordenar por fecha
    return resultado.sort((a, b) =>
      new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
    );
  });

  // Partidos agrupados por fecha
  partidosPorFecha = computed(() => {
    const grupos: { fecha: string; partidos: Match[] }[] = [];
    const partidosOrdenados = this.partidosFiltrados();

    partidosOrdenados.forEach((partido) => {
      const fecha = new Date(partido.fechaHora).toISOString().split('T')[0];
      const grupoExistente = grupos.find((g) => g.fecha === fecha);

      if (grupoExistente) {
        grupoExistente.partidos.push(partido);
      } else {
        grupos.push({ fecha, partidos: [partido] });
      }
    });

    return grupos;
  });

  setFiltroEstado(estado: MatchStatus | 'todos'): void {
    this.filtroEstado.set(estado);
  }

  // Obtener clase CSS según estado
  getEstadoClass(estado: MatchStatus): string {
    switch (estado) {
      case 'PROGRAMADO':
        return 'match--programado';
      case 'EN_CURSO':
        return 'match--en-curso';
      case 'FINALIZADO':
        return 'match--finalizado';
      case 'APLAZADO':
        return 'match--aplazado';
      case 'CANCELADO':
        return 'match--cancelado';
      default:
        return '';
    }
  }

  // Texto legible del estado
  getEstadoTexto(estado: MatchStatus): string {
    switch (estado) {
      case 'PROGRAMADO':
        return 'Programado';
      case 'EN_CURSO':
        return 'En curso';
      case 'FINALIZADO':
        return 'Finalizado';
      case 'APLAZADO':
        return 'Aplazado';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return estado;
    }
  }

  // Formatear fecha para mostrar
  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  }

  // Formatear hora
  formatHora(fechaHora: string): string {
    const date = new Date(fechaHora);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }
}
