package lareferente.backend.model;

import jakarta.persistence.*;
import lareferente.backend.enums.AgeCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "equipos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(name = "nombre_completo", length = 255)
    private String nombreCompleto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AgeCategory categoria = AgeCategory.SENIOR;

    @Column(length = 5)
    private String letra;

    @Column(nullable = false, length = 100)
    private String pais;

    @Column(length = 150)
    private String ciudad;

    @Column(length = 200)
    private String estadio;

    private Integer fundacion;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @ManyToMany
    @JoinTable(
        name = "equipo_competiciones",
        joinColumns = @JoinColumn(name = "equipo_id"),
        inverseJoinColumns = @JoinColumn(name = "competicion_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<Competition> competiciones = new HashSet<>();
}