/**
 * Estados de un partido
 */
export type MatchStatus = 'PROGRAMADO' | 'EN_CURSO' | 'FINALIZADO' | 'APLAZADO' | 'CANCELADO';

/**
 * Partido
 */
export interface Match {
  id: number;
  competicionId: number;
  competicionNombre: string;
  equipoLocalId: number;
  equipoLocalNombre: string;
  equipoLocalLogo: string | null;
  equipoVisitanteId: number;
  equipoVisitanteNombre: string;
  equipoVisitanteLogo: string | null;
  fechaHora: string;
  estadio: string | null;
  jornada: number | null;
  golesLocal: number | null;
  golesVisitante: number | null;
  estado: MatchStatus;
  asistencia: number | null;
  arbitro: string | null;
}

/**
 * DTO para crear un partido
 */
export interface CreateMatchDto {
  competicionId: number;
  equipoLocalId: number;
  equipoVisitanteId: number;
  fechaHora: string;
  estadio?: string;
  jornada?: number;
  estado?: MatchStatus;
  arbitro?: string;
}

/**
 * DTO para actualizar un partido
 */
export interface UpdateMatchDto extends Partial<CreateMatchDto> {
  golesLocal?: number;
  golesVisitante?: number;
  asistencia?: number;
}
