import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Competition, CreateCompetitionDto, UpdateCompetitionDto, Team } from '../core/models';

@Injectable({
  providedIn: 'root',
})
export class CompetitionService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'competitions';

  obtenerTodas(): Observable<Competition[]> {
    return this.api.get<Competition[]>(`${this.endpoint}/active`);
  }

  obtenerPorId(id: number): Observable<Competition> {
    return this.api.get<Competition>(`${this.endpoint}/${id}`);
  }

  create(dto: CreateCompetitionDto): Observable<Competition> {
    return this.api.post<Competition>(this.endpoint, dto);
  }

  update(id: number, dto: UpdateCompetitionDto): Observable<Competition> {
    return this.api.put<Competition>(`${this.endpoint}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  obtenerEquipos(id: number): Observable<Team[]> {
    return this.api.get<Team[]>(`${this.endpoint}/${id}/teams`);
  }
}
