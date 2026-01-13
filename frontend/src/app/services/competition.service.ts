import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/services/api.service';
import { Competition } from '../core/models';

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
}
