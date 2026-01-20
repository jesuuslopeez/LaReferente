package lareferente.backend.model;

import jakarta.persistence.*;
import lareferente.backend.enums.AgeCategory;
import lareferente.backend.enums.CompetitionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "competiciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Competition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(name = "nombre_completo", length = 255)
    private String nombreCompleto;

    @Column(length = 100)
    private String pais;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompetitionType tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgeCategory categoria = AgeCategory.SENIOR;

    @Column(name = "num_equipos")
    private Integer numEquipos;

    @Column(nullable = false, length = 20)
    private String temporada;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(nullable = false)
    private Boolean activa = true;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @ManyToMany(mappedBy = "competiciones")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Team> equipos = new HashSet<>();
}