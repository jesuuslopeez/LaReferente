import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NewsService } from './news.service';
import { News, CreateNewsDto } from '../models/news.model';

describe('NewsService', () => {
  let service: NewsService;
  let httpMock: HttpTestingController;

  const mockNews: News = {
    id: 1,
    titulo: 'Barcelona ficha a nuevo jugador',
    subtitulo: 'Gran noticia para los culés',
    contenido: 'Contenido de la noticia...',
    imagenPrincipalUrl: 'https://example.com/img.jpg',
    autorId: 1,
    autorNombre: 'Admin',
    categoria: 'FICHAJES',
    fechaPublicacion: '2024-01-15',
    publicada: true,
    destacada: true,
    visitas: 100,
    fechaCreacion: '2024-01-10',
    fechaModificacion: '2024-01-15'
  };

  const mockNewsList: News[] = [
    mockNews,
    {
      id: 2,
      titulo: 'Resultado del partido',
      subtitulo: 'Empate emocionante',
      contenido: 'Contenido...',
      imagenPrincipalUrl: null,
      autorId: 1,
      autorNombre: 'Admin',
      categoria: 'PARTIDOS',
      fechaPublicacion: '2024-01-14',
      publicada: true,
      destacada: false,
      visitas: 50,
      fechaCreacion: '2024-01-14',
      fechaModificacion: null
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        NewsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(NewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAll', () => {
    it('should return all news', () => {
      service.getAll().subscribe(news => {
        expect(news.length).toBe(2);
        expect(news).toEqual(mockNewsList);
      });

      const req = httpMock.expectOne('/api/news');
      expect(req.request.method).toBe('GET');
      req.flush(mockNewsList);
    });
  });

  describe('getById', () => {
    it('should return news by id', () => {
      service.getById(1).subscribe(news => {
        expect(news).toEqual(mockNews);
      });

      const req = httpMock.expectOne('/api/news/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockNews);
    });
  });

  describe('getPublished', () => {
    it('should return only published news', () => {
      const publishedNews = mockNewsList.filter(n => n.publicada);

      service.getPublished().subscribe(news => {
        expect(news.every(n => n.publicada)).toBe(true);
      });

      const req = httpMock.expectOne('/api/news/published');
      expect(req.request.method).toBe('GET');
      req.flush(publishedNews);
    });
  });

  describe('getFeatured', () => {
    it('should return featured news', () => {
      const featuredNews = [mockNews];

      service.getFeatured().subscribe(news => {
        expect(news.every(n => n.destacada)).toBe(true);
      });

      const req = httpMock.expectOne('/api/news/featured');
      expect(req.request.method).toBe('GET');
      req.flush(featuredNews);
    });
  });

  describe('create', () => {
    it('should create news', () => {
      const newNews: CreateNewsDto = {
        titulo: 'Nueva noticia',
        contenido: 'Contenido de prueba',
        autorId: 1,
        categoria: 'GENERAL'
      };
      const createdNews: News = {
        id: 3,
        titulo: newNews.titulo,
        contenido: newNews.contenido,
        autorId: newNews.autorId,
        categoria: newNews.categoria,
        subtitulo: '',
        imagenPrincipalUrl: null,
        autorNombre: 'Admin',
        destacada: false,
        publicada: false,
        fechaPublicacion: null,
        visitas: 0,
        fechaCreacion: '2024-01-16',
        fechaModificacion: null
      };

      service.create(newNews).subscribe(news => {
        expect(news.id).toBe(3);
        expect(news.titulo).toBe('Nueva noticia');
      });

      const req = httpMock.expectOne('/api/news');
      expect(req.request.method).toBe('POST');
      req.flush(createdNews);
    });
  });

  describe('update', () => {
    it('should update news', () => {
      const updates = { titulo: 'Titulo actualizado' };
      const updatedNews: News = { ...mockNews, titulo: 'Titulo actualizado' };

      service.update(1, updates).subscribe(news => {
        expect(news.titulo).toBe('Titulo actualizado');
      });

      const req = httpMock.expectOne('/api/news/1');
      expect(req.request.method).toBe('PUT');
      req.flush(updatedNews);
    });
  });

  describe('delete', () => {
    it('should delete news', () => {
      service.delete(1).subscribe();

      const req = httpMock.expectOne('/api/news/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('incrementViews', () => {
    it('should increment view count', () => {
      service.incrementViews(1).subscribe();

      const req = httpMock.expectOne('/api/news/1/view');
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });
  });
});
