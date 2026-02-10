package lareferente.backend.repository;

import lareferente.backend.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpanishRepository extends JpaRepository<Player, Long> {

    List<Player> findByNacionalidadAndActivoTrue(String nacionalidad);

}