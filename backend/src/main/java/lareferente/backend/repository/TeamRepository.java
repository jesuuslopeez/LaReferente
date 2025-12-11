package lareferente.backend.repository;

import lareferente.backend.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    // Buscar por nombre
    Optional<Team> findByNombre(String nombre);

    // Buscar equipos activos
    List<Team> findByActivoTrueOrderByNombreAsc();

    // Buscar por país
    List<Team> findByPaisAndActivoTrue(String pais);

    // Buscar por ciudad
    List<Team> findByCiudadAndActivoTrue(String ciudad);

    // Buscar equipos con jugadores
    @Query("SELECT DISTINCT t FROM Team t INNER JOIN Player p ON p.equipo.id = t.id WHERE t.activo = true")
    List<Team> findTeamsWithPlayers();

    // Buscar por nombre parcial
    @Query("SELECT t FROM Team t WHERE LOWER(t.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) AND t.activo = true")
    List<Team> searchByName(@Param("nombre") String nombre);

    // Contar jugadores por equipo
    @Query("SELECT COUNT(p) FROM Player p WHERE p.equipo.id = :teamId AND p.activo = true")
    Long countPlayersByTeam(@Param("teamId") Long teamId);
}