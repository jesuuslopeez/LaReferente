package lareferente.backend.model;

import jakarta.persistence.*;
import lareferente.backend.enums.NewsCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "noticias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(length = 300)
    private String subtitulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Column(name = "imagen_principal_url", length = 500)
    private String imagenPrincipalUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id", nullable = false)
    private User autor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NewsCategory categoria = NewsCategory.NOTICIA;

    @Column(nullable = false)
    private Boolean destacada = false;

    @Column(nullable = false)
    private Boolean publicada = false;

    @Column(name = "fecha_publicacion")
    private LocalDateTime fechaPublicacion;

    @Column(nullable = false)
    private Integer visitas = 0;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
}