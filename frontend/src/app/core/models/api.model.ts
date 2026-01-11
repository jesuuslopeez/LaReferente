/**
 * Respuesta paginada genérica
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Estado de una petición HTTP
 */
export interface RequestState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

/**
 * Error de API
 */
export interface ApiError {
  status: number;
  message: string;
  original?: unknown;
}
