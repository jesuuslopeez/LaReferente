import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { CompetitionService } from './competition.service';
import { Competition, CreateCompetitionDto } from '../core/models/competition.model';

describe('CompetitionService', () => {
  let service: CompetitionService;
  let httpMock: HttpTestingController;

  const mockCompetition: Competition = {
    id: 1,
    nombre: 'La Liga',
    nombreCompleto: 'La Liga Santander',
    tipo: 'LIGA',
    categoria: 'SENIOR',
    pais: 'España',
    numEquipos: 20,
    temporada: '2024-2025',
    logoUrl: 'https://example.com/laliga.png',
    descripcion: 'La liga española de fútbol',
    fechaInicio: '2024-08-15',
    fechaFin: '2025-05-31',
    activa: true
  };

  const mockCompetitions: Competition[] = [
    mockCompetition,
    {
      id: 2,
      nombre: 'Copa del Rey',
      nombreCompleto: 'Copa de Su Majestad el Rey',
      tipo: 'COPA',
      categoria: 'SENIOR',
      pais: 'España',
      numEquipos: 128,
      temporada: '2024-2025',
      logoUrl: null,
      descripcion: null,
      fechaInicio: '2024-10-01',
      fechaFin: '2025-04-15',
      activa: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        CompetitionService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CompetitionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('obtenerTodas', () => {
    it('should return all competitions', () => {
      service.obtenerTodas().subscribe(competitions => {
        expect(competitions.length).toBe(2);
        expect(competitions).toEqual(mockCompetitions);
      });

      const req = httpMock.expectOne('/api/competitions/active');
      expect(req.request.method).toBe('GET');
      req.flush(mockCompetitions);
    });
  });

  describe('obtenerPorId', () => {
    it('should return a competition by id', () => {
      service.obtenerPorId(1).subscribe(competition => {
        expect(competition).toEqual(mockCompetition);
      });

      const req = httpMock.expectOne('/api/competitions/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockCompetition);
    });
  });

  describe('create', () => {
    it('should create a competition', () => {
      const newCompetition: CreateCompetitionDto = {
        nombre: 'Supercopa',
        tipo: 'COPA',
        categoria: 'SENIOR',
        temporada: '2024-2025'
      };
      const createdCompetition: Competition = {
        id: 3,
        nombre: newCompetition.nombre,
        nombreCompleto: null,
        tipo: newCompetition.tipo,
        categoria: newCompetition.categoria,
        pais: null,
        numEquipos: null,
        temporada: newCompetition.temporada,
        logoUrl: null,
        descripcion: null,
        fechaInicio: null,
        fechaFin: null,
        activa: true
      };

      service.create(newCompetition).subscribe(competition => {
        expect(competition.id).toBe(3);
        expect(competition.nombre).toBe('Supercopa');
      });

      const req = httpMock.expectOne('/api/competitions');
      expect(req.request.method).toBe('POST');
      req.flush(createdCompetition);
    });
  });

  describe('update', () => {
    it('should update a competition', () => {
      const updates = { nombre: 'La Liga EA Sports' };
      const updatedCompetition: Competition = { ...mockCompetition, nombre: 'La Liga EA Sports' };

      service.update(1, updates).subscribe(competition => {
        expect(competition.nombre).toBe('La Liga EA Sports');
      });

      const req = httpMock.expectOne('/api/competitions/1');
      expect(req.request.method).toBe('PUT');
      req.flush(updatedCompetition);
    });
  });

  describe('delete', () => {
    it('should delete a competition', () => {
      service.delete(1).subscribe();

      const req = httpMock.expectOne('/api/competitions/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
