package lareferente.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "estadisticas_jugadores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "jugador_id", nullable = false)
    private Player jugador;

    @Column(nullable = false, length = 20)
    private String temporada;

    @Column(name = "partidos_jugados", nullable = false)
    private Integer partidosJugados = 0;

    @Column(name = "partidos_titular", nullable = false)
    private Integer partidosTitular = 0;

    @Column(name = "minutos_jugados", nullable = false)
    private Integer minutosJugados = 0;

    @Column(nullable = false)
    private Integer goles = 0;

    @Column(nullable = false)
    private Integer asistencias = 0;

    @Column(name = "tarjetas_amarillas", nullable = false)
    private Integer tarjetasAmarillas = 0;

    @Column(name = "tarjetas_rojas", nullable = false)
    private Integer tarjetasRojas = 0;

    @UpdateTimestamp
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
}