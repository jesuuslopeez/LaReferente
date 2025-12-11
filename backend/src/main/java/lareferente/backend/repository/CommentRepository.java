package lareferente.backend.repository;

import lareferente.backend.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Comentarios por noticia (solo aprobados)
    List<Comment> findByNoticiaIdAndAprobadoTrueOrderByFechaCreacionDesc(Long noticiaId);

    // Todos los comentarios de una noticia (incluidos no aprobados)
    List<Comment> findByNoticiaIdOrderByFechaCreacionDesc(Long noticiaId);

    // Comentarios por usuario
    List<Comment> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);

    // Comentarios pendientes de aprobación
    @Query("SELECT c FROM Comment c WHERE c.aprobado = false ORDER BY c.fechaCreacion ASC")
    List<Comment> findPendingComments();

    // Comentarios recientes aprobados
    @Query("SELECT c FROM Comment c WHERE c.aprobado = true ORDER BY c.fechaCreacion DESC")
    List<Comment> findRecentApprovedComments();

    // Contar comentarios por noticia
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.noticia.id = :noticiaId AND c.aprobado = true")
    Long countApprovedByNews(@Param("noticiaId") Long noticiaId);

    // Contar comentarios pendientes
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.aprobado = false")
    Long countPendingComments();
}