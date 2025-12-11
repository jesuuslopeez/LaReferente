package lareferente.backend.dto;

import lareferente.backend.enums.NewsCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsDTO {
    private Long id;
    private String titulo;
    private String subtitulo;
    private String contenido;
    private String imagenPrincipalUrl;
    private Long autorId;
    private String autorNombre;
    private NewsCategory categoria;
    private Boolean destacada;
    private Boolean publicada;
    private LocalDateTime fechaPublicacion;
    private Integer visitas;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
}