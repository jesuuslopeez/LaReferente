package lareferente.backend.repository;

import lareferente.backend.enums.UserRole;
import lareferente.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Buscar por email
    Optional<User> findByEmail(String email);

    // Buscar usuarios activos
    List<User> findByActivoTrue();

    // Buscar por rol
    List<User> findByRol(UserRole rol);

    // Buscar administradores activos
    @Query("SELECT u FROM User u WHERE u.rol = 'ADMIN' AND u.activo = true")
    List<User> findActiveAdmins();

    // Verificar si existe un email
    boolean existsByEmail(String email);

    // Contar usuarios por rol
    @Query("SELECT COUNT(u) FROM User u WHERE u.rol = :rol AND u.activo = true")
    Long countByRoleAndActive(@Param("rol") UserRole rol);
}