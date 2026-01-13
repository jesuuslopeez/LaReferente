import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompetitionType } from '../../../core/models';

@Component({
  selector: 'app-competition-card',
  imports: [RouterLink],
  templateUrl: './competition-card.html',
  styleUrl: './competition-card.scss',
})
export class CompetitionCard {
  id = input.required<number>();
  nombre = input.required<string>();
  nombreCompleto = input<string | null>();
  tipo = input.required<CompetitionType>();
  temporada = input.required<string>();
  logoUrl = input<string | null>();
  fechaInicio = input<string | null>();
  fechaFin = input<string | null>();

  // Logo con fallback
  get logoSrc(): string {
    return this.logoUrl() || 'assets/images/competitions/default.webp';
  }

  // Tipo formateado
  get tipoFormateado(): string {
    return this.tipo() === 'LIGA' ? 'Liga' : 'Copa';
  }

  // Fechas formateadas
  get fechasFormateadas(): string {
    const inicio = this.fechaInicio();
    const fin = this.fechaFin();
    if (!inicio || !fin) return this.temporada();

    const formatearFecha = (fecha: string) => {
      const date = new Date(fecha);
      const mes = date.toLocaleDateString('es-ES', { month: 'long' });
      const anio = date.getFullYear();
      return `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${anio}`;
    };

    return `${formatearFecha(inicio)} - ${formatearFecha(fin)}`;
  }
}
