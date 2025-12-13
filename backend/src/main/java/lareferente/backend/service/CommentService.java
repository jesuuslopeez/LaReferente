package lareferente.backend.service;

import lareferente.backend.dto.CommentDTO;
import lareferente.backend.model.Comment;
import lareferente.backend.model.News;
import lareferente.backend.model.User;
import lareferente.backend.repository.CommentRepository;
import lareferente.backend.repository.NewsRepository;
import lareferente.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CommentDTO> getApprovedCommentsByNews(Long newsId) {
        return commentRepository.findByNoticiaIdAndAprobadoTrueOrderByFechaCreacionDesc(newsId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CommentDTO> getAllCommentsByNews(Long newsId) {
        return commentRepository.findByNoticiaIdOrderByFechaCreacionDesc(newsId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CommentDTO> getPendingComments() {
        return commentRepository.findPendingComments().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CommentDTO getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado con ID: " + id));
        return convertToDTO(comment);
    }

    public CommentDTO createComment(CommentDTO commentDTO) {
        // Lógica de negocio: verificar que la noticia y el usuario existen
        News news = newsRepository.findById(commentDTO.getNoticiaId())
                .orElseThrow(() -> new RuntimeException("Noticia no encontrada con ID: " + commentDTO.getNoticiaId()));

        User user = userRepository.findById(commentDTO.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + commentDTO.getUsuarioId()));

        // Lógica de negocio: el usuario debe estar activo para comentar
        if (!user.getActivo()) {
            throw new RuntimeException("El usuario no está activo y no puede comentar");
        }

        // Lógica de negocio: solo se puede comentar en noticias publicadas
        if (!news.getPublicada()) {
            throw new RuntimeException("No se puede comentar en una noticia no publicada");
        }

        Comment comment = new Comment();
        comment.setNoticia(news);
        comment.setUsuario(user);
        comment.setContenido(commentDTO.getContenido());
        comment.setAprobado(false); // Los comentarios empiezan sin aprobar

        Comment savedComment = commentRepository.save(comment);
        return convertToDTO(savedComment);
    }

    public CommentDTO approveComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comentario no encontrado con ID: " + id));

        comment.setAprobado(true);
        Comment approvedComment = commentRepository.save(comment);
        return convertToDTO(approvedComment);
    }

    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContenido(comment.getContenido());
        dto.setAprobado(comment.getAprobado());
        dto.setFechaCreacion(comment.getFechaCreacion());

        if (comment.getNoticia() != null) {
            dto.setNoticiaId(comment.getNoticia().getId());
            dto.setNoticiaTitulo(comment.getNoticia().getTitulo());
        }

        if (comment.getUsuario() != null) {
            dto.setUsuarioId(comment.getUsuario().getId());
            dto.setUsuarioNombre(comment.getUsuario().getNombre());
        }

        return dto;
    }
}
