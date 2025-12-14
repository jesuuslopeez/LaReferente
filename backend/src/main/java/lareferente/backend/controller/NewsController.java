package lareferente.backend.controller;

import lareferente.backend.dto.NewsDTO;
import lareferente.backend.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    @GetMapping
    public ResponseEntity<List<NewsDTO>> getAllNews() {
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @GetMapping("/published")
    public ResponseEntity<List<NewsDTO>> getPublishedNews() {
        return ResponseEntity.ok(newsService.getPublishedNews());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<NewsDTO>> getFeaturedNews() {
        return ResponseEntity.ok(newsService.getFeaturedNews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsDTO> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @PostMapping("/{id}/view")
    public ResponseEntity<Void> incrementViews(@PathVariable Long id) {
        newsService.incrementViews(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<NewsDTO> createNews(@RequestBody NewsDTO newsDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(newsService.createNews(newsDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsDTO> updateNews(@PathVariable Long id, @RequestBody NewsDTO newsDTO) {
        return ResponseEntity.ok(newsService.updateNews(id, newsDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}
