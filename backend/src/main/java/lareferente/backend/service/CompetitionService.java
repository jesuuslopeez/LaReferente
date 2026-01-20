package lareferente.backend.service;

import lareferente.backend.dto.CompetitionDTO;
import lareferente.backend.dto.TeamDTO;
import lareferente.backend.model.Competition;
import lareferente.backend.model.Team;
import lareferente.backend.repository.CompetitionRepository;
import lareferente.backend.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompetitionService {

    @Autowired
    private CompetitionRepository competitionRepository;

    @Autowired
    private MatchRepository matchRepository;

    public List<CompetitionDTO> getAllCompetitions() {
        return competitionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CompetitionDTO> getActiveCompetitions() {
        return competitionRepository.findByActivaTrueOrderByNombreAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CompetitionDTO getCompetitionById(Long id) {
        Competition competition = competitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Competición no encontrada con ID: " + id));
        return convertToDTO(competition);
    }

    public CompetitionDTO createCompetition(CompetitionDTO competitionDTO) {
        Competition competition = new Competition();
        competition.setNombre(competitionDTO.getNombre());
        competition.setNombreCompleto(competitionDTO.getNombreCompleto());
        competition.setPais(competitionDTO.getPais());
        competition.setTipo(competitionDTO.getTipo());
        competition.setCategoria(competitionDTO.getCategoria() != null ? competitionDTO.getCategoria() : lareferente.backend.enums.AgeCategory.SENIOR);
        competition.setNumEquipos(competitionDTO.getNumEquipos());
        competition.setTemporada(competitionDTO.getTemporada());
        competition.setLogoUrl(competitionDTO.getLogoUrl());
        competition.setDescripcion(competitionDTO.getDescripcion());
        competition.setFechaInicio(competitionDTO.getFechaInicio());
        competition.setFechaFin(competitionDTO.getFechaFin());
        competition.setActiva(true);

        Competition savedCompetition = competitionRepository.save(competition);
        return convertToDTO(savedCompetition);
    }

    public CompetitionDTO updateCompetition(Long id, CompetitionDTO competitionDTO) {
        Competition competition = competitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Competición no encontrada con ID: " + id));

        competition.setNombre(competitionDTO.getNombre());
        competition.setNombreCompleto(competitionDTO.getNombreCompleto());
        competition.setPais(competitionDTO.getPais());
        competition.setTipo(competitionDTO.getTipo());
        competition.setCategoria(competitionDTO.getCategoria() != null ? competitionDTO.getCategoria() : competition.getCategoria());
        competition.setNumEquipos(competitionDTO.getNumEquipos());
        competition.setTemporada(competitionDTO.getTemporada());
        competition.setLogoUrl(competitionDTO.getLogoUrl());
        competition.setDescripcion(competitionDTO.getDescripcion());
        competition.setFechaInicio(competitionDTO.getFechaInicio());
        competition.setFechaFin(competitionDTO.getFechaFin());

        Competition updatedCompetition = competitionRepository.save(competition);
        return convertToDTO(updatedCompetition);
    }

    public void deleteCompetition(Long id) {
        Competition competition = competitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Competición no encontrada con ID: " + id));
        competition.setActiva(false);
        competitionRepository.save(competition);
    }

    public List<TeamDTO> getTeamsByCompetition(Long competitionId) {
        Competition competition = competitionRepository.findById(competitionId)
                .orElseThrow(() -> new RuntimeException("Competición no encontrada con ID: " + competitionId));

        return competition.getEquipos().stream()
                .map(this::convertTeamToDTO)
                .collect(Collectors.toList());
    }

    private CompetitionDTO convertToDTO(Competition competition) {
        CompetitionDTO dto = new CompetitionDTO();
        dto.setId(competition.getId());
        dto.setNombre(competition.getNombre());
        dto.setNombreCompleto(competition.getNombreCompleto());
        dto.setPais(competition.getPais());
        dto.setTipo(competition.getTipo());
        dto.setCategoria(competition.getCategoria());
        dto.setNumEquipos(competition.getNumEquipos());
        dto.setTemporada(competition.getTemporada());
        dto.setLogoUrl(competition.getLogoUrl());
        dto.setDescripcion(competition.getDescripcion());
        dto.setFechaInicio(competition.getFechaInicio());
        dto.setFechaFin(competition.getFechaFin());
        dto.setActiva(competition.getActiva());
        return dto;
    }

    private TeamDTO convertTeamToDTO(Team team) {
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
        return dto;
    }
}
