package lareferente.backend.repository;

import lareferente.backend.enums.NewsCategory;
import lareferente.backend.model.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    // Noticias publicadas ordenadas por fecha
    List<News> findByPublicadaTrueOrderByFechaPublicacionDesc();

    // Noticias destacadas publicadas
    @Query("SELECT n FROM News n WHERE n.publicada = true AND n.destacada = true ORDER BY n.fechaPublicacion DESC")
    List<News> findFeaturedNews();

    // Buscar por categoría
    List<News> findByCategoriaAndPublicadaTrueOrderByFechaPublicacionDesc(NewsCategory categoria);

    // Buscar por autor
    List<News> findByAutorIdOrderByFechaCreacionDesc(Long autorId);

    // Noticias más vistas
    @Query("SELECT n FROM News n WHERE n.publicada = true ORDER BY n.visitas DESC")
    List<News> findMostViewedNews();

    // Buscar por título o contenido
    @Query("SELECT n FROM News n WHERE n.publicada = true AND (LOWER(n.titulo) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(n.contenido) LIKE LOWER(CONCAT('%', :query, '%'))) ORDER BY n.fechaPublicacion DESC")
    List<News> searchNews(@Param("query") String query);

    // Noticias recientes (últimos 7 días)
    @Query("SELECT n FROM News n WHERE n.publicada = true AND n.fechaPublicacion >= :fecha ORDER BY n.fechaPublicacion DESC")
    List<News> findRecentNews(@Param("fecha") LocalDateTime fecha);

    // Incrementar visitas
    @Modifying
    @Query("UPDATE News n SET n.visitas = n.visitas + 1 WHERE n.id = :id")
    void incrementVisits(@Param("id") Long id);

    // Contar noticias por autor
    @Query("SELECT COUNT(n) FROM News n WHERE n.autor.id = :autorId AND n.publicada = true")
    Long countPublishedByAuthor(@Param("autorId") Long autorId);
}