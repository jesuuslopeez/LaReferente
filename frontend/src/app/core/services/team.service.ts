import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Team, CreateTeamDto, UpdateTeamDto, AgeCategory } from '../models';

@Injectable({ providedIn: 'root' })
export class TeamService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'teams';

  /**
   * Obtener todos los equipos
   */
  getAll(): Observable<Team[]> {
    return this.api.get<Team[]>(this.endpoint);
  }

  /**
   * Obtener equipos activos
   */
  getActive(): Observable<Team[]> {
    return this.api.get<Team[]>(`${this.endpoint}/active`);
  }

  /**
   * Obtener un equipo por ID
   */
  getById(id: number): Observable<Team> {
    return this.api.get<Team>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear un nuevo equipo
   */
  create(dto: CreateTeamDto): Observable<Team> {
    return this.api.post<Team>(this.endpoint, dto);
  }

  /**
   * Actualizar un equipo
   */
  update(id: number, dto: UpdateTeamDto): Observable<Team> {
    return this.api.put<Team>(`${this.endpoint}/${id}`, dto);
  }

  /**
   * Eliminar un equipo
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Buscar equipos por nombre y categoría
   */
  search(categoria: AgeCategory, nombre?: string): Observable<Team[]> {
    const params = nombre ? `?categoria=${categoria}&nombre=${encodeURIComponent(nombre)}` : `?categoria=${categoria}`;
    return this.api.get<Team[]>(`${this.endpoint}/search${params}`);
  }
}
