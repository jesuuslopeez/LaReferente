package lareferente.backend.dto;

import lareferente.backend.enums.AgeCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamDTO {
    private Long id;
    private String nombre;
    private String nombreCompleto;
    private AgeCategory categoria;
    private String letra;
    private String pais;
    private String ciudad;
    private String estadio;
    private Integer fundacion;
    private String logoUrl;
    private String descripcion;
    private Boolean activo;
}