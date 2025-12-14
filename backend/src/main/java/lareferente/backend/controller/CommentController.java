package lareferente.backend.controller;

import lareferente.backend.dto.CommentDTO;
import lareferente.backend.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/news/{newsId}")
    public ResponseEntity<List<CommentDTO>> getApprovedCommentsByNews(@PathVariable Long newsId) {
        return ResponseEntity.ok(commentService.getApprovedCommentsByNews(newsId));
    }

    @GetMapping("/news/{newsId}/all")
    public ResponseEntity<List<CommentDTO>> getAllCommentsByNews(@PathVariable Long newsId) {
        return ResponseEntity.ok(commentService.getAllCommentsByNews(newsId));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<CommentDTO>> getPendingComments() {
        return ResponseEntity.ok(commentService.getPendingComments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getCommentById(id));
    }

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO commentDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.createComment(commentDTO));
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<CommentDTO> approveComment(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.approveComment(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
