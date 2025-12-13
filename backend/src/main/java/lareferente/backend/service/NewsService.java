package lareferente.backend.service;

import lareferente.backend.dto.NewsDTO;
import lareferente.backend.model.News;
import lareferente.backend.model.User;
import lareferente.backend.repository.NewsRepository;
import lareferente.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private UserRepository userRepository;

    public List<NewsDTO> getAllNews() {
        return newsRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NewsDTO> getPublishedNews() {
        return newsRepository.findByPublicadaTrueOrderByFechaPublicacionDesc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<NewsDTO> getFeaturedNews() {
        return newsRepository.findFeaturedNews().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public NewsDTO getNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Noticia no encontrada con ID: " + id));
        return convertToDTO(news);
    }

    @Transactional
    public void incrementViews(Long id) {
        newsRepository.incrementVisits(id);
    }

    public NewsDTO createNews(NewsDTO newsDTO) {
        // Lógica de negocio: el autor debe existir y estar activo
        User autor = userRepository.findById(newsDTO.getAutorId())
                .orElseThrow(() -> new RuntimeException("Usuario autor no encontrado con ID: " + newsDTO.getAutorId()));

        if (!autor.getActivo()) {
            throw new RuntimeException("El usuario autor no está activo");
        }

        News news = new News();
        news.setTitulo(newsDTO.getTitulo());
        news.setSubtitulo(newsDTO.getSubtitulo());
        news.setContenido(newsDTO.getContenido());
        news.setImagenPrincipalUrl(newsDTO.getImagenPrincipalUrl());
        news.setAutor(autor);
        news.setCategoria(newsDTO.getCategoria());
        news.setDestacada(newsDTO.getDestacada() != null ? newsDTO.getDestacada() : false);
        news.setPublicada(newsDTO.getPublicada() != null ? newsDTO.getPublicada() : false);
        news.setVisitas(0);

        if (news.getPublicada() && newsDTO.getFechaPublicacion() == null) {
            news.setFechaPublicacion(LocalDateTime.now());
        }

        News savedNews = newsRepository.save(news);
        return convertToDTO(savedNews);
    }

    public NewsDTO updateNews(Long id, NewsDTO newsDTO) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Noticia no encontrada con ID: " + id));

        news.setTitulo(newsDTO.getTitulo());
        news.setSubtitulo(newsDTO.getSubtitulo());
        news.setContenido(newsDTO.getContenido());
        news.setImagenPrincipalUrl(newsDTO.getImagenPrincipalUrl());
        news.setCategoria(newsDTO.getCategoria());
        news.setDestacada(newsDTO.getDestacada());

        // Lógica de negocio: si se publica por primera vez, establecer fecha
        if (newsDTO.getPublicada() && !news.getPublicada()) {
            news.setFechaPublicacion(LocalDateTime.now());
        }
        news.setPublicada(newsDTO.getPublicada());

        News updatedNews = newsRepository.save(news);
        return convertToDTO(updatedNews);
    }

    public void deleteNews(Long id) {
        newsRepository.deleteById(id);
    }

    private NewsDTO convertToDTO(News news) {
        NewsDTO dto = new NewsDTO();
        dto.setId(news.getId());
        dto.setTitulo(news.getTitulo());
        dto.setSubtitulo(news.getSubtitulo());
        dto.setContenido(news.getContenido());
        dto.setImagenPrincipalUrl(news.getImagenPrincipalUrl());
        dto.setCategoria(news.getCategoria());
        dto.setDestacada(news.getDestacada());
        dto.setPublicada(news.getPublicada());
        dto.setFechaPublicacion(news.getFechaPublicacion());
        dto.setVisitas(news.getVisitas());
        dto.setFechaCreacion(news.getFechaCreacion());
        dto.setFechaModificacion(news.getFechaModificacion());

        if (news.getAutor() != null) {
            dto.setAutorId(news.getAutor().getId());
            dto.setAutorNombre(news.getAutor().getNombre() + " " + news.getAutor().getApellidos());
        }

        return dto;
    }
}
