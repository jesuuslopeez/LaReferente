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
import java.util.List;

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
            createCompetition("Copa del Rey", "Copa de S.M. El Rey", "España", CompetitionType.COPA, "2025-2026", "2025-10-01", "2026-04-26"),
            createCompetition("Supercopa España", "Supercopa de España", "España", CompetitionType.COPA, "2025-2026", "2026-01-08", "2026-01-12")
        );
        competitionRepository.saveAll(competitions);
        log.info("Cargadas {} competiciones", competitions.size());
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
        List<Team> teams = List.of(
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
            createTeam("Osasuna", "Club Atlético Osasuna", "España", "Pamplona", "El Sadar", 1920)
        );
        teamRepository.saveAll(teams);
        log.info("Cargados {} equipos", teams.size());
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

        List<Player> players = List.of(
            // Real Madrid
            createPlayer("Thibaut", "Courtois", "1992-05-11", "Bélgica", PlayerPosition.PORTERO, 1, 199, 96, realMadrid),
            createPlayer("Dani", "Carvajal", "1992-01-11", "España", PlayerPosition.DEFENSA, 2, 173, 73, realMadrid),
            createPlayer("Antonio", "Rüdiger", "1993-03-03", "Alemania", PlayerPosition.DEFENSA, 22, 190, 85, realMadrid),
            createPlayer("Jude", "Bellingham", "2003-06-29", "Inglaterra", PlayerPosition.CENTROCAMPISTA, 5, 186, 75, realMadrid),
            createPlayer("Vinícius", "Júnior", "2000-07-12", "Brasil", PlayerPosition.DELANTERO, 7, 176, 73, realMadrid),
            createPlayer("Kylian", "Mbappé", "1998-12-20", "Francia", PlayerPosition.DELANTERO, 9, 178, 75, realMadrid),

            // Barcelona
            createPlayer("Marc-André", "ter Stegen", "1992-04-30", "Alemania", PlayerPosition.PORTERO, 1, 187, 85, barcelona),
            createPlayer("Ronald", "Araújo", "1999-03-07", "Uruguay", PlayerPosition.DEFENSA, 4, 188, 81, barcelona),
            createPlayer("Pedri", "González", "2002-11-25", "España", PlayerPosition.CENTROCAMPISTA, 8, 174, 60, barcelona),
            createPlayer("Gavi", "Páez", "2004-08-05", "España", PlayerPosition.CENTROCAMPISTA, 6, 173, 68, barcelona),
            createPlayer("Lamine", "Yamal", "2007-07-13", "España", PlayerPosition.DELANTERO, 19, 180, 68, barcelona),
            createPlayer("Robert", "Lewandowski", "1988-08-21", "Polonia", PlayerPosition.DELANTERO, 9, 185, 81, barcelona),

            // Atlético Madrid
            createPlayer("Jan", "Oblak", "1993-01-07", "Eslovenia", PlayerPosition.PORTERO, 13, 188, 87, atletico),
            createPlayer("José María", "Giménez", "1995-01-20", "Uruguay", PlayerPosition.DEFENSA, 2, 185, 80, atletico),
            createPlayer("Koke", "Resurrección", "1992-01-08", "España", PlayerPosition.CENTROCAMPISTA, 6, 176, 71, atletico),
            createPlayer("Antoine", "Griezmann", "1991-03-21", "Francia", PlayerPosition.DELANTERO, 7, 176, 73, atletico),

            // Sevilla
            createPlayer("Yassine", "Bounou", "1991-04-05", "Marruecos", PlayerPosition.PORTERO, 13, 192, 82, sevilla),
            createPlayer("Jesús", "Navas", "1985-11-21", "España", PlayerPosition.DEFENSA, 16, 172, 60, sevilla),

            // Real Betis
            createPlayer("Rui", "Silva", "1994-02-07", "Portugal", PlayerPosition.PORTERO, 13, 191, 85, betis),
            createPlayer("Isco", "Alarcón", "1992-04-21", "España", PlayerPosition.CENTROCAMPISTA, 22, 176, 76, betis),

            // Valencia
            createPlayer("Giorgi", "Mamardashvili", "2000-09-29", "Georgia", PlayerPosition.PORTERO, 25, 197, 89, valencia),
            createPlayer("Hugo", "Duro", "1999-11-10", "España", PlayerPosition.DELANTERO, 9, 179, 74, valencia),

            // Athletic Club
            createPlayer("Unai", "Simón", "1997-06-11", "España", PlayerPosition.PORTERO, 1, 190, 82, athletic),
            createPlayer("Nico", "Williams", "2002-07-12", "España", PlayerPosition.DELANTERO, 11, 181, 75, athletic),

            // Real Sociedad
            createPlayer("Álex", "Remiro", "1995-03-24", "España", PlayerPosition.PORTERO, 1, 188, 84, realSociedad),
            createPlayer("Mikel", "Oyarzabal", "1997-04-21", "España", PlayerPosition.DELANTERO, 10, 181, 78, realSociedad)
        );

        playerRepository.saveAll(players);
        log.info("Cargados {} jugadores", players.size());
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

        if (realMadrid == null || barcelona == null) {
            log.warn("No se encontraron los equipos principales");
            return;
        }

        List<Match> matches = List.of(
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

        newsRepository.saveAll(noticias);
        log.info("Cargadas {} noticias", noticias.size());
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
