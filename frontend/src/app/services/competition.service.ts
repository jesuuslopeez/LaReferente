import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface Competicion {
  slug: string;
  logo: string;
  nombre: string;
  equipos: number;
  grupos?: Grupo[];
  fechaInicio: string;
  fechaFin: string;
  categoria: string;
}

export interface Grupo {
  slug: string;
  nombre: string;
  equipos: number;
}

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  private competiciones: Competicion[] = [
    {
      slug: 'laliga-ea-sports',
      logo: 'assets/images/competitions/medium/laliga_ea.webp',
      nombre: 'LaLiga EA Sports',
      equipos: 20,
      fechaInicio: 'Agosto 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      slug: 'laliga-hypermotion',
      logo: 'assets/images/competitions/medium/laliga_hypermotion.webp',
      nombre: 'LaLiga Hypermotion',
      equipos: 22,
      fechaInicio: 'Agosto 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      slug: 'primera-federacion',
      logo: 'assets/images/competitions/medium/primera_federacion.webp',
      nombre: 'Primera Federación',
      equipos: 20,
      grupos: [
        { slug: 'grupo-1', nombre: 'Grupo 1', equipos: 10 },
        { slug: 'grupo-2', nombre: 'Grupo 2', equipos: 10 },
      ],
      fechaInicio: 'Agosto 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      slug: 'segunda-federacion',
      logo: 'assets/images/competitions/medium/segunda_federacion.webp',
      nombre: 'Segunda Federación',
      equipos: 90,
      grupos: [
        { slug: 'grupo-1', nombre: 'Grupo 1', equipos: 18 },
        { slug: 'grupo-2', nombre: 'Grupo 2', equipos: 18 },
        { slug: 'grupo-3', nombre: 'Grupo 3', equipos: 18 },
        { slug: 'grupo-4', nombre: 'Grupo 4', equipos: 18 },
        { slug: 'grupo-5', nombre: 'Grupo 5', equipos: 18 },
      ],
      fechaInicio: 'Septiembre 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      slug: 'tercera-federacion',
      logo: 'assets/images/competitions/medium/tercera_federacion.webp',
      nombre: 'Tercera Federación',
      equipos: 324,
      grupos: Array.from({ length: 18 }, (_, i) => ({
        slug: `grupo-${i + 1}`,
        nombre: `Grupo ${i + 1}`,
        equipos: 18,
      })),
      fechaInicio: 'Septiembre 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      slug: 'division-honor',
      logo: 'assets/images/competitions/medium/division_honor.webp',
      nombre: 'División de Honor',
      equipos: 112,
      grupos: Array.from({ length: 7 }, (_, i) => ({
        slug: `grupo-${i + 1}`,
        nombre: `Grupo ${i + 1}`,
        equipos: 16,
      })),
      fechaInicio: 'Septiembre 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'juvenil',
    },
    {
      slug: 'primera-andaluza',
      logo: 'assets/images/competitions/medium/rfaf.webp',
      nombre: 'Primera Andaluza',
      equipos: 128,
      grupos: [
        { slug: 'almeria', nombre: 'Almería', equipos: 16 },
        { slug: 'cadiz', nombre: 'Cádiz', equipos: 16 },
        { slug: 'cordoba', nombre: 'Córdoba', equipos: 16 },
        { slug: 'granada', nombre: 'Granada', equipos: 16 },
        { slug: 'huelva', nombre: 'Huelva', equipos: 16 },
        { slug: 'jaen', nombre: 'Jaén', equipos: 16 },
        { slug: 'malaga', nombre: 'Málaga', equipos: 16 },
        { slug: 'sevilla', nombre: 'Sevilla', equipos: 16 },
      ],
      fechaInicio: 'Septiembre 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
    {
      slug: 'segunda-andaluza',
      logo: 'assets/images/competitions/medium/rfaf.webp',
      nombre: 'Segunda Andaluza',
      equipos: 192,
      grupos: [
        { slug: 'almeria', nombre: 'Almería', equipos: 16 },
        { slug: 'cadiz', nombre: 'Cádiz', equipos: 16 },
        { slug: 'cordoba', nombre: 'Córdoba', equipos: 16 },
        { slug: 'granada', nombre: 'Granada', equipos: 16 },
        { slug: 'huelva-1', nombre: 'Huelva 1', equipos: 16 },
        { slug: 'huelva-2', nombre: 'Huelva 2', equipos: 16 },
        { slug: 'jaen-1', nombre: 'Jaén 1', equipos: 16 },
        { slug: 'jaen-2', nombre: 'Jaén 2', equipos: 16 },
        { slug: 'jaen-3', nombre: 'Jaén 3', equipos: 16 },
        { slug: 'malaga', nombre: 'Málaga', equipos: 16 },
        { slug: 'sevilla-1', nombre: 'Sevilla 1', equipos: 16 },
        { slug: 'sevilla-2', nombre: 'Sevilla 2', equipos: 16 },
      ],
      fechaInicio: 'Septiembre 2025',
      fechaFin: 'Mayo 2026',
      categoria: 'senior',
    },
  ];

  obtenerTodas(): Observable<Competicion[]> {
    return of(this.competiciones).pipe(delay(100));
  }

  obtenerPorSlug(slug: string): Observable<Competicion | undefined> {
    const comp = this.competiciones.find((c) => c.slug === slug);
    return of(comp).pipe(delay(100));
  }

  obtenerGrupo(compSlug: string, grupoSlug: string): Observable<{ competicion: Competicion; grupo: Grupo } | undefined> {
    const comp = this.competiciones.find((c) => c.slug === compSlug);
    if (!comp || !comp.grupos) return of(undefined);

    const grupo = comp.grupos.find((g) => g.slug === grupoSlug);
    if (!grupo) return of(undefined);

    return of({ competicion: comp, grupo }).pipe(delay(100));
  }
}
