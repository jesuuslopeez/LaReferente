package lareferente.backend.config;

import lareferente.backend.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos de autenticación
                        .requestMatchers("/api/auth/**").permitAll()
                        // Endpoints públicos de consulta
                        .requestMatchers("/api/teams/active", "/api/teams/{id}").permitAll()
                        .requestMatchers("/api/players/active", "/api/players/{id}", "/api/players/team/{teamId}").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/players/{id}").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/teams/{id}").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/competitions/{id}").permitAll()
                        .requestMatchers("/api/news/published", "/api/news/featured", "/api/news/{id}", "/api/news/{id}/view").permitAll()
                        .requestMatchers("/api/matches/**").permitAll()
                        .requestMatchers("/api/competitions/active", "/api/competitions/{id}", "/api/competitions/{id}/teams").permitAll()
                        .requestMatchers("/api/comments/news/{newsId}").permitAll()
                        .requestMatchers("/api/files/**").permitAll()
                        // Swagger y Actuator
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/api-docs/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        .requestMatchers("/api/spanish/players").authenticated()
                        // Resto requiere autenticación
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(false);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
