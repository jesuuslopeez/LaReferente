package lareferente.backend.repository;

import lareferente.backend.enums.CompetitionType;
import lareferente.backend.model.Competition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompetitionRepository extends JpaRepository<Competition, Long> {

    // Buscar competiciones activas
    List<Competition> findByActivaTrueOrderByNombreAsc();

    // Buscar por temporada
    List<Competition> findByTemporadaAndActivaTrue(String temporada);

    // Buscar por tipo
    List<Competition> findByTipoAndActivaTrue(CompetitionType tipo);

    // Buscar por país
    List<Competition> findByPaisAndActivaTrue(String pais);

    // Buscar por tipo y temporada
    @Query("SELECT c FROM Competition c WHERE c.tipo = :tipo AND c.temporada = :temporada AND c.activa = true")
    List<Competition> findByTypeAndSeason(@Param("tipo") CompetitionType tipo, @Param("temporada") String temporada);

    // Competiciones en curso (entre fecha inicio y fin)
    @Query("SELECT c FROM Competition c WHERE c.activa = true AND CURRENT_DATE BETWEEN c.fechaInicio AND c.fechaFin")
    List<Competition> findOngoingCompetitions();

    // Contar partidos por competición
    @Query("SELECT COUNT(m) FROM Match m WHERE m.competicion.id = :competitionId")
    Long countMatchesByCompetition(@Param("competitionId") Long competitionId);
}