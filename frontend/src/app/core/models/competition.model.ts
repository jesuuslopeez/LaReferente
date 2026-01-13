export type CompetitionType = 'LIGA' | 'COPA';

export interface Competition {
  id: number;
  nombre: string;
  nombreCompleto: string | null;
  pais: string | null;
  tipo: CompetitionType;
  temporada: string;
  logoUrl: string | null;
  descripcion: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  activa: boolean;
}
