package lareferente.backend.dto;

import lareferente.backend.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String nombre;
    private String apellidos;
    private UserRole rol;
    private Boolean activo;
    private LocalDateTime fechaRegistro;
    private LocalDateTime ultimaConexion;
}