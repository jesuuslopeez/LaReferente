import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TeamService } from '../../core/services/team.service';
import { PlayerService } from '../../core/services/player.service';
import { Team, CreateTeamDto } from '../../core/models/team.model';
import { Player, CreatePlayerDto } from '../../core/models/player.model';

/**
 * Tests de integración del flujo de equipos y jugadores
 * Prueba la relación entre equipos y sus jugadores
 */
describe('Team and Players Flow Integration', () => {
  let teamService: TeamService;
  let playerService: PlayerService;
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
    logoUrl: 'https://example.com/barca.png',
    descripcion: 'Club de fútbol catalán',
    activo: true
  };

  const mockPlayers: Player[] = [
    {
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
    },
    {
      id: 2,
      nombre: 'Pedri',
      apellidos: 'González',
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
        TeamService,
        PlayerService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    teamService = TestBed.inject(TeamService);
    playerService = TestBed.inject(PlayerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Flujo de Detalle de Equipo', () => {
    it('debe obtener equipo y sus jugadores', () => {
      let team: Team | undefined;
      let players: Player[] = [];

      // 1. Obtener equipo
      teamService.getById(1).subscribe(t => {
        team = t;
      });

      const teamReq = httpMock.expectOne('/api/teams/1');
      teamReq.flush(mockTeam);

      expect(team?.nombre).toBe('Barcelona');

      // 2. Obtener jugadores del equipo
      playerService.getByTeam(1).subscribe(p => {
        players = p;
      });

      const playersReq = httpMock.expectOne('/api/players/team/1');
      playersReq.flush(mockPlayers);

      expect(players.length).toBe(2);
      expect(players.every(p => p.equipoId === 1)).toBe(true);
    });
  });

  describe('Flujo de Búsqueda de Equipos', () => {
    it('debe buscar equipos por categoría', () => {
      const seniorTeams: Team[] = [
        mockTeam,
        { ...mockTeam, id: 2, nombre: 'Real Madrid' }
      ];

      let resultado: Team[] = [];

      teamService.search('SENIOR').subscribe(teams => {
        resultado = teams;
      });

      const req = httpMock.expectOne('/api/teams/search?categoria=SENIOR');
      expect(req.request.method).toBe('GET');
      req.flush(seniorTeams);

      expect(resultado.length).toBe(2);
    });

    it('debe buscar equipos por categoría y nombre', () => {
      let resultado: Team[] = [];

      teamService.search('SENIOR', 'Barc').subscribe(teams => {
        resultado = teams;
      });

      const req = httpMock.expectOne('/api/teams/search?categoria=SENIOR&nombre=Barc');
      req.flush([mockTeam]);

      expect(resultado.length).toBe(1);
      expect(resultado[0].nombre).toContain('Barcelona');
    });
  });

  describe('Flujo de Equipos Activos', () => {
    it('debe obtener solo equipos activos', () => {
      const activeTeams: Team[] = [mockTeam];
      let resultado: Team[] = [];

      teamService.getActive().subscribe(teams => {
        resultado = teams;
      });

      const req = httpMock.expectOne('/api/teams/active');
      req.flush(activeTeams);

      expect(resultado.every(t => t.activo)).toBe(true);
    });
  });

  describe('Flujo de Creación de Equipo', () => {
    it('debe crear equipo con datos mínimos', () => {
      const newTeam: CreateTeamDto = {
        nombre: 'Nuevo Equipo',
        nombreCompleto: 'Club Deportivo Nuevo Equipo',
        ciudad: 'Madrid',
        categoria: 'JUVENIL',
        pais: 'España'
      };

      const createdTeam: Team = {
        id: 3,
        nombre: newTeam.nombre,
        nombreCompleto: newTeam.nombreCompleto || '',
        ciudad: newTeam.ciudad || '',
        estadio: '',
        fundacion: 0,
        categoria: newTeam.categoria,
        letra: null,
        pais: newTeam.pais,
        logoUrl: null,
        descripcion: null,
        activo: true
      };

      let resultado: Team | undefined;

      teamService.create(newTeam).subscribe(team => {
        resultado = team;
      });

      const req = httpMock.expectOne('/api/teams');
      expect(req.request.method).toBe('POST');
      req.flush(createdTeam);

      expect(resultado?.id).toBe(3);
      expect(resultado?.nombre).toBe('Nuevo Equipo');
      expect(resultado?.activo).toBe(true);
    });
  });

  describe('Flujo de Jugadores por Posición', () => {
    it('debe filtrar jugadores del equipo por posición', () => {
      let players: Player[] = [];

      playerService.getByTeam(1).subscribe(p => {
        players = p;
      });

      httpMock.expectOne('/api/players/team/1').flush(mockPlayers);

      // Filtrar delanteros (simulando lógica del componente)
      const delanteros = players.filter(p => p.posicion === 'DELANTERO');
      expect(delanteros.length).toBe(1);
      expect(delanteros[0].nombre).toBe('Lionel');

      // Filtrar centrocampistas
      const centrocampistas = players.filter(p => p.posicion === 'CENTROCAMPISTA');
      expect(centrocampistas.length).toBe(1);
      expect(centrocampistas[0].nombre).toBe('Pedri');
    });
  });

  describe('Flujo de Actualización de Equipo', () => {
    it('debe actualizar datos del equipo', () => {
      const updates = {
        estadio: 'Spotify Camp Nou',
        descripcion: 'Descripción actualizada'
      };

      const updatedTeam: Team = {
        ...mockTeam,
        estadio: 'Spotify Camp Nou',
        descripcion: 'Descripción actualizada'
      };

      let resultado: Team | undefined;

      teamService.update(1, updates).subscribe(team => {
        resultado = team;
      });

      const req = httpMock.expectOne('/api/teams/1');
      expect(req.request.method).toBe('PUT');
      req.flush(updatedTeam);

      expect(resultado?.estadio).toBe('Spotify Camp Nou');
      expect(resultado?.descripcion).toBe('Descripción actualizada');
    });
  });

  describe('Flujo Completo: Crear Equipo y Añadir Jugador', () => {
    it('debe crear equipo y luego añadir jugador al equipo', () => {
      // 1. Crear equipo
      const newTeam: CreateTeamDto = {
        nombre: 'Equipo Test',
        categoria: 'CADETE',
        pais: 'España'
      };

      const createdTeam: Team = {
        id: 5,
        nombre: 'Equipo Test',
        nombreCompleto: '',
        ciudad: '',
        estadio: '',
        fundacion: 0,
        categoria: 'CADETE',
        letra: null,
        pais: 'España',
        logoUrl: null,
        descripcion: null,
        activo: true
      };

      let teamId = 0;

      teamService.create(newTeam).subscribe(team => {
        teamId = team.id;
      });

      httpMock.expectOne('/api/teams').flush(createdTeam);
      expect(teamId).toBe(5);

      // 2. Crear jugador asignado al equipo
      const newPlayer: CreatePlayerDto = {
        nombre: 'Jugador',
        apellidos: 'Test',
        fechaNacimiento: '2010-01-15',
        nacionalidad: 'España',
        posicion: 'DEFENSA',
        categoria: 'CADETE',
        equipoId: 5
      };

      const createdPlayer: Player = {
        id: 10,
        nombre: 'Jugador',
        apellidos: 'Test',
        fechaNacimiento: '2010-01-15',
        edad: 14,
        nacionalidad: 'España',
        posicion: 'DEFENSA',
        categoria: 'CADETE',
        dorsal: null,
        altura: null,
        peso: null,
        fotoUrl: null,
        biografia: null,
        equipoId: 5,
        equipoNombre: 'Equipo Test',
        activo: true
      };

      let playerId = 0;

      playerService.create(newPlayer).subscribe(player => {
        playerId = player.id;
      });

      httpMock.expectOne('/api/players').flush(createdPlayer);
      expect(playerId).toBe(10);
      expect(createdPlayer.equipoId).toBe(5);

      // 3. Verificar que el jugador aparece en el equipo
      let teamPlayers: Player[] = [];

      playerService.getByTeam(5).subscribe(players => {
        teamPlayers = players;
      });

      httpMock.expectOne('/api/players/team/5').flush([createdPlayer]);
      expect(teamPlayers.length).toBe(1);
      expect(teamPlayers[0].equipoNombre).toBe('Equipo Test');
    });
  });
});
