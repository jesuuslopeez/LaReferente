package lareferente.backend.config;

import lareferente.backend.enums.CompetitionType;
import lareferente.backend.enums.MatchStatus;
import lareferente.backend.enums.NewsCategory;
import lareferente.backend.enums.PlayerPosition;
import lareferente.backend.enums.UserRole;
import lareferente.backend.model.Competition;
import lareferente.backend.model.Match;
import lareferente.backend.model.News;
import lareferente.backend.model.Player;
import lareferente.backend.model.Team;
import lareferente.backend.model.User;
import lareferente.backend.repository.CompetitionRepository;
import lareferente.backend.repository.MatchRepository;
import lareferente.backend.repository.NewsRepository;
import lareferente.backend.repository.PlayerRepository;
import lareferente.backend.repository.TeamRepository;
import lareferente.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test")
public class DataLoader implements CommandLineRunner {

    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final CompetitionRepository competitionRepository;
    private final UserRepository userRepository;
    private final NewsRepository newsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (teamRepository.count() == 0) {
            log.info("Cargando datos iniciales...");
            loadUsers();
            loadCompetitions();
            loadTeams();
            loadPlayers();
            loadMatches();
            loadNews();
            log.info("Datos iniciales cargados correctamente");
        } else {
            log.info("Base de datos ya contiene datos, omitiendo carga inicial");
        }
    }

    private void loadUsers() {
        User admin = new User();
        admin.setEmail("admin@lareferente.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setNombre("Administrador");
        admin.setApellidos("La Referente");
        admin.setRol(UserRole.ADMIN);
        admin.setActivo(true);
        userRepository.save(admin);

        User editor = new User();
        editor.setEmail("editor@lareferente.com");
        editor.setPassword(passwordEncoder.encode("editor123"));
        editor.setNombre("Editor");
        editor.setApellidos("Principal");
        editor.setRol(UserRole.EDITOR);
        editor.setActivo(true);
        userRepository.save(editor);

        log.info("Cargados 2 usuarios");
    }

    private void loadCompetitions() {
        List<Competition> competitions = List.of(
            createCompetition("LaLiga", "LaLiga EA Sports", "España", CompetitionType.LIGA, "2025-2026", "2025-08-15", "2026-05-24"),
            createCompetition("Segunda RFEF G4", "Segunda RFEF Grupo IV", "España", CompetitionType.LIGA, "2025-2026", "2025-09-07", "2026-05-02"),
            createCompetition("Copa del Rey", "Copa de S.M. El Rey", "España", CompetitionType.COPA, "2025-2026", "2025-10-01", "2026-04-26"),
            createCompetition("LaLiga Hypermotion", "LaLiga Hypermotion", "España", CompetitionType.LIGA, "2025-2026", "2025-08-16", "2026-05-31")
        );
        List<Competition> saved = competitionRepository.saveAll(competitions);
        // Actualizar URLs con IDs generados
        saved.forEach(c -> c.setLogoUrl("assets/images/competitions/medium/" + c.getId() + ".webp"));
        competitionRepository.saveAll(saved);
        log.info("Cargadas {} competiciones", saved.size());
    }

    private Competition createCompetition(String nombre, String nombreCompleto, String pais,
                                           CompetitionType tipo, String temporada, String fechaInicio, String fechaFin) {
        Competition competition = new Competition();
        competition.setNombre(nombre);
        competition.setNombreCompleto(nombreCompleto);
        competition.setPais(pais);
        competition.setTipo(tipo);
        competition.setTemporada(temporada);
        competition.setFechaInicio(LocalDate.parse(fechaInicio));
        competition.setFechaFin(LocalDate.parse(fechaFin));
        competition.setActiva(true);
        return competition;
    }

    private void loadTeams() {
        // Obtener competiciones para asignar
        List<Competition> competitions = competitionRepository.findAll();
        Competition laliga = competitions.stream()
            .filter(c -> c.getNombre().equals("LaLiga"))
            .findFirst().orElse(null);
        Competition segundaDiv = competitions.stream()
            .filter(c -> c.getNombre().equals("LaLiga Hypermotion"))
            .findFirst().orElse(null);
        Competition copaDelRey = competitions.stream()
            .filter(c -> c.getNombre().equals("Copa del Rey"))
            .findFirst().orElse(null);
        Competition segundaRfef = competitions.stream()
            .filter(c -> c.getNombre().equals("Segunda RFEF G4"))
            .findFirst().orElse(null);

        // Equipos de Primera División
        List<String> equiposPrimera = List.of(
            "Real Madrid", "Barcelona", "Atlético Madrid", "Sevilla", "Real Betis", "Valencia",
            "Athletic Club", "Real Sociedad", "Villarreal", "Getafe", "Celta", "Osasuna",
            "Espanyol", "Girona", "Rayo Vallecano", "Mallorca", "Alavés", "Levante",
            "Real Oviedo", "Elche"
        );

        // Equipos de Segunda División
        List<String> equiposSegunda = List.of(
            "Racing Santander", "Castellón", "Las Palmas", "Deportivo", "Almería", "Málaga",
            "Burgos", "Cádiz", "Sporting Gijón", "Córdoba", "Ceuta", "Valladolid",
            "Andorra", "Albacete", "Leganés", "Eibar", "Cultural Leonesa", "Real Sociedad B",
            "Granada", "Huesca", "Zaragoza", "Mirandés"
        );

        List<Team> teams = List.of(
            // Primera División
            createTeam("Real Madrid", "Real Madrid Club de Fútbol", "España", "Madrid", "Santiago Bernabéu", 1902),
            createTeam("Barcelona", "Fútbol Club Barcelona", "España", "Barcelona", "Spotify Camp Nou", 1899),
            createTeam("Atlético Madrid", "Club Atlético de Madrid", "España", "Madrid", "Cívitas Metropolitano", 1903),
            createTeam("Sevilla", "Sevilla Fútbol Club", "España", "Sevilla", "Ramón Sánchez-Pizjuán", 1890),
            createTeam("Real Betis", "Real Betis Balompié", "España", "Sevilla", "Benito Villamarín", 1907),
            createTeam("Valencia", "Valencia Club de Fútbol", "España", "Valencia", "Mestalla", 1919),
            createTeam("Athletic Club", "Athletic Club de Bilbao", "España", "Bilbao", "San Mamés", 1898),
            createTeam("Real Sociedad", "Real Sociedad de Fútbol", "España", "San Sebastián", "Reale Arena", 1909),
            createTeam("Villarreal", "Villarreal Club de Fútbol", "España", "Villarreal", "Estadio de la Cerámica", 1923),
            createTeam("Getafe", "Getafe Club de Fútbol", "España", "Getafe", "Coliseum Alfonso Pérez", 1983),
            createTeam("Celta", "Real Club Celta de Vigo", "España", "Vigo", "Abanca-Balaídos", 1923),
            createTeam("Osasuna", "Club Atlético Osasuna", "España", "Pamplona", "El Sadar", 1920),
            createTeam("Espanyol", "Reial Club Deportiu Espanyol", "España", "Barcelona", "RCDE Stadium", 1900),
            createTeam("Girona", "Girona Fútbol Club", "España", "Girona", "Estadi Montilivi", 1930),
            createTeam("Rayo Vallecano", "Rayo Vallecano de Madrid", "España", "Madrid", "Campo de Fútbol de Vallecas", 1924),
            createTeam("Mallorca", "Real Club Deportivo Mallorca", "España", "Palma de Mallorca", "Visit Mallorca Estadi", 1916),
            createTeam("Alavés", "Deportivo Alavés", "España", "Vitoria-Gasteiz", "Mendizorrotza", 1921),
            createTeam("Levante", "Levante Unión Deportiva", "España", "Valencia", "Estadi Ciutat de València", 1909),
            createTeam("Real Oviedo", "Real Oviedo Club de Fútbol", "España", "Oviedo", "Carlos Tartiere", 1926),
            createTeam("Elche", "Elche Club de Fútbol", "España", "Elche", "Estadio Martínez Valero", 1923),

            // Segunda División
            createTeam("Racing Santander", "Real Racing Club de Santander", "España", "Santander", "El Sardinero", 1913),
            createTeam("Castellón", "Club Deportivo Castellón", "España", "Castellón de la Plana", "Nou Castalia", 1922),
            createTeam("Las Palmas", "Unión Deportiva Las Palmas", "España", "Las Palmas de Gran Canaria", "Estadio Gran Canaria", 1949),
            createTeam("Deportivo", "Real Club Deportivo de La Coruña", "España", "La Coruña", "Riazor", 1906),
            createTeam("Almería", "Unión Deportiva Almería", "España", "Almería", "Power Horse Stadium", 1989),
            createTeam("Málaga", "Málaga Club de Fútbol", "España", "Málaga", "La Rosaleda", 1994),
            createTeam("Burgos", "Burgos Club de Fútbol", "España", "Burgos", "El Plantío", 1922),
            createTeam("Cádiz", "Cádiz Club de Fútbol", "España", "Cádiz", "Nuevo Mirandilla", 1910),
            createTeam("Sporting Gijón", "Real Sporting de Gijón", "España", "Gijón", "El Molinón", 1905),
            createTeam("Córdoba", "Córdoba Club de Fútbol", "España", "Córdoba", "El Arcángel", 1954),
            createTeam("Ceuta", "Asociación Deportiva Ceuta", "España", "Ceuta", "Alfonso Murube", 1956),
            createTeam("Valladolid", "Real Valladolid Club de Fútbol", "España", "Valladolid", "José Zorrilla", 1928),
            createTeam("Andorra", "Fútbol Club Andorra", "España", "Andorra la Vella", "Estadi Nacional", 1942),
            createTeam("Albacete", "Albacete Balompié", "España", "Albacete", "Carlos Belmonte", 1940),
            createTeam("Leganés", "Club Deportivo Leganés", "España", "Leganés", "Butarque", 1928),
            createTeam("Eibar", "Sociedad Deportiva Eibar", "España", "Eibar", "Ipurua", 1940),
            createTeam("Cultural Leonesa", "Cultural y Deportiva Leonesa", "España", "León", "Reino de León", 1923),
            createTeam("Real Sociedad B", "Real Sociedad de Fútbol B", "España", "San Sebastián", "Zubieta", 1909),
            createTeam("Granada", "Granada Club de Fútbol", "España", "Granada", "Nuevo Los Cármenes", 1931),
            createTeam("Huesca", "Sociedad Deportiva Huesca", "España", "Huesca", "El Alcoraz", 1960),
            createTeam("Zaragoza", "Real Zaragoza", "España", "Zaragoza", "La Romareda", 1932),
            createTeam("Mirandés", "Club Deportivo Mirandés", "España", "Miranda de Ebro", "Anduva", 1927),

            // Segunda RFEF
            createTeam("Xerez", "Xerez Club Deportivo", "España", "Jerez de la Frontera", "Municipal de Chapín", 1947)
        );
        List<Team> saved = teamRepository.saveAll(teams);

        // Asignar competiciones según la división
        for (Team team : saved) {
            team.setLogoUrl("assets/images/teams/medium/" + team.getId() + ".webp");
            Set<Competition> competiciones = new HashSet<>();

            if (team.getNombre().equals("Xerez")) {
                // Segunda RFEF
                if (segundaRfef != null) {
                    competiciones.add(segundaRfef);
                }
            } else if (equiposPrimera.contains(team.getNombre())) {
                // Primera División + Copa del Rey
                if (laliga != null) {
                    competiciones.add(laliga);
                }
                if (copaDelRey != null) {
                    competiciones.add(copaDelRey);
                }
            } else if (equiposSegunda.contains(team.getNombre())) {
                // Segunda División + Copa del Rey
                if (segundaDiv != null) {
                    competiciones.add(segundaDiv);
                }
                if (copaDelRey != null) {
                    competiciones.add(copaDelRey);
                }
            }
            team.setCompeticiones(competiciones);
        }
        teamRepository.saveAll(saved);
        log.info("Cargados {} equipos", saved.size());
    }

    private Team createTeam(String nombre, String nombreCompleto, String pais, String ciudad, String estadio, int fundacion) {
        Team team = new Team();
        team.setNombre(nombre);
        team.setNombreCompleto(nombreCompleto);
        team.setPais(pais);
        team.setCiudad(ciudad);
        team.setEstadio(estadio);
        team.setFundacion(fundacion);
        team.setActivo(true);
        return team;
    }

    private void loadPlayers() {
        List<Team> teams = teamRepository.findAll();
        if (teams.isEmpty()) return;

        Team realMadrid = teams.stream().filter(t -> t.getNombre().equals("Real Madrid")).findFirst().orElse(null);
        Team barcelona = teams.stream().filter(t -> t.getNombre().equals("Barcelona")).findFirst().orElse(null);
        Team atletico = teams.stream().filter(t -> t.getNombre().equals("Atlético Madrid")).findFirst().orElse(null);
        Team sevilla = teams.stream().filter(t -> t.getNombre().equals("Sevilla")).findFirst().orElse(null);
        Team betis = teams.stream().filter(t -> t.getNombre().equals("Real Betis")).findFirst().orElse(null);
        Team valencia = teams.stream().filter(t -> t.getNombre().equals("Valencia")).findFirst().orElse(null);
        Team athletic = teams.stream().filter(t -> t.getNombre().equals("Athletic Club")).findFirst().orElse(null);
        Team realSociedad = teams.stream().filter(t -> t.getNombre().equals("Real Sociedad")).findFirst().orElse(null);
        Team xerez = teams.stream().filter(t -> t.getNombre().equals("Xerez")).findFirst().orElse(null);
        Team osasuna = teams.stream().filter(t -> t.getNombre().equals("Osasuna")).findFirst().orElse(null);
        Team villarreal = teams.stream().filter(t -> t.getNombre().equals("Villarreal")).findFirst().orElse(null);

        List<Player> players = List.of(
            // ==================== JUGADORES ORIGINALES (mantener IDs 1-26) ====================
            // Real Madrid (IDs 1-6)
            createPlayer("Thibaut", "Courtois", "1992-05-11", "Bélgica", PlayerPosition.PORTERO, 1, 199, 96, realMadrid),
            createPlayer("Dani", "Carvajal", "1992-01-11", "España", PlayerPosition.DEFENSA, 2, 173, 73, realMadrid),
            createPlayer("Antonio", "Rüdiger", "1993-03-03", "Alemania", PlayerPosition.DEFENSA, 22, 190, 85, realMadrid),
            createPlayer("Jude", "Bellingham", "2003-06-29", "Inglaterra", PlayerPosition.CENTROCAMPISTA, 5, 186, 75, realMadrid),
            createPlayer("Vinícius", "Júnior", "2000-07-12", "Brasil", PlayerPosition.DELANTERO, 7, 176, 73, realMadrid),
            createPlayer("Kylian", "Mbappé", "1998-12-20", "Francia", PlayerPosition.DELANTERO, 9, 178, 75, realMadrid),
            // Barcelona (IDs 7-12)
            createPlayer("Marc-André", "ter Stegen", "1992-04-30", "Alemania", PlayerPosition.PORTERO, 1, 187, 85, barcelona),
            createPlayer("Ronald", "Araújo", "1999-03-07", "Uruguay", PlayerPosition.DEFENSA, 4, 188, 81, barcelona),
            createPlayer("Pedri", "González", "2002-11-25", "España", PlayerPosition.CENTROCAMPISTA, 8, 174, 60, barcelona),
            createPlayer("Gavi", "Páez", "2004-08-05", "España", PlayerPosition.CENTROCAMPISTA, 6, 173, 68, barcelona),
            createPlayer("Lamine", "Yamal", "2007-07-13", "España", PlayerPosition.DELANTERO, 10, 180, 68, barcelona),
            createPlayer("Robert", "Lewandowski", "1988-08-21", "Polonia", PlayerPosition.DELANTERO, 9, 185, 81, barcelona),
            // Atlético Madrid (IDs 13-16)
            createPlayer("Jan", "Oblak", "1993-01-07", "Eslovenia", PlayerPosition.PORTERO, 13, 188, 87, atletico),
            createPlayer("José María", "Giménez", "1995-01-20", "Uruguay", PlayerPosition.DEFENSA, 2, 185, 80, atletico),
            createPlayer("Koke", "Resurrección", "1992-01-08", "España", PlayerPosition.CENTROCAMPISTA, 6, 176, 71, atletico),
            createPlayer("Antoine", "Griezmann", "1991-03-21", "Francia", PlayerPosition.CENTROCAMPISTA, 7, 176, 73, atletico),
            // Real Betis (IDs 17-18)
            createPlayer("Antony", "dos Santos", "2000-02-24", "Brasil", PlayerPosition.DELANTERO, 7, 174, 63, betis),
            createPlayer("Isco", "Alarcón", "1992-04-21", "España", PlayerPosition.CENTROCAMPISTA, 22, 176, 76, betis),
            // Valencia (ID 19)
            createPlayer("Hugo", "Duro", "1999-11-10", "España", PlayerPosition.DELANTERO, 9, 179, 74, valencia),
            // Athletic Club (IDs 20-21)
            createPlayer("Unai", "Simón", "1997-06-11", "España", PlayerPosition.PORTERO, 1, 190, 82, athletic),
            createPlayer("Nico", "Williams", "2002-07-12", "España", PlayerPosition.DELANTERO, 11, 181, 75, athletic),
            // Real Sociedad (IDs 22-23)
            createPlayer("Álex", "Remiro", "1995-03-24", "España", PlayerPosition.PORTERO, 1, 188, 84, realSociedad),
            createPlayer("Mikel", "Oyarzabal", "1997-04-21", "España", PlayerPosition.DELANTERO, 10, 181, 78, realSociedad),
            // Xerez (IDs 24-25)
            createPlayer("Mati", "Castillo", "2001-07-22", "España", PlayerPosition.DELANTERO, 11, 169, 65, xerez),
            createPlayer("Charaf", "Taoualy", "1999-03-14", "Marruecos", PlayerPosition.CENTROCAMPISTA, 10, 180, 70, xerez),

            // ==================== OSASUNA (IDs 26-48) ====================
            // Porteros
            createPlayer("Sergio", "Herrera", "1993-06-05", "España", PlayerPosition.PORTERO, 1, 192, 82, osasuna),
            createPlayer("Aitor", "Fernández", "1991-05-03", "España", PlayerPosition.PORTERO, 13, 190, 80, osasuna),
            // Defensas
            createPlayer("Enzo", "Boyomo", "2001-01-14", "Camerún", PlayerPosition.DEFENSA, 22, 190, 82, osasuna),
            createPlayer("Jorge", "Herrando", "2001-03-11", "España", PlayerPosition.DEFENSA, 5, 186, 78, osasuna),
            createPlayer("Alejandro", "Catena", "1994-02-28", "España", PlayerPosition.DEFENSA, 24, 185, 80, osasuna),
            createPlayer("Abel", "Bretones", "2000-05-22", "España", PlayerPosition.DEFENSA, 23, 175, 68, osasuna),
            createPlayer("Javi", "Galán", "1994-11-19", "España", PlayerPosition.DEFENSA, 20, 172, 67, osasuna),
            createPlayer("Juan", "Cruz", "1991-11-28", "España", PlayerPosition.DEFENSA, 3, 183, 75, osasuna),
            createPlayer("Valentin", "Rosier", "1996-06-07", "Francia", PlayerPosition.DEFENSA, 19, 184, 74, osasuna),
            createPlayer("Íñigo", "Arguibide", "2005-04-08", "España", PlayerPosition.DEFENSA, 41, 180, 72, osasuna),
            // Centrocampistas
            createPlayer("Lucas", "Torró", "1994-07-18", "España", PlayerPosition.CENTROCAMPISTA, 6, 188, 80, osasuna),
            createPlayer("Iker", "Muñoz", "2002-03-12", "España", PlayerPosition.CENTROCAMPISTA, 8, 180, 74, osasuna),
            createPlayer("Jon", "Moncayola", "1998-05-13", "España", PlayerPosition.CENTROCAMPISTA, 7, 184, 78, osasuna),
            createPlayer("Asier", "Osambela", "2004-06-21", "España", PlayerPosition.CENTROCAMPISTA, 29, 178, 72, osasuna),
            createPlayer("Aimar", "Oroz", "2001-10-23", "España", PlayerPosition.CENTROCAMPISTA, 10, 177, 72, osasuna),
            createPlayer("Moi", "Gómez", "1994-06-23", "España", PlayerPosition.CENTROCAMPISTA, 16, 172, 66, osasuna),
            // Delanteros
            createPlayer("Víctor", "Muñoz", "2003-03-20", "España", PlayerPosition.DELANTERO, 21, 180, 74, osasuna),
            createPlayer("Sheraldo", "Becker", "1995-02-09", "Surinam", PlayerPosition.DELANTERO, 18, 180, 73, osasuna),
            createPlayer("Rubén", "García", "1993-07-14", "España", PlayerPosition.DELANTERO, 14, 173, 68, osasuna),
            createPlayer("Iker", "Benito", "2002-06-22", "España", PlayerPosition.DELANTERO, 2, 176, 70, osasuna),
            createPlayer("Kike", "Barja", "1997-05-09", "España", PlayerPosition.DELANTERO, 11, 175, 70, osasuna),
            createPlayer("Raúl", "García de Haro", "2000-09-15", "España", PlayerPosition.DELANTERO, 9, 182, 76, osasuna),
            createPlayer("Ante", "Budimir", "1991-07-22", "Croacia", PlayerPosition.DELANTERO, 17, 190, 75, osasuna),

            // ==================== NUEVOS JUGADORES BARCELONA (IDs 49+) ====================
            createPlayer("Wojciech", "Szczęsny", "1990-04-18", "Polonia", PlayerPosition.PORTERO, 25, 196, 84, barcelona),
            createPlayer("Joan", "García", "2001-02-23", "España", PlayerPosition.PORTERO, 13, 188, 80, barcelona),
            createPlayer("Jules", "Koundé", "1998-11-12", "Francia", PlayerPosition.DEFENSA, 23, 178, 75, barcelona),
            createPlayer("João", "Cancelo", "1994-05-27", "Portugal", PlayerPosition.DEFENSA, 2, 182, 74, barcelona),
            createPlayer("Alejandro", "Balde", "2003-10-18", "España", PlayerPosition.DEFENSA, 3, 175, 70, barcelona),
            createPlayer("Pau", "Cubarsí", "2007-01-22", "España", PlayerPosition.DEFENSA, 5, 182, 73, barcelona),
            createPlayer("Eric", "García", "2001-01-09", "España", PlayerPosition.DEFENSA, 24, 182, 75, barcelona),
            createPlayer("Andreas", "Christensen", "1996-04-10", "Dinamarca", PlayerPosition.DEFENSA, 15, 187, 82, barcelona),
            createPlayer("Gerard", "Martín", "2002-05-25", "España", PlayerPosition.DEFENSA, 18, 175, 68, barcelona),
            createPlayer("Frenkie", "de Jong", "1997-05-12", "Países Bajos", PlayerPosition.CENTROCAMPISTA, 21, 180, 74, barcelona),
            createPlayer("Dani", "Olmo", "1998-05-07", "España", PlayerPosition.CENTROCAMPISTA, 20, 179, 72, barcelona),
            createPlayer("Fermín", "López", "2003-01-01", "España", PlayerPosition.CENTROCAMPISTA, 16, 175, 68, barcelona),
            createPlayer("Marc", "Casadó", "2003-09-14", "España", PlayerPosition.CENTROCAMPISTA, 17, 183, 75, barcelona),
            createPlayer("Marc", "Bernal", "2007-05-27", "España", PlayerPosition.CENTROCAMPISTA, 22, 181, 72, barcelona),
            createPlayer("Raphinha", "Dias", "1996-12-14", "Brasil", PlayerPosition.DELANTERO, 11, 176, 68, barcelona),
            createPlayer("Marcus", "Rashford", "1997-10-31", "Inglaterra", PlayerPosition.DELANTERO, 14, 185, 80, barcelona),
            createPlayer("Ferran", "Torres", "2000-02-29", "España", PlayerPosition.DELANTERO, 7, 184, 77, barcelona),
            createPlayer("Roony", "Bardghji", "2005-11-03", "Suecia", PlayerPosition.DELANTERO, 19, 175, 68, barcelona),

            // ==================== NUEVOS JUGADORES REAL MADRID ====================
            createPlayer("Andriy", "Lunin", "1999-02-11", "Ucrania", PlayerPosition.PORTERO, 13, 191, 82, realMadrid),
            createPlayer("Fran", "González", "2005-06-15", "España", PlayerPosition.PORTERO, 26, 186, 78, realMadrid),
            createPlayer("Trent", "Alexander-Arnold", "1998-10-07", "Inglaterra", PlayerPosition.DEFENSA, 12, 175, 69, realMadrid),
            createPlayer("Álvaro", "Carreras", "2003-10-04", "España", PlayerPosition.DEFENSA, 18, 179, 72, realMadrid),
            createPlayer("Dean", "Huijsen", "2005-04-14", "España", PlayerPosition.DEFENSA, 24, 197, 84, realMadrid),
            createPlayer("Éder", "Militão", "1998-01-18", "Brasil", PlayerPosition.DEFENSA, 3, 186, 78, realMadrid),
            createPlayer("Raúl", "Asencio", "2003-09-18", "España", PlayerPosition.DEFENSA, 17, 185, 76, realMadrid),
            createPlayer("David", "Alaba", "1992-06-24", "Austria", PlayerPosition.DEFENSA, 4, 180, 78, realMadrid),
            createPlayer("Fran", "García", "1999-08-14", "España", PlayerPosition.DEFENSA, 20, 169, 65, realMadrid),
            createPlayer("Ferland", "Mendy", "1995-06-08", "Francia", PlayerPosition.DEFENSA, 23, 180, 73, realMadrid),
            createPlayer("Federico", "Valverde", "1998-07-22", "Uruguay", PlayerPosition.CENTROCAMPISTA, 8, 182, 78, realMadrid),
            createPlayer("Aurélien", "Tchouaméni", "2000-01-27", "Francia", PlayerPosition.CENTROCAMPISTA, 14, 187, 81, realMadrid),
            createPlayer("Arda", "Güler", "2005-02-25", "Turquía", PlayerPosition.CENTROCAMPISTA, 15, 176, 70, realMadrid),
            createPlayer("Eduardo", "Camavinga", "2002-11-10", "Francia", PlayerPosition.CENTROCAMPISTA, 6, 182, 68, realMadrid),
            createPlayer("Dani", "Ceballos", "1996-08-07", "España", PlayerPosition.CENTROCAMPISTA, 19, 177, 70, realMadrid),
            createPlayer("Rodrygo", "Goes", "2001-01-09", "Brasil", PlayerPosition.DELANTERO, 11, 174, 64, realMadrid),
            createPlayer("Franco", "Mastantuono", "2007-08-02", "Argentina", PlayerPosition.DELANTERO, 30, 175, 65, realMadrid),
            createPlayer("Brahim", "Díaz", "1999-08-03", "Marruecos", PlayerPosition.DELANTERO, 21, 171, 59, realMadrid),
            createPlayer("Gonzalo", "García", "2004-06-15", "España", PlayerPosition.DELANTERO, 16, 178, 72, realMadrid),

            // ==================== NUEVOS JUGADORES ATLÉTICO MADRID ====================
            createPlayer("Juan", "Musso", "1994-05-06", "Argentina", PlayerPosition.PORTERO, 1, 191, 83, atletico),
            createPlayer("Dávid", "Hancko", "1997-12-13", "Eslovaquia", PlayerPosition.DEFENSA, 17, 188, 82, atletico),
            createPlayer("Marcos", "Llorente", "1995-01-30", "España", PlayerPosition.DEFENSA, 14, 184, 74, atletico),
            createPlayer("Robin", "Le Normand", "1996-11-11", "España", PlayerPosition.DEFENSA, 24, 187, 81, atletico),
            createPlayer("Clément", "Lenglet", "1995-06-17", "Francia", PlayerPosition.DEFENSA, 15, 186, 76, atletico),
            createPlayer("Nahuel", "Molina", "1998-04-06", "Argentina", PlayerPosition.DEFENSA, 16, 175, 70, atletico),
            createPlayer("Matteo", "Ruggeri", "2002-07-17", "Italia", PlayerPosition.DEFENSA, 3, 184, 75, atletico),
            createPlayer("Marc", "Pubill", "2003-06-12", "España", PlayerPosition.DEFENSA, 18, 178, 70, atletico),
            createPlayer("Johnny", "Cardoso", "2001-08-24", "Estados Unidos", PlayerPosition.CENTROCAMPISTA, 5, 185, 76, atletico),
            createPlayer("Pablo", "Barrios", "2003-02-16", "España", PlayerPosition.CENTROCAMPISTA, 8, 180, 72, atletico),
            createPlayer("Julián", "Álvarez", "2000-01-31", "Argentina", PlayerPosition.DELANTERO, 19, 170, 71, atletico),
            createPlayer("Alexander", "Sørloth", "1995-12-05", "Noruega", PlayerPosition.DELANTERO, 9, 195, 88, atletico),
            createPlayer("Nico", "González", "1998-04-06", "Argentina", PlayerPosition.DELANTERO, 23, 180, 73, atletico),
            createPlayer("Álex", "Baena", "2001-05-20", "España", PlayerPosition.DELANTERO, 10, 175, 66, atletico),
            createPlayer("Thiago", "Almada", "2001-04-26", "Argentina", PlayerPosition.DELANTERO, 11, 171, 62, atletico),
            createPlayer("Giuliano", "Simeone", "2002-07-14", "Argentina", PlayerPosition.DELANTERO, 20, 178, 74, atletico),

            // ==================== VILLARREAL (todos nuevos) ====================
            // Porteros
            createPlayer("Luiz", "Júnior", "2000-03-15", "Brasil", PlayerPosition.PORTERO, 1, 188, 80, villarreal),
            createPlayer("Diego", "Conde", "1998-04-10", "España", PlayerPosition.PORTERO, 13, 190, 82, villarreal),
            createPlayer("Arnau", "Tenas", "2001-05-18", "España", PlayerPosition.PORTERO, 25, 189, 80, villarreal),
            // Defensas
            createPlayer("Logan", "Costa", "2001-08-06", "Cabo Verde", PlayerPosition.DEFENSA, 2, 186, 77, villarreal),
            createPlayer("Sergi", "Cardona", "1999-05-14", "España", PlayerPosition.DEFENSA, 23, 177, 70, villarreal),
            createPlayer("Renato", "Veiga", "2003-07-18", "Portugal", PlayerPosition.DEFENSA, 12, 191, 80, villarreal),
            createPlayer("Juan", "Foyth", "1998-01-12", "Argentina", PlayerPosition.DEFENSA, 8, 187, 77, villarreal),
            createPlayer("Santiago", "Mouriño", "2002-09-10", "Uruguay", PlayerPosition.DEFENSA, 15, 182, 74, villarreal),
            createPlayer("Rafa", "Marín", "2002-07-22", "España", PlayerPosition.DEFENSA, 4, 190, 78, villarreal),
            createPlayer("Alfonso", "Pedraza", "1996-04-09", "España", PlayerPosition.DEFENSA, 24, 179, 73, villarreal),
            createPlayer("Willy", "Kambwala", "2004-08-16", "Francia", PlayerPosition.DEFENSA, 5, 186, 78, villarreal),
            createPlayer("Pau", "Navarro", "2005-03-22", "España", PlayerPosition.DEFENSA, 26, 178, 70, villarreal),
            // Centrocampistas
            createPlayer("Thomas", "Partey", "1993-06-13", "Ghana", PlayerPosition.CENTROCAMPISTA, 16, 185, 77, villarreal),
            createPlayer("Santi", "Comesaña", "1996-02-28", "España", PlayerPosition.CENTROCAMPISTA, 14, 170, 62, villarreal),
            createPlayer("Dani", "Parejo", "1989-04-16", "España", PlayerPosition.CENTROCAMPISTA, 10, 182, 75, villarreal),
            createPlayer("Pape", "Gueye", "1999-01-24", "Senegal", PlayerPosition.CENTROCAMPISTA, 18, 188, 80, villarreal),
            createPlayer("Carlos", "Macià", "2005-08-12", "España", PlayerPosition.CENTROCAMPISTA, 34, 175, 65, villarreal),
            // Delanteros
            createPlayer("Alberto", "Moleiro", "2003-03-05", "España", PlayerPosition.DELANTERO, 20, 174, 65, villarreal),
            createPlayer("Georges", "Mikautadze", "2000-10-31", "Georgia", PlayerPosition.DELANTERO, 9, 176, 72, villarreal),
            createPlayer("Tani", "Oluwaseyi", "2000-02-10", "Canadá", PlayerPosition.DELANTERO, 21, 180, 74, villarreal),
            createPlayer("Nicolas", "Pépé", "1995-05-29", "Costa de Marfil", PlayerPosition.DELANTERO, 19, 183, 75, villarreal),
            createPlayer("Ayoze", "Pérez", "1993-07-23", "España", PlayerPosition.DELANTERO, 7, 178, 73, villarreal),
            createPlayer("Tajon", "Buchanan", "1999-02-08", "Canadá", PlayerPosition.DELANTERO, 17, 176, 68, villarreal),
            createPlayer("Gerard", "Moreno", "1992-04-07", "España", PlayerPosition.DELANTERO, 33, 180, 77, villarreal),
            createPlayer("Ilias", "Akhomach", "2004-02-24", "Marruecos", PlayerPosition.DELANTERO, 11, 175, 65, villarreal)
        );

        List<Player> saved = playerRepository.saveAll(players);
        // Actualizar URLs con IDs generados
        saved.forEach(p -> p.setFotoUrl("assets/images/players/medium/" + p.getId() + ".webp"));
        playerRepository.saveAll(saved);
        log.info("Cargados {} jugadores", saved.size());
    }

    private Player createPlayer(String nombre, String apellidos, String fechaNacimiento, String nacionalidad,
                                 PlayerPosition posicion, int dorsal, int altura, int peso, Team equipo) {
        Player player = new Player();
        player.setNombre(nombre);
        player.setApellidos(apellidos);
        player.setFechaNacimiento(LocalDate.parse(fechaNacimiento));
        player.setNacionalidad(nacionalidad);
        player.setPosicion(posicion);
        player.setDorsal(dorsal);
        player.setAltura(new BigDecimal(altura).divide(new BigDecimal(100)));
        player.setPeso(new BigDecimal(peso));
        player.setEquipo(equipo);
        player.setActivo(true);
        return player;
    }

    private void loadMatches() {
        List<Competition> competitions = competitionRepository.findAll();
        List<Team> teams = teamRepository.findAll();

        if (competitions.isEmpty() || teams.isEmpty()) {
            log.warn("No hay competiciones o equipos para crear partidos");
            return;
        }

        Competition laliga = competitions.stream()
            .filter(c -> c.getNombre().toLowerCase().contains("laliga"))
            .findFirst()
            .orElse(competitions.get(0));

        Team realMadrid = teams.stream().filter(t -> t.getNombre().equals("Real Madrid")).findFirst().orElse(null);
        Team barcelona = teams.stream().filter(t -> t.getNombre().equals("Barcelona")).findFirst().orElse(null);
        Team atletico = teams.stream().filter(t -> t.getNombre().equals("Atlético Madrid")).findFirst().orElse(null);
        Team sevilla = teams.stream().filter(t -> t.getNombre().equals("Sevilla")).findFirst().orElse(null);
        Team betis = teams.stream().filter(t -> t.getNombre().equals("Real Betis")).findFirst().orElse(null);
        Team valencia = teams.stream().filter(t -> t.getNombre().equals("Valencia")).findFirst().orElse(null);
        Team athletic = teams.stream().filter(t -> t.getNombre().equals("Athletic Club")).findFirst().orElse(null);
        Team realSociedad = teams.stream().filter(t -> t.getNombre().equals("Real Sociedad")).findFirst().orElse(null);
        Team xerez = teams.stream().filter(t -> t.getNombre().equals("Xerez")).findFirst().orElse(null);

        if (realMadrid == null || barcelona == null) {
            log.warn("No se encontraron los equipos principales");
            return;
        }

        List<Match> matches = List.of(
            // Jornada 32 (2009-10) - Finalizados
            createMatch(laliga, atletico, xerez, "2010-04-14T19:00:00", atletico.getEstadio(), 32, 1, 2, MatchStatus.FINALIZADO),

            // Jornada 17 - Finalizados
            createMatch(laliga, barcelona, atletico, "2026-01-13T21:00:00", barcelona.getEstadio(), 17, 2, 1, MatchStatus.FINALIZADO),
            createMatch(laliga, sevilla, realMadrid, "2026-01-13T18:30:00", sevilla.getEstadio(), 17, 0, 3, MatchStatus.FINALIZADO),
            createMatch(laliga, realSociedad, athletic, "2026-01-12T21:00:00", realSociedad.getEstadio(), 17, 1, 1, MatchStatus.FINALIZADO),
            createMatch(laliga, valencia, betis, "2026-01-12T18:30:00", valencia.getEstadio(), 17, 2, 2, MatchStatus.FINALIZADO),

            // Jornada 18 - Programados
            createMatch(laliga, realMadrid, barcelona, "2026-01-20T21:00:00", realMadrid.getEstadio(), 18, 0, 0, MatchStatus.PROGRAMADO),
            createMatch(laliga, atletico, sevilla, "2026-01-20T18:30:00", atletico.getEstadio(), 18, 0, 0, MatchStatus.PROGRAMADO),
            createMatch(laliga, athletic, realSociedad, "2026-01-21T21:00:00", athletic.getEstadio(), 18, 0, 0, MatchStatus.PROGRAMADO),
            createMatch(laliga, betis, valencia, "2026-01-21T16:15:00", betis.getEstadio(), 18, 0, 0, MatchStatus.PROGRAMADO),

            // Jornada 19 - Futuros
            createMatch(laliga, barcelona, realMadrid, "2026-01-27T21:00:00", barcelona.getEstadio(), 19, 0, 0, MatchStatus.PROGRAMADO),
            createMatch(laliga, sevilla, atletico, "2026-01-27T18:30:00", sevilla.getEstadio(), 19, 0, 0, MatchStatus.PROGRAMADO)
        );

        matchRepository.saveAll(matches);
        log.info("Cargados {} partidos", matches.size());
    }

    private Match createMatch(Competition competition, Team local, Team visitante, String fechaHora,
                               String estadio, int jornada, int golesLocal, int golesVisitante, MatchStatus estado) {
        Match match = new Match();
        match.setCompeticion(competition);
        match.setEquipoLocal(local);
        match.setEquipoVisitante(visitante);
        match.setFechaHora(LocalDateTime.parse(fechaHora));
        match.setEstadio(estadio);
        match.setJornada(jornada);
        match.setGolesLocal(golesLocal);
        match.setGolesVisitante(golesVisitante);
        match.setEstado(estado);
        return match;
    }

    private void loadNews() {
        User admin = userRepository.findByEmail("admin@lareferente.com").orElse(null);
        if (admin == null) {
            log.warn("No se encontró el usuario admin para crear noticias");
            return;
        }

        List<News> noticias = List.of(
            createNews(
                "El Clásico: Real Madrid recibe al Barcelona en el Santiago Bernabéu",
                "El partido más esperado de la temporada se disputará el próximo domingo",
                "El Real Madrid y el FC Barcelona se enfrentarán en el Santiago Bernabéu en lo que promete ser uno de los partidos más emocionantes de la temporada. Ambos equipos llegan en un gran momento de forma, con el Madrid liderando la clasificación y el Barcelona a solo dos puntos.\n\nCarlo Ancelotti podrá contar con todos sus efectivos, incluyendo a Bellingham y Mbappé, que han sido determinantes en las últimas jornadas. Por su parte, Xavi Hernández confía en el talento de Lamine Yamal y la experiencia de Lewandowski para sorprender en el Bernabéu.\n\nEl árbitro designado para el encuentro será Mateu Lahoz, quien dirigirá su último Clásico antes de su retiro. Se esperan más de 80.000 aficionados en las gradas del coliseo blanco.",
                NewsCategory.NOTICIA,
                true,
                true,
                admin
            ),
            createNews(
                "Mbappé brilla con hat-trick ante el Sevilla",
                "El francés lidera la goleada del Real Madrid por 3-0",
                "Kylian Mbappé demostró una vez más por qué es considerado uno de los mejores jugadores del mundo al anotar tres goles en la victoria del Real Madrid sobre el Sevilla en el Sánchez Pizjuán.\n\nEl delantero francés abrió el marcador en el minuto 23 con un disparo desde fuera del área, amplió la ventaja antes del descanso tras una gran jugada personal, y completó su hat-trick en la segunda mitad con un remate de cabeza.\n\nCon estos tres goles, Mbappé se coloca como máximo goleador de LaLiga con 18 tantos, superando a Lewandowski que suma 15.",
                NewsCategory.NOTICIA,
                true,
                true,
                admin
            ),
            createNews(
                "Lamine Yamal: El futuro del fútbol español",
                "A sus 17 años, la joya del Barcelona sigue rompiendo récords",
                "Lamine Yamal continúa sorprendiendo al mundo del fútbol con sus actuaciones. El joven extremo del FC Barcelona se ha convertido en el jugador más joven en alcanzar las 10 asistencias en una temporada de LaLiga.\n\nSu velocidad, regate y visión de juego lo han convertido en una pieza fundamental del esquema de Xavi Hernández. Los grandes clubes europeos ya han mostrado interés, pero el Barcelona tiene claro que Yamal es intransferible.\n\n'Es un jugador único, tiene un talento que no se ve cada día. Estamos ante una futura leyenda del fútbol', declaró Xavi en rueda de prensa.",
                NewsCategory.ANALISIS,
                false,
                true,
                admin
            ),
            createNews(
                "Athletic Club sueña con la Champions",
                "Los leones se mantienen en puestos europeos tras empatar en Anoeta",
                "El Athletic Club de Bilbao sigue firme en su objetivo de clasificarse para la Champions League por primera vez en más de una década. El empate a uno frente a la Real Sociedad en el derbi vasco les permite mantenerse en la cuarta posición.\n\nNico Williams fue el autor del gol bilbaíno con un espectacular disparo desde fuera del área. El joven extremo internacional sigue en un estado de forma excepcional y ya acumula 8 goles y 7 asistencias esta temporada.\n\nErnesto Valverde, técnico del conjunto vasco, se mostró satisfecho con el punto: 'Anoeta siempre es difícil, y sumar aquí es muy valioso para nuestras aspiraciones'.",
                NewsCategory.NOTICIA,
                false,
                true,
                admin
            ),
            createNews(
                "Entrevista exclusiva: Bellingham habla de su adaptación a España",
                "El inglés repasa su primera temporada y media en el Real Madrid",
                "Jude Bellingham concedió una entrevista exclusiva donde habló de su experiencia en España y en el Real Madrid. El centrocampista inglés llegó procedente del Borussia Dortmund y se ha convertido en una pieza clave del equipo de Ancelotti.\n\n'Desde el primer día me sentí como en casa. El vestuario me acogió de manera increíble y la afición me ha dado un cariño que nunca olvidaré', comentó Bellingham.\n\nSobre sus objetivos, el inglés fue claro: 'Quiero ganar todos los títulos posibles con este club. La Champions es el sueño, pero también queremos la Liga y la Copa. Aquí se compite por todo'.\n\nBellingham también habló sobre su relación con Mbappé: 'Kylian es un jugador extraordinario. Tenerlo de compañero es un privilegio y creo que juntos podemos lograr grandes cosas'.",
                NewsCategory.ENTREVISTA,
                true,
                true,
                admin
            ),
            createNews(
                "Análisis táctico: El sistema de Xavi evoluciona",
                "El Barcelona presenta una nueva variante con tres centrocampistas",
                "El FC Barcelona ha mostrado una evolución táctica significativa en los últimos partidos. Xavi Hernández ha implementado un sistema más flexible que alterna entre el 4-3-3 tradicional y un 4-2-3-1 que da más libertad a los extremos.\n\nPedri y Gavi se han consolidado como la pareja de centrocampistas más prometedora de Europa, mientras que De Jong actúa como pivote defensivo cuando el equipo no tiene el balón.\n\nEn ataque, Lamine Yamal y Raphinha proporcionan amplitud, mientras que Lewandowski se mueve entre líneas para generar espacios. Esta versatilidad ha permitido al Barcelona ser más impredecible y efectivo en las últimas jornadas.",
                NewsCategory.ANALISIS,
                false,
                true,
                admin
            ),
            createNews(
                "Opinión: LaLiga necesita más competitividad",
                "Reflexiones sobre el dominio de los grandes en el fútbol español",
                "LaLiga sigue siendo una de las mejores ligas del mundo, pero no podemos ignorar que la brecha entre los grandes y el resto de equipos se ha ampliado en los últimos años.\n\nMientras Real Madrid y Barcelona invierten cientos de millones en fichajes, clubes históricos como el Valencia o el Sevilla luchan por mantener a sus mejores jugadores. Esta desigualdad económica se refleja en el terreno de juego.\n\nSin embargo, casos como el del Athletic Club o el Girona demuestran que con una buena gestión y una cantera potente se puede competir. El fútbol español necesita más historias así para mantener su atractivo.\n\nLa nueva ley del deporte y el reparto más equitativo de los derechos televisivos podrían ser un primer paso hacia una liga más competitiva.",
                NewsCategory.OPINION,
                false,
                true,
                admin
            ),
            createNews(
                "Mercado de fichajes: Los rumores más calientes",
                "Resumen de los movimientos que podrían darse en el mercado invernal",
                "El mercado de fichajes de invierno está a punto de abrir y los rumores no paran de circular. El Real Madrid estaría interesado en reforzar su defensa con Alphonso Davies, mientras que el Barcelona busca un delantero centro de garantías.\n\nEl Atlético de Madrid podría desprenderse de varios jugadores para hacer caja, con Griezmann sonando para la MLS. Por su parte, el Sevilla necesita refuerzos urgentes para evitar el descenso.\n\nEn cuanto a salidas, varios jugadores de LaLiga están en el radar de la Premier League. Nico Williams sigue siendo objetivo del Chelsea, aunque el Athletic no tiene intención de venderlo.",
                NewsCategory.NOTICIA,
                false,
                true,
                admin
            )
        );

        List<News> saved = newsRepository.saveAll(noticias);
        // Actualizar URLs con IDs generados
        saved.forEach(n -> n.setImagenPrincipalUrl("assets/images/news/" + n.getId() + ".jpg"));
        newsRepository.saveAll(saved);
        log.info("Cargadas {} noticias", saved.size());
    }

    private News createNews(String titulo, String subtitulo, String contenido,
                            NewsCategory categoria, boolean destacada, boolean publicada, User autor) {
        News news = new News();
        news.setTitulo(titulo);
        news.setSubtitulo(subtitulo);
        news.setContenido(contenido);
        news.setCategoria(categoria);
        news.setDestacada(destacada);
        news.setPublicada(publicada);
        news.setAutor(autor);
        if (publicada) {
            news.setFechaPublicacion(LocalDateTime.now().minusDays((long) (Math.random() * 7)));
        }
        news.setVisitas((int) (Math.random() * 5000));
        return news;
    }
}
