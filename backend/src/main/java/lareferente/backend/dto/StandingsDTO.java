package lareferente.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandingsDTO {
    private Long id;
    private Long competicionId;
    private String competicionNombre;
    private Long equipoId;
    private String equipoNombre;
    private String equipoLogo;
    private Integer posicion;
    private Integer partidosJugados;
    private Integer victorias;
    private Integer empates;
    private Integer derrotas;
    private Integer golesFavor;
    private Integer golesContra;
    private Integer diferenciaGoles;
    private Integer puntos;
}