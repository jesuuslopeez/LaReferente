import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TeamService } from './team.service';
import { Team, CreateTeamDto } from '../models/team.model';

describe('TeamService', () => {
  let service: TeamService;
  let httpMock: HttpTestingController;

  const mockTeam: Team = {
    id: 1,
    nombre: 'Barcelona',
    nombreCompleto: 'Futbol Club Barcelona',
    ciudad: 'Barcelona',
    estadio: 'Camp Nou',
    fundacion: 1899,
    categoria: 'SENIOR',
    letra: 'A',
    pais: 'España',
    logoUrl: 'https://example.com/logo.png',
    descripcion: 'Club de futbol',
    activo: true
  };

  const mockTeams: Team[] = [
    mockTeam,
    {
      id: 2,
      nombre: 'Real Madrid',
      nombreCompleto: 'Real Madrid CF',
      ciudad: 'Madrid',
      estadio: 'Santiago Bernabeu',
      fundacion: 1902,
      categoria: 'SENIOR',
      letra: 'B',
      pais: 'España',
      logoUrl: 'https://example.com/logo2.png',
      descripcion: 'Otro club',
      activo: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        TeamService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(TeamService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll', () => {
    it('should return all teams', () => {
      service.getAll().subscribe(teams => {
        expect(teams.length).toBe(2);
        expect(teams).toEqual(mockTeams);
      });

      const req = httpMock.expectOne('/api/teams');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeams);
    });
  });

  describe('getById', () => {
    it('should return a team by id', () => {
      service.getById(1).subscribe(team => {
        expect(team).toEqual(mockTeam);
      });

      const req = httpMock.expectOne('/api/teams/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeam);
    });
  });

  describe('getActive', () => {
    it('should return active teams', () => {
      service.getActive().subscribe(teams => {
        expect(teams.length).toBe(2);
      });

      const req = httpMock.expectOne('/api/teams/active');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeams);
    });
  });

  describe('search', () => {
    it('should search teams by categoria', () => {
      service.search('SENIOR').subscribe(teams => {
        expect(teams.length).toBe(2);
      });

      const req = httpMock.expectOne('/api/teams/search?categoria=SENIOR');
      expect(req.request.method).toBe('GET');
      req.flush(mockTeams);
    });

    it('should search teams by categoria and nombre', () => {
      service.search('SENIOR', 'Bar').subscribe(teams => {
        expect(teams.length).toBe(1);
      });

      const req = httpMock.expectOne('/api/teams/search?categoria=SENIOR&nombre=Bar');
      expect(req.request.method).toBe('GET');
      req.flush([mockTeam]);
    });
  });

  describe('create', () => {
    it('should create a team', () => {
      const newTeam: CreateTeamDto = {
        nombre: 'Atletico Madrid',
        nombreCompleto: 'Club Atletico de Madrid',
        ciudad: 'Madrid',
        estadio: 'Metropolitano',
        fundacion: 1903,
        categoria: 'SENIOR',
        pais: 'España'
      };
      const createdTeam: Team = {
        id: 3,
        nombre: newTeam.nombre,
        nombreCompleto: newTeam.nombreCompleto || '',
        ciudad: newTeam.ciudad || '',
        estadio: newTeam.estadio || '',
        fundacion: newTeam.fundacion || 0,
        categoria: newTeam.categoria,
        pais: newTeam.pais,
        activo: true,
        letra: null,
        logoUrl: null,
        descripcion: null
      };

      service.create(newTeam).subscribe(team => {
        expect(team.id).toBe(3);
        expect(team.nombre).toBe('Atletico Madrid');
      });

      const req = httpMock.expectOne('/api/teams');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTeam);
      req.flush(createdTeam);
    });
  });

  describe('update', () => {
    it('should update a team', () => {
      const updates = { nombre: 'Barcelona Updated' };
      const updatedTeam: Team = { ...mockTeam, ...updates };

      service.update(1, updates).subscribe(team => {
        expect(team.nombre).toBe('Barcelona Updated');
      });

      const req = httpMock.expectOne('/api/teams/1');
      expect(req.request.method).toBe('PUT');
      req.flush(updatedTeam);
    });
  });

  describe('delete', () => {
    it('should delete a team', () => {
      service.delete(1).subscribe();

      const req = httpMock.expectOne('/api/teams/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
