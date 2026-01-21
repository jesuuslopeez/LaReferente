package lareferente.backend.repository;

import lareferente.backend.enums.PlayerPosition;
import lareferente.backend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {

    // Buscar jugadores activos
    List<Player> findByActivoTrueOrderByApellidosAsc();

    // Buscar por equipo (ordenados por dorsal)
    List<Player> findByEquipoIdAndActivoTrueOrderByDorsalAsc(Long equipoId);

    // Buscar por posición
    List<Player> findByPosicionAndActivoTrue(PlayerPosition posicion);

    // Buscar por nacionalidad
    List<Player> findByNacionalidadAndActivoTrue(String nacionalidad);

    // Buscar jugadores por nombre o apellidos
    @Query("SELECT p FROM Player p WHERE (LOWER(p.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.apellidos) LIKE LOWER(CONCAT('%', :query, '%'))) AND p.activo = true")
    List<Player> searchByNameOrSurname(@Param("query") String query);

    // Obtener jugadores con más goles en una temporada
    @Query("SELECT p FROM Player p JOIN PlayerStats ps ON ps.jugador.id = p.id WHERE ps.temporada = :temporada AND p.activo = true ORDER BY ps.goles DESC")
    List<Player> findTopScorersBySeasonLimit(@Param("temporada") String temporada);

    // Jugadores sin equipo
    @Query("SELECT p FROM Player p WHERE p.equipo IS NULL AND p.activo = true")
    List<Player> findPlayersWithoutTeam();

    // Contar jugadores por posición
    @Query("SELECT COUNT(p) FROM Player p WHERE p.posicion = :posicion AND p.activo = true")
    Long countByPosition(@Param("posicion") PlayerPosition posicion);
}