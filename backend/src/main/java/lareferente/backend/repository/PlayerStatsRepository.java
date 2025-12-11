package lareferente.backend.repository;

import lareferente.backend.model.PlayerStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {

    // Estadísticas por jugador
    List<PlayerStats> findByJugadorIdOrderByTemporadaDesc(Long jugadorId);

    // Estadísticas por temporada
    List<PlayerStats> findByTemporadaOrderByGolesDesc(String temporada);

    // Buscar estadística específica
    Optional<PlayerStats> findByJugadorIdAndTemporada(Long jugadorId, String temporada);

    // Máximos goleadores por temporada
    @Query("SELECT ps FROM PlayerStats ps WHERE ps.temporada = :temporada ORDER BY ps.goles DESC")
    List<PlayerStats> findTopScorersBySeason(@Param("temporada") String temporada);

    // Máximos asistentes por temporada
    @Query("SELECT ps FROM PlayerStats ps WHERE ps.temporada = :temporada ORDER BY ps.asistencias DESC")
    List<PlayerStats> findTopAssistersBySeason(@Param("temporada") String temporada);

    // Jugadores con más minutos
    @Query("SELECT ps FROM PlayerStats ps WHERE ps.temporada = :temporada ORDER BY ps.minutosJugados DESC")
    List<PlayerStats> findMostPlayedBySeason(@Param("temporada") String temporada);

    // Total de goles en una temporada
    @Query("SELECT SUM(ps.goles) FROM PlayerStats ps WHERE ps.temporada = :temporada")
    Long getTotalGoalsBySeason(@Param("temporada") String temporada);

    // Media de goles por jugador en temporada
    @Query("SELECT AVG(ps.goles) FROM PlayerStats ps WHERE ps.temporada = :temporada AND ps.partidosJugados > 0")
    Double getAverageGoalsBySeason(@Param("temporada") String temporada);
}