import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Match, CreateMatchDto, UpdateMatchDto } from '../models';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'matches';

  /**
   * Obtener todos los partidos
   */
  getAll(): Observable<Match[]> {
    return this.api.get<Match[]>(this.endpoint);
  }

  /**
   * Obtener próximos partidos
   */
  getUpcoming(): Observable<Match[]> {
    return this.api.get<Match[]>(`${this.endpoint}/upcoming`);
  }

  /**
   * Obtener partidos por competición
   */
  getByCompetition(competitionId: number): Observable<Match[]> {
    return this.api.get<Match[]>(`${this.endpoint}/competition/${competitionId}`);
  }

  /**
   * Obtener un partido por ID
   */
  getById(id: number): Observable<Match> {
    return this.api.get<Match>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear un nuevo partido
   */
  create(dto: CreateMatchDto): Observable<Match> {
    return this.api.post<Match>(this.endpoint, dto);
  }

  /**
   * Actualizar un partido
   */
  update(id: number, dto: UpdateMatchDto): Observable<Match> {
    return this.api.put<Match>(`${this.endpoint}/${id}`, dto);
  }

  /**
   * Eliminar un partido
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
