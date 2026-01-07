import { Component } from '@angular/core';
import { CompetitionCard } from '../../components/shared/competition-card/competition-card';

@Component({
  selector: 'app-competitions',
  imports: [CompetitionCard],
  templateUrl: './competitions.html',
  styleUrl: './competitions.scss',
})
export class Competitions {
  filtroActivo = 'todas';

  filtros = ['Todas', 'Senior', 'Juvenil', 'Cadete', 'Infantil', 'Alevín', 'Benjamín'];

  competiciones = [
    {
      logo: 'images/competitions/laliga-ea.png',
      nombre: 'LaLiga EA Sports',
      equipos: 20,
      fechaInicio: 'Agosto 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      logo: 'images/competitions/laliga-hypermotion.png',
      nombre: 'LaLiga Hypermotion',
      equipos: 22,
      fechaInicio: 'Agosto 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      logo: 'images/competitions/primera-federacion.png',
      nombre: 'Primera Federación',
      equipos: 20,
      grupos: 2,
      fechaInicio: 'Agosto 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      logo: 'images/competitions/segunda-federacion.png',
      nombre: 'Segunda Federación',
      equipos: 18,
      grupos: 5,
      fechaInicio: 'Septiembre 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      logo: 'images/competitions/tercera-federacion.png',
      nombre: 'Tercera Federación',
      equipos: 18,
      grupos: 18,
      fechaInicio: 'Septiembre 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      logo: 'images/competitions/division-honor.png',
      nombre: 'División de Honor',
      equipos: 16,
      grupos: 7,
      fechaInicio: 'Septiembre 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'juvenil',
    },
    {
      logo: 'images/competitions/rfaf.png',
      nombre: 'Primera Andaluza',
      equipos: 16,
      grupos: 8,
      fechaInicio: 'Septiembre 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      logo: 'images/competitions/rfaf.png',
      nombre: 'Segunda Andaluza',
      equipos: 16,
      grupos: 12,
      fechaInicio: 'Septiembre 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
  ];

  get competicionesFiltradas() {
    if (this.filtroActivo === 'todas') {
      return this.competiciones;
    }
    return this.competiciones.filter((c) => c.categoria === this.filtroActivo);
  }

  setFiltro(filtro: string) {
    this.filtroActivo = filtro.toLowerCase();
  }
}
