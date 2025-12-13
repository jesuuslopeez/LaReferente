package lareferente.backend.service;

import lareferente.backend.dto.TeamDTO;
import lareferente.backend.model.Team;
import lareferente.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

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

    public TeamDTO createTeam(TeamDTO teamDTO) {
        Team team = new Team();
        team.setNombre(teamDTO.getNombre());
        team.setNombreCompleto(teamDTO.getNombreCompleto());
        team.setPais(teamDTO.getPais());
        team.setCiudad(teamDTO.getCiudad());
        team.setEstadio(teamDTO.getEstadio());
        team.setFundacion(teamDTO.getFundacion());
        team.setLogoUrl(teamDTO.getLogoUrl());
        team.setDescripcion(teamDTO.getDescripcion());
        team.setActivo(true);

        Team savedTeam = teamRepository.save(team);
        return convertToDTO(savedTeam);
    }

    public TeamDTO updateTeam(Long id, TeamDTO teamDTO) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));

        team.setNombre(teamDTO.getNombre());
        team.setNombreCompleto(teamDTO.getNombreCompleto());
        team.setPais(teamDTO.getPais());
        team.setCiudad(teamDTO.getCiudad());
        team.setEstadio(teamDTO.getEstadio());
        team.setFundacion(teamDTO.getFundacion());
        team.setLogoUrl(teamDTO.getLogoUrl());
        team.setDescripcion(teamDTO.getDescripcion());

        Team updatedTeam = teamRepository.save(team);
        return convertToDTO(updatedTeam);
    }

    public void deleteTeam(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));
        team.setActivo(false);
        teamRepository.save(team);
    }

    private TeamDTO convertToDTO(Team team) {
        TeamDTO dto = new TeamDTO();
        dto.setId(team.getId());
        dto.setNombre(team.getNombre());
        dto.setNombreCompleto(team.getNombreCompleto());
        dto.setPais(team.getPais());
        dto.setCiudad(team.getCiudad());
        dto.setEstadio(team.getEstadio());
        dto.setFundacion(team.getFundacion());
        dto.setLogoUrl(team.getLogoUrl());
        dto.setDescripcion(team.getDescripcion());
        dto.setActivo(team.getActivo());
        return dto;
    }
}
