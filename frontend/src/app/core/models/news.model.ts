/**
 * Categorías de noticias
 */
export type NewsCategory = 'FICHAJES' | 'PARTIDOS' | 'LESIONES' | 'RUEDAS_PRENSA' | 'GENERAL';

/**
 * Noticia
 */
export interface News {
  id: number;
  titulo: string;
  subtitulo: string;
  contenido: string;
  imagenPrincipalUrl: string | null;
  autorId: number;
  autorNombre: string;
  categoria: NewsCategory;
  destacada: boolean;
  publicada: boolean;
  fechaPublicacion: string | null;
  visitas: number;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

/**
 * DTO para crear una noticia
 */
export interface CreateNewsDto {
  titulo: string;
  subtitulo?: string;
  contenido: string;
  imagenPrincipalUrl?: string;
  autorId: number;
  categoria: NewsCategory;
  destacada?: boolean;
  publicada?: boolean;
}

/**
 * DTO para actualizar una noticia
 */
export interface UpdateNewsDto extends Partial<CreateNewsDto> {}
