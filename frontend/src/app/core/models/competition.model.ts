export type CompetitionType = 'LIGA' | 'COPA';

export type AgeCategory = 'SENIOR' | 'JUVENIL' | 'CADETE' | 'INFANTIL' | 'ALEVIN' | 'BENJAMIN' | 'PREBENJAMIN';

export interface Competition {
  id: number;
  nombre: string;
  nombreCompleto: string | null;
  pais: string | null;
  tipo: CompetitionType;
  categoria: AgeCategory;
  numEquipos: number | null;
  temporada: string;
  logoUrl: string | null;
  descripcion: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  activa: boolean;
}

export interface CreateCompetitionDto {
  nombre: string;
  nombreCompleto?: string;
  pais?: string;
  tipo: CompetitionType;
  categoria: AgeCategory;
  numEquipos?: number;
  temporada: string;
  logoUrl?: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  activa?: boolean;
}

export interface UpdateCompetitionDto extends Partial<CreateCompetitionDto> {}
