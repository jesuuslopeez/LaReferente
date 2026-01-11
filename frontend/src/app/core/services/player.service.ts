import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Player, CreatePlayerDto, UpdatePlayerDto } from '../models';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'players';

  /**
   * Obtener todos los jugadores
   */
  getAll(): Observable<Player[]> {
    return this.api.get<Player[]>(this.endpoint);
  }

  /**
   * Obtener jugadores activos
   */
  getActive(): Observable<Player[]> {
    return this.api.get<Player[]>(`${this.endpoint}/active`);
  }

  /**
   * Obtener jugadores por equipo
   */
  getByTeam(teamId: number): Observable<Player[]> {
    return this.api.get<Player[]>(`${this.endpoint}/team/${teamId}`);
  }

  /**
   * Obtener un jugador por ID
   */
  getById(id: number): Observable<Player> {
    return this.api.get<Player>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear un nuevo jugador
   */
  create(dto: CreatePlayerDto): Observable<Player> {
    return this.api.post<Player>(this.endpoint, dto);
  }

  /**
   * Actualizar un jugador
   */
  update(id: number, dto: UpdatePlayerDto): Observable<Player> {
    return this.api.put<Player>(`${this.endpoint}/${id}`, dto);
  }

  /**
   * Eliminar un jugador
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
