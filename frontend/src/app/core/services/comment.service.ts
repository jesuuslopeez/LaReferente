import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Comment, CreateCommentDto } from '../models';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'comments';

  /**
   * Obtener comentarios aprobados de una noticia
   */
  getByNews(newsId: number): Observable<Comment[]> {
    return this.api.get<Comment[]>(`${this.endpoint}/news/${newsId}`);
  }

  /**
   * Obtener todos los comentarios de una noticia (incluye no aprobados)
   */
  getAllByNews(newsId: number): Observable<Comment[]> {
    return this.api.get<Comment[]>(`${this.endpoint}/news/${newsId}/all`);
  }

  /**
   * Obtener comentarios pendientes de aprobación
   */
  getPending(): Observable<Comment[]> {
    return this.api.get<Comment[]>(`${this.endpoint}/pending`);
  }

  /**
   * Obtener un comentario por ID
   */
  getById(id: number): Observable<Comment> {
    return this.api.get<Comment>(`${this.endpoint}/${id}`);
  }

  /**
   * Crear un nuevo comentario
   */
  create(dto: CreateCommentDto): Observable<Comment> {
    return this.api.post<Comment>(this.endpoint, dto);
  }

  /**
   * Aprobar un comentario
   */
  approve(id: number): Observable<Comment> {
    return this.api.patch<Comment>(`${this.endpoint}/${id}/approve`, {});
  }

  /**
   * Eliminar un comentario
   */
  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
