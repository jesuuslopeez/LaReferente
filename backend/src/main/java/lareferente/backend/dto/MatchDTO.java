package lareferente.backend.dto;

import lareferente.backend.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchDTO {
    private Long id;
    private Long competicionId;
    private String competicionNombre;
    private Long equipoLocalId;
    private String equipoLocalNombre;
    private String equipoLocalLogo;
    private Long equipoVisitanteId;
    private String equipoVisitanteNombre;
    private String equipoVisitanteLogo;
    private LocalDateTime fechaHora;
    private String estadio;
    private Integer jornada;
    private Integer golesLocal;
    private Integer golesVisitante;
    private MatchStatus estado;
    private Integer asistencia;
    private String arbitro;
}