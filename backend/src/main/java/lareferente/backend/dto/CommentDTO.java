package lareferente.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private Long noticiaId;
    private String noticiaTitulo;
    private Long usuarioId;
    private String usuarioNombre;
    private String contenido;
    private Boolean aprobado;
    private LocalDateTime fechaCreacion;
}