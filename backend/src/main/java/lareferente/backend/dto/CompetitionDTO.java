package lareferente.backend.dto;

import lareferente.backend.enums.CompetitionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompetitionDTO {
    private Long id;
    private String nombre;
    private String nombreCompleto;
    private String pais;
    private CompetitionType tipo;
    private String temporada;
    private String logoUrl;
    private String descripcion;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Boolean activa;
}