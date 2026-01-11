/**
 * Posiciones de jugador
 */
export type PlayerPosition = 'PORTERO' | 'DEFENSA' | 'CENTROCAMPISTA' | 'DELANTERO';

/**
 * Jugador
 */
export interface Player {
  id: number;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  edad: number;
  nacionalidad: string;
  posicion: PlayerPosition;
  dorsal: number | null;
  altura: number | null;
  peso: number | null;
  fotoUrl: string | null;
  biografia: string | null;
  equipoId: number | null;
  equipoNombre: string | null;
  activo: boolean;
}

/**
 * DTO para crear un jugador
 */
export interface CreatePlayerDto {
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  nacionalidad: string;
  posicion: PlayerPosition;
  dorsal?: number;
  altura?: number;
  peso?: number;
  fotoUrl?: string;
  biografia?: string;
  equipoId?: number;
  activo?: boolean;
}

/**
 * DTO para actualizar un jugador
 */
export interface UpdatePlayerDto extends Partial<CreatePlayerDto> {}
