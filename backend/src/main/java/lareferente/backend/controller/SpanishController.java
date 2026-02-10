package lareferente.backend.controller;

import lareferente.backend.dto.PlayerDTO;
import lareferente.backend.service.SpanishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spanish")
public class SpanishController {

    @Autowired
    private SpanishService spanishService;

    @GetMapping("/players")
    public ResponseEntity<List<PlayerDTO>> getSpanishPlayers() {
        return ResponseEntity.ok(spanishService.getSpanishPlayers());
    }
}
