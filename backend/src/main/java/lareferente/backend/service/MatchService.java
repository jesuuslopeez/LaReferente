package lareferente.backend.service;

import lareferente.backend.dto.MatchDTO;
import lareferente.backend.model.Competition;
import lareferente.backend.model.Match;
import lareferente.backend.model.Team;
import lareferente.backend.repository.CompetitionRepository;
import lareferente.backend.repository.MatchRepository;
import lareferente.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private CompetitionRepository competitionRepository;

    public List<MatchDTO> getAllMatches() {
        return matchRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MatchDTO> getUpcomingMatches() {
        return matchRepository.findUpcomingMatches(LocalDateTime.now()).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MatchDTO> getMatchesByCompetition(Long competitionId) {
        return matchRepository.findByCompeticionIdOrderByFechaHoraAsc(competitionId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MatchDTO getMatchById(Long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado con ID: " + id));
        return convertToDTO(match);
    }

    public MatchDTO createMatch(MatchDTO matchDTO) {
        // Lógica de negocio: verificar que los equipos existen
        Team equipoLocal = teamRepository.findById(matchDTO.getEquipoLocalId())
                .orElseThrow(() -> new RuntimeException("Equipo local no encontrado con ID: " + matchDTO.getEquipoLocalId()));

        Team equipoVisitante = teamRepository.findById(matchDTO.getEquipoVisitanteId())
                .orElseThrow(() -> new RuntimeException("Equipo visitante no encontrado con ID: " + matchDTO.getEquipoVisitanteId()));

        // Lógica de negocio: un equipo no puede jugar contra sí mismo
        if (matchDTO.getEquipoLocalId().equals(matchDTO.getEquipoVisitanteId())) {
            throw new RuntimeException("Un equipo no puede jugar contra sí mismo");
        }

        Competition competition = competitionRepository.findById(matchDTO.getCompeticionId())
                .orElseThrow(() -> new RuntimeException("Competición no encontrada con ID: " + matchDTO.getCompeticionId()));

        Match match = new Match();
        match.setCompeticion(competition);
        match.setEquipoLocal(equipoLocal);
        match.setEquipoVisitante(equipoVisitante);
        match.setFechaHora(matchDTO.getFechaHora());
        match.setEstadio(matchDTO.getEstadio());
        match.setJornada(matchDTO.getJornada());
        match.setGolesLocal(matchDTO.getGolesLocal() != null ? matchDTO.getGolesLocal() : 0);
        match.setGolesVisitante(matchDTO.getGolesVisitante() != null ? matchDTO.getGolesVisitante() : 0);
        match.setEstado(matchDTO.getEstado());
        match.setAsistencia(matchDTO.getAsistencia());
        match.setArbitro(matchDTO.getArbitro());

        Match savedMatch = matchRepository.save(match);
        return convertToDTO(savedMatch);
    }

    public MatchDTO updateMatch(Long id, MatchDTO matchDTO) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Partido no encontrado con ID: " + id));

        // Lógica de negocio: si se cambian los equipos, validar
        if (matchDTO.getEquipoLocalId() != null && matchDTO.getEquipoVisitanteId() != null) {
            if (matchDTO.getEquipoLocalId().equals(matchDTO.getEquipoVisitanteId())) {
                throw new RuntimeException("Un equipo no puede jugar contra sí mismo");
            }

            Team equipoLocal = teamRepository.findById(matchDTO.getEquipoLocalId())
                    .orElseThrow(() -> new RuntimeException("Equipo local no encontrado"));
            Team equipoVisitante = teamRepository.findById(matchDTO.getEquipoVisitanteId())
                    .orElseThrow(() -> new RuntimeException("Equipo visitante no encontrado"));

            match.setEquipoLocal(equipoLocal);
            match.setEquipoVisitante(equipoVisitante);
        }

        match.setFechaHora(matchDTO.getFechaHora());
        match.setEstadio(matchDTO.getEstadio());
        match.setJornada(matchDTO.getJornada());
        match.setGolesLocal(matchDTO.getGolesLocal());
        match.setGolesVisitante(matchDTO.getGolesVisitante());
        match.setEstado(matchDTO.getEstado());
        match.setAsistencia(matchDTO.getAsistencia());
        match.setArbitro(matchDTO.getArbitro());

        Match updatedMatch = matchRepository.save(match);
        return convertToDTO(updatedMatch);
    }

    public void deleteMatch(Long id) {
        matchRepository.deleteById(id);
    }

    private MatchDTO convertToDTO(Match match) {
        MatchDTO dto = new MatchDTO();
        dto.setId(match.getId());
        dto.setFechaHora(match.getFechaHora());
        dto.setEstadio(match.getEstadio());
        dto.setJornada(match.getJornada());
        dto.setGolesLocal(match.getGolesLocal());
        dto.setGolesVisitante(match.getGolesVisitante());
        dto.setEstado(match.getEstado());
        dto.setAsistencia(match.getAsistencia());
        dto.setArbitro(match.getArbitro());

        if (match.getCompeticion() != null) {
            dto.setCompeticionId(match.getCompeticion().getId());
            dto.setCompeticionNombre(match.getCompeticion().getNombre());
        }

        if (match.getEquipoLocal() != null) {
            dto.setEquipoLocalId(match.getEquipoLocal().getId());
            dto.setEquipoLocalNombre(match.getEquipoLocal().getNombre());
            dto.setEquipoLocalLogo(match.getEquipoLocal().getLogoUrl());
        }

        if (match.getEquipoVisitante() != null) {
            dto.setEquipoVisitanteId(match.getEquipoVisitante().getId());
            dto.setEquipoVisitanteNombre(match.getEquipoVisitante().getNombre());
            dto.setEquipoVisitanteLogo(match.getEquipoVisitante().getLogoUrl());
        }

        return dto;
    }
}
