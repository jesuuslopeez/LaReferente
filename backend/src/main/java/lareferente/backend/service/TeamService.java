package lareferente.backend.service;

import lareferente.backend.dto.TeamDTO;
import lareferente.backend.model.Competition;
import lareferente.backend.model.Team;
import lareferente.backend.repository.CompetitionRepository;
import lareferente.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private CompetitionRepository competitionRepository;

    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TeamDTO> getActiveTeams() {
        return teamRepository.findByActivoTrueOrderByNombreAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TeamDTO getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));
        return convertToDTO(team);
    }

    @Transactional
    public TeamDTO createTeam(TeamDTO teamDTO) {
        Team team = new Team();
        team.setNombre(teamDTO.getNombre());
        team.setNombreCompleto(teamDTO.getNombreCompleto());
        team.setCategoria(teamDTO.getCategoria() != null ? teamDTO.getCategoria() : lareferente.backend.enums.AgeCategory.SENIOR);
        team.setLetra(teamDTO.getLetra());
        team.setPais(teamDTO.getPais());
        team.setCiudad(teamDTO.getCiudad());
        team.setEstadio(teamDTO.getEstadio());
        team.setFundacion(teamDTO.getFundacion());
        team.setLogoUrl(teamDTO.getLogoUrl());
        team.setDescripcion(teamDTO.getDescripcion());
        team.setActivo(true);

        // Asignar competiciones si se proporcionan
        if (teamDTO.getCompeticionIds() != null && !teamDTO.getCompeticionIds().isEmpty()) {
            List<Competition> competiciones = competitionRepository.findAllById(teamDTO.getCompeticionIds());
            team.setCompeticiones(new HashSet<>(competiciones));
        }

        Team savedTeam = teamRepository.save(team);
        return convertToDTO(savedTeam);
    }

    @Transactional
    public TeamDTO updateTeam(Long id, TeamDTO teamDTO) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));

        team.setNombre(teamDTO.getNombre());
        team.setNombreCompleto(teamDTO.getNombreCompleto());
        team.setCategoria(teamDTO.getCategoria() != null ? teamDTO.getCategoria() : team.getCategoria());
        team.setLetra(teamDTO.getLetra());
        team.setPais(teamDTO.getPais());
        team.setCiudad(teamDTO.getCiudad());
        team.setEstadio(teamDTO.getEstadio());
        team.setFundacion(teamDTO.getFundacion());
        team.setLogoUrl(teamDTO.getLogoUrl());
        team.setDescripcion(teamDTO.getDescripcion());

        // Actualizar competiciones si se proporcionan
        if (teamDTO.getCompeticionIds() != null) {
            List<Competition> competiciones = competitionRepository.findAllById(teamDTO.getCompeticionIds());
            team.setCompeticiones(new HashSet<>(competiciones));
        }

        Team updatedTeam = teamRepository.save(team);
        return convertToDTO(updatedTeam);
    }

    public void deleteTeam(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));
        team.setActivo(false);
        teamRepository.save(team);
    }

    public List<TeamDTO> searchByNameAndCategoria(String nombre, lareferente.backend.enums.AgeCategory categoria) {
        if (nombre == null || nombre.trim().isEmpty()) {
            return teamRepository.findByCategoria(categoria).stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        }
        return teamRepository.searchByNameAndCategoria(nombre.trim(), categoria).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TeamDTO convertToDTO(Team team) {
        TeamDTO dto = new TeamDTO();
        dto.setId(team.getId());
        dto.setNombre(team.getNombre());
        dto.setNombreCompleto(team.getNombreCompleto());
        dto.setCategoria(team.getCategoria());
        dto.setLetra(team.getLetra());
        dto.setPais(team.getPais());
        dto.setCiudad(team.getCiudad());
        dto.setEstadio(team.getEstadio());
        dto.setFundacion(team.getFundacion());
        dto.setLogoUrl(team.getLogoUrl());
        dto.setDescripcion(team.getDescripcion());
        dto.setActivo(team.getActivo());
        // Incluir IDs de competiciones
        if (team.getCompeticiones() != null) {
            dto.setCompeticionIds(team.getCompeticiones().stream()
                    .map(Competition::getId)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
