import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { News, CreateNewsDto, UpdateNewsDto } from '../models';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'news';

  /**
   * Obtener todas las noticias
   */
  getAll(): Observable<News[]> {
    return this.api.get<News[]>(this.endpoint);
  }

  /**
   * Obtener noticias publicadas
   */
  getPublished(): Observable<News[]> {
    return this.api.get<News[]>(`${this.endpoint}/published`);
  }

  /**
   * Obtener noticias destacadas
   */
  getFeatured(): Observable<News[]> {
    return this.api.get<News[]>(`${this.endpoint}/featured`);
  }

  /**
   * Obtener una noticia por ID
   */
  getById(id: number): Observable<News> {
    return this.api.get<News>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear una nueva noticia
   */
  create(dto: CreateNewsDto): Observable<News> {
    return this.api.post<News>(this.endpoint, dto);
  }

  /**
   * Actualizar una noticia
   */
  update(id: number, dto: UpdateNewsDto): Observable<News> {
    return this.api.put<News>(`${this.endpoint}/${id}`, dto);
  }

  /**
   * Eliminar una noticia
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  /**
   * Incrementar visitas de una noticia
   */
  incrementViews(id: number): Observable<void> {
    return this.api.post<void>(`${this.endpoint}/${id}/view`, {});
  }

  /**
   * Obtener noticias con transformación para la vista
   * Ejemplo de uso de map para adaptar datos
   */
  getPublishedForView(): Observable<News[]> {
    return this.getPublished().pipe(
      map(noticias => noticias.map(n => ({
        ...n,
        fechaPublicacion: n.fechaPublicacion ? new Date(n.fechaPublicacion).toLocaleDateString('es-ES') : null
      })))
    );
  }
}
