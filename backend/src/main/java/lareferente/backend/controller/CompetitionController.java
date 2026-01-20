package lareferente.backend.controller;

import lareferente.backend.dto.CompetitionDTO;
import lareferente.backend.dto.TeamDTO;
import lareferente.backend.service.CompetitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/competitions")
public class CompetitionController {

    @Autowired
    private CompetitionService competitionService;

    @GetMapping
    public ResponseEntity<List<CompetitionDTO>> getAllCompetitions() {
        return ResponseEntity.ok(competitionService.getAllCompetitions());
    }

    @GetMapping("/active")
    public ResponseEntity<List<CompetitionDTO>> getActiveCompetitions() {
        return ResponseEntity.ok(competitionService.getActiveCompetitions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompetitionDTO> getCompetitionById(@PathVariable Long id) {
        return ResponseEntity.ok(competitionService.getCompetitionById(id));
    }

    @GetMapping("/{id}/teams")
    public ResponseEntity<List<TeamDTO>> getTeamsByCompetition(@PathVariable Long id) {
        return ResponseEntity.ok(competitionService.getTeamsByCompetition(id));
    }

    @PostMapping
    public ResponseEntity<CompetitionDTO> createCompetition(@RequestBody CompetitionDTO competitionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(competitionService.createCompetition(competitionDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompetitionDTO> updateCompetition(@PathVariable Long id, @RequestBody CompetitionDTO competitionDTO) {
        return ResponseEntity.ok(competitionService.updateCompetition(id, competitionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompetition(@PathVariable Long id) {
        competitionService.deleteCompetition(id);
        return ResponseEntity.noContent().build();
    }
}
