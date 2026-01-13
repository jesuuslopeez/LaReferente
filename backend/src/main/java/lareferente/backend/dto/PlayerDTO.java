package lareferente.backend.dto;

import lareferente.backend.enums.AgeCategory;
import lareferente.backend.enums.PlayerPosition;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayerDTO {
    private Long id;
    private String nombre;
    private String apellidos;
    private LocalDate fechaNacimiento;
    private Integer edad;
    private String nacionalidad;
    private PlayerPosition posicion;
    private AgeCategory categoria;
    private Integer dorsal;
    private BigDecimal altura;
    private BigDecimal peso;
    private String fotoUrl;
    private String biografia;
    private Long equipoId;
    private String equipoNombre;
    private Boolean activo;
}