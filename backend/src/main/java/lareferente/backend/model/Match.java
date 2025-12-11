package lareferente.backend.model;

import jakarta.persistence.*;
import lareferente.backend.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "partidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competicion_id", nullable = false)
    private Competition competicion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipo_local_id", nullable = false)
    private Team equipoLocal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipo_visitante_id", nullable = false)
    private Team equipoVisitante;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora;

    @Column(length = 200)
    private String estadio;

    private Integer jornada;

    @Column(name = "goles_local", nullable = false)
    private Integer golesLocal = 0;

    @Column(name = "goles_visitante", nullable = false)
    private Integer golesVisitante = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus estado = MatchStatus.PROGRAMADO;

    private Integer asistencia;

    @Column(length = 200)
    private String arbitro;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
}