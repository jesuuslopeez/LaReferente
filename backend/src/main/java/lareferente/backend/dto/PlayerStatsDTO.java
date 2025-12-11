package lareferente.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerStatsDTO {
    private Long id;
    private Long jugadorId;
    private String jugadorNombre;
    private String temporada;
    private Integer partidosJugados;
    private Integer partidosTitular;
    private Integer minutosJugados;
    private Integer goles;
    private Integer asistencias;
    private Integer tarjetasAmarillas;
    private Integer tarjetasRojas;
    private Double mediaGoles;
    private Double mediaAsistencias;
}