package lareferente.backend.service;

import lareferente.backend.dto.CompetitionDTO;
import lareferente.backend.model.Competition;
import lareferente.backend.repository.CompetitionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompetitionService {

    @Autowired
    private CompetitionRepository competitionRepository;

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

    private CompetitionDTO convertToDTO(Competition competition) {
        CompetitionDTO dto = new CompetitionDTO();
        dto.setId(competition.getId());
        dto.setNombre(competition.getNombre());
        dto.setNombreCompleto(competition.getNombreCompleto());
        dto.setPais(competition.getPais());
        dto.setTipo(competition.getTipo());
        dto.setTemporada(competition.getTemporada());
        dto.setLogoUrl(competition.getLogoUrl());
        dto.setDescripcion(competition.getDescripcion());
        dto.setFechaInicio(competition.getFechaInicio());
        dto.setFechaFin(competition.getFechaFin());
        dto.setActiva(competition.getActiva());
        return dto;
    }
}
