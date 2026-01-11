/**
 * Comentario de noticia
 */
export interface Comment {
  id: number;
  contenido: string;
  noticiaId: number;
  usuarioId: number;
  usuarioNombre: string;
  aprobado: boolean;
  fechaCreacion: string;
}

/**
 * DTO para crear un comentario
 */
export interface CreateCommentDto {
  contenido: string;
  noticiaId: number;
  usuarioId: number;
}
