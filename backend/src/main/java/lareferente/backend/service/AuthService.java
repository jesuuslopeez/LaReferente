package lareferente.backend.service;

import lareferente.backend.dto.LoginRequestDTO;
import lareferente.backend.dto.LoginResponseDTO;
import lareferente.backend.dto.RegisterRequestDTO;
import lareferente.backend.enums.UserRole;
import lareferente.backend.model.User;
import lareferente.backend.repository.UserRepository;
import lareferente.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!user.getActivo()) {
            throw new RuntimeException("Usuario inactivo");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // Actualizar última conexión
        user.setUltimaConexion(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRol().name());

        return new LoginResponseDTO(
                token,
                user.getEmail(),
                user.getNombre() + " " + user.getApellidos(),
                user.getRol().name()
        );
    }

    public LoginResponseDTO register(RegisterRequestDTO registerRequest) {
        // Verificar que el email no esté en uso
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setNombre(registerRequest.getNombre());
        user.setApellidos(registerRequest.getApellidos());
        user.setRol(UserRole.USER); // Por defecto todos son USER
        user.setActivo(true);

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRol().name());

        return new LoginResponseDTO(
                token,
                savedUser.getEmail(),
                savedUser.getNombre() + " " + savedUser.getApellidos(),
                savedUser.getRol().name()
        );
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
