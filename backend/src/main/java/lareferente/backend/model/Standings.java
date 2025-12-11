package lareferente.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "clasificaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Standings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competicion_id", nullable = false)
    private Competition competicion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipo_id", nullable = false)
    private Team equipo;

    @Column(nullable = false)
    private Integer posicion;

    @Column(name = "partidos_jugados", nullable = false)
    private Integer partidosJugados = 0;

    @Column(nullable = false)
    private Integer victorias = 0;

    @Column(nullable = false)
    private Integer empates = 0;

    @Column(nullable = false)
    private Integer derrotas = 0;

    @Column(name = "goles_favor", nullable = false)
    private Integer golesFavor = 0;

    @Column(name = "goles_contra", nullable = false)
    private Integer golesContra = 0;

    @Column(nullable = false)
    private Integer puntos = 0;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
}