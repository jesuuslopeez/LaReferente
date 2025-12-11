package lareferente.backend.repository;

import lareferente.backend.model.Standings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StandingsRepository extends JpaRepository<Standings, Long> {

    // Clasificación completa por competición
    List<Standings> findByCompeticionIdOrderByPosicionAsc(Long competicionId);

    // Buscar posición de un equipo en una competición
    Optional<Standings> findByCompeticionIdAndEquipoId(Long competicionId, Long equipoId);

    // Top N equipos de una competición
    @Query("SELECT s FROM Standings s WHERE s.competicion.id = :competicionId ORDER BY s.posicion ASC")
    List<Standings> findTopTeamsByCompetition(@Param("competicionId") Long competicionId);

    // Equipos con más puntos en una competición
    @Query("SELECT s FROM Standings s WHERE s.competicion.id = :competicionId ORDER BY s.puntos DESC, s.golesFavor DESC")
    List<Standings> findByCompetitionOrderByPoints(@Param("competicionId") Long competicionId);

    // Mejor defensa (menos goles en contra)
    @Query("SELECT s FROM Standings s WHERE s.competicion.id = :competicionId ORDER BY s.golesContra ASC")
    List<Standings> findBestDefenseByCompetition(@Param("competicionId") Long competicionId);

    // Mejor ataque (más goles a favor)
    @Query("SELECT s FROM Standings s WHERE s.competicion.id = :competicionId ORDER BY s.golesFavor DESC")
    List<Standings> findBestAttackByCompetition(@Param("competicionId") Long competicionId);

    // Posiciones de un equipo en todas sus competiciones
    List<Standings> findByEquipoIdOrderByCompeticionNombreAsc(Long equipoId);
}