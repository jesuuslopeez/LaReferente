package lareferente.backend.repository;

import lareferente.backend.enums.MatchStatus;
import lareferente.backend.model.Match;
import lareferente.backend.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    // Buscar partidos por competición
    List<Match> findByCompeticionIdOrderByFechaHoraAsc(Long competicionId);

    // Buscar partidos por equipo (local o visitante)
    @Query("SELECT m FROM Match m WHERE m.equipoLocal.id = :equipoId OR m.equipoVisitante.id = :equipoId ORDER BY m.fechaHora DESC")
    List<Match> findByTeam(@Param("equipoId") Long equipoId);

    // Buscar partidos por estado
    List<Match> findByEstadoOrderByFechaHoraAsc(MatchStatus estado);

    // Próximos partidos (ordenados por fecha)
    @Query("SELECT m FROM Match m WHERE m.fechaHora > :now AND m.estado = 'PROGRAMADO' ORDER BY m.fechaHora ASC")
    List<Match> findUpcomingMatches(@Param("now") LocalDateTime now);

    // Partidos recientes finalizados
    @Query("SELECT m FROM Match m WHERE m.estado = 'FINALIZADO' ORDER BY m.fechaHora DESC")
    List<Match> findRecentFinishedMatches();

    // Partidos por jornada
    @Query("SELECT m FROM Match m WHERE m.competicion.id = :competicionId AND m.jornada = :jornada ORDER BY m.fechaHora ASC")
    List<Match> findByCompetitionAndRound(@Param("competicionId") Long competicionId, @Param("jornada") Integer jornada);

    // Partidos entre dos equipos
    @Query("SELECT m FROM Match m WHERE (m.equipoLocal.id = :equipo1 AND m.equipoVisitante.id = :equipo2) OR (m.equipoLocal.id = :equipo2 AND m.equipoVisitante.id = :equipo1) ORDER BY m.fechaHora DESC")
    List<Match> findMatchesBetweenTeams(@Param("equipo1") Long equipo1, @Param("equipo2") Long equipo2);

    // Partidos de hoy
    @Query("SELECT m FROM Match m WHERE CAST(m.fechaHora AS LocalDate) = CURRENT_DATE ORDER BY m.fechaHora ASC")
    List<Match> findTodayMatches();

    // Contar victorias de un equipo
    @Query("SELECT COUNT(m) FROM Match m WHERE ((m.equipoLocal.id = :equipoId AND m.golesLocal > m.golesVisitante) OR (m.equipoVisitante.id = :equipoId AND m.golesVisitante > m.golesLocal)) AND m.estado = 'FINALIZADO'")
    Long countWinsByTeam(@Param("equipoId") Long equipoId);

    // Obtener equipos distintos que participan en una competición
    @Query("SELECT DISTINCT t FROM Match m JOIN m.equipoLocal t WHERE m.competicion.id = :competicionId " +
           "UNION SELECT DISTINCT t FROM Match m JOIN m.equipoVisitante t WHERE m.competicion.id = :competicionId")
    List<Team> findTeamsByCompetition(@Param("competicionId") Long competicionId);
}