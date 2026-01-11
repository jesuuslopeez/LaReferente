/**
 * Equipo
 */
export interface Team {
  id: number;
  nombre: string;
  nombreCompleto: string;
  pais: string;
  ciudad: string;
  estadio: string;
  fundacion: number;
  logoUrl: string | null;
  descripcion: string | null;
  activo: boolean;
}

/**
 * DTO para crear un equipo
 */
export interface CreateTeamDto {
  nombre: string;
  nombreCompleto?: string;
  pais: string;
  ciudad?: string;
  estadio?: string;
  fundacion?: number;
  logoUrl?: string;
  descripcion?: string;
  activo?: boolean;
}

/**
 * DTO para actualizar un equipo
 */
export interface UpdateTeamDto extends Partial<CreateTeamDto> {}
