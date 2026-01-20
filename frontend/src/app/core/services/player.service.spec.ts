import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { PlayerService } from './player.service';
import { Player, CreatePlayerDto } from '../models/player.model';

describe('PlayerService', () => {
  let service: PlayerService;
  let httpMock: HttpTestingController;

  const mockPlayer: Player = {
    id: 1,
    nombre: 'Lionel',
    apellidos: 'Messi',
    fechaNacimiento: '1987-06-24',
    edad: 36,
    nacionalidad: 'Argentina',
    posicion: 'DELANTERO',
    categoria: 'SENIOR',
    dorsal: 10,
    altura: 170,
    peso: 72,
    fotoUrl: 'https://example.com/messi.jpg',
    biografia: 'El mejor jugador',
    equipoId: 1,
    equipoNombre: 'Barcelona',
    activo: true
  };

  const mockPlayers: Player[] = [
    mockPlayer,
    {
      id: 2,
      nombre: 'Pedri',
      apellidos: 'Gonzalez',
      fechaNacimiento: '2002-11-25',
      edad: 21,
      nacionalidad: 'España',
      posicion: 'CENTROCAMPISTA',
      categoria: 'SENIOR',
      dorsal: 8,
      altura: 174,
      peso: 60,
      fotoUrl: null,
      biografia: null,
      equipoId: 1,
      equipoNombre: 'Barcelona',
      activo: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        PlayerService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(PlayerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll', () => {
    it('should return all players', () => {
      service.getAll().subscribe(players => {
        expect(players.length).toBe(2);
        expect(players).toEqual(mockPlayers);
      });

      const req = httpMock.expectOne('/api/players');
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);
    });
  });

  describe('getById', () => {
    it('should return a player by id', () => {
      service.getById(1).subscribe(player => {
        expect(player).toEqual(mockPlayer);
      });

      const req = httpMock.expectOne('/api/players/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayer);
    });
  });

  describe('getByTeam', () => {
    it('should return players by team id', () => {
      service.getByTeam(1).subscribe(players => {
        expect(players.length).toBe(2);
      });

      const req = httpMock.expectOne('/api/players/team/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);
    });
  });

  describe('getActive', () => {
    it('should return active players', () => {
      service.getActive().subscribe(players => {
        expect(players.length).toBe(2);
      });

      const req = httpMock.expectOne('/api/players/active');
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);
    });
  });

  describe('create', () => {
    it('should create a player', () => {
      const newPlayer: CreatePlayerDto = {
        nombre: 'Robert',
        apellidos: 'Lewandowski',
        fechaNacimiento: '1988-08-21',
        nacionalidad: 'Polonia',
        posicion: 'DELANTERO',
        categoria: 'SENIOR',
        dorsal: 9,
        equipoId: 1
      };
      const createdPlayer: Player = {
        id: 3,
        nombre: newPlayer.nombre,
        apellidos: newPlayer.apellidos,
        fechaNacimiento: newPlayer.fechaNacimiento,
        nacionalidad: newPlayer.nacionalidad,
        posicion: newPlayer.posicion,
        categoria: newPlayer.categoria,
        dorsal: newPlayer.dorsal ?? null,
        equipoId: newPlayer.equipoId ?? null,
        edad: 35,
        altura: null,
        peso: null,
        fotoUrl: null,
        biografia: null,
        equipoNombre: 'Barcelona',
        activo: true
      };

      service.create(newPlayer).subscribe(player => {
        expect(player.id).toBe(3);
        expect(player.nombre).toBe('Robert');
      });

      const req = httpMock.expectOne('/api/players');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPlayer);
      req.flush(createdPlayer);
    });
  });

  describe('update', () => {
    it('should update a player', () => {
      const updates = { dorsal: 30 };
      const updatedPlayer: Player = { ...mockPlayer, dorsal: 30 };

      service.update(1, updates).subscribe(player => {
        expect(player.dorsal).toBe(30);
      });

      const req = httpMock.expectOne('/api/players/1');
      expect(req.request.method).toBe('PUT');
      req.flush(updatedPlayer);
    });
  });

  describe('delete', () => {
    it('should delete a player', () => {
      service.delete(1).subscribe();

      const req = httpMock.expectOne('/api/players/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
