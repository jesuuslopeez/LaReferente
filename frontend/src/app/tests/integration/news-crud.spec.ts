import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NewsService } from '../../core/services/news.service';
import { News, CreateNewsDto } from '../../core/models/news.model';

/**
 * Tests de integración del flujo CRUD de noticias
 * Prueba el flujo completo: listar -> crear -> actualizar -> eliminar
 */
describe('News CRUD Integration', () => {
  let newsService: NewsService;
  let httpMock: HttpTestingController;

  const mockNews: News = {
    id: 1,
    titulo: 'Noticia de prueba',
    subtitulo: 'Subtítulo de la noticia',
    contenido: 'Contenido completo de la noticia de prueba...',
    imagenPrincipalUrl: 'https://example.com/image.jpg',
    autorId: 1,
    autorNombre: 'Admin',
    categoria: 'FICHAJES',
    fechaPublicacion: '2024-01-15',
    publicada: true,
    destacada: false,
    visitas: 100,
    fechaCreacion: '2024-01-10',
    fechaModificacion: null
  };

  const mockNewsList: News[] = [
    mockNews,
    {
      id: 2,
      titulo: 'Segunda noticia',
      subtitulo: 'Otro subtítulo',
      contenido: 'Más contenido',
      imagenPrincipalUrl: null,
      autorId: 1,
      autorNombre: 'Admin',
      categoria: 'PARTIDOS',
      fechaPublicacion: '2024-01-14',
      publicada: true,
      destacada: true,
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

    newsService = TestBed.inject(NewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Flujo de Listado', () => {
    it('debe obtener todas las noticias', () => {
      let resultado: News[] = [];

      newsService.getAll().subscribe(news => {
        resultado = news;
      });

      const req = httpMock.expectOne('/api/news');
      expect(req.request.method).toBe('GET');
      req.flush(mockNewsList);

      expect(resultado.length).toBe(2);
      expect(resultado[0].titulo).toBe('Noticia de prueba');
    });

    it('debe obtener solo noticias publicadas', () => {
      let resultado: News[] = [];

      newsService.getPublished().subscribe(news => {
        resultado = news;
      });

      const req = httpMock.expectOne('/api/news/published');
      expect(req.request.method).toBe('GET');
      req.flush(mockNewsList);

      expect(resultado.every(n => n.publicada)).toBe(true);
    });

    it('debe obtener noticias destacadas', () => {
      const featuredNews = mockNewsList.filter(n => n.destacada);
      let resultado: News[] = [];

      newsService.getFeatured().subscribe(news => {
        resultado = news;
      });

      const req = httpMock.expectOne('/api/news/featured');
      req.flush(featuredNews);

      expect(resultado.length).toBe(1);
      expect(resultado[0].destacada).toBe(true);
    });
  });

  describe('Flujo de Creación', () => {
    it('debe crear una noticia nueva', () => {
      const newNews: CreateNewsDto = {
        titulo: 'Nueva noticia',
        contenido: 'Contenido de la nueva noticia',
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
        fechaPublicacion: null,
        publicada: false,
        destacada: false,
        visitas: 0,
        fechaCreacion: '2024-01-16',
        fechaModificacion: null
      };

      let resultado: News | undefined;

      newsService.create(newNews).subscribe(news => {
        resultado = news;
      });

      const req = httpMock.expectOne('/api/news');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newNews);
      req.flush(createdNews);

      expect(resultado?.id).toBe(3);
      expect(resultado?.titulo).toBe('Nueva noticia');
      expect(resultado?.publicada).toBe(false);
    });
  });

  describe('Flujo de Actualización', () => {
    it('debe actualizar una noticia existente', () => {
      const updates = {
        titulo: 'Título actualizado',
        destacada: true
      };

      const updatedNews: News = {
        ...mockNews,
        titulo: 'Título actualizado',
        destacada: true,
        fechaModificacion: '2024-01-16'
      };

      let resultado: News | undefined;

      newsService.update(1, updates).subscribe(news => {
        resultado = news;
      });

      const req = httpMock.expectOne('/api/news/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updates);
      req.flush(updatedNews);

      expect(resultado?.titulo).toBe('Título actualizado');
      expect(resultado?.destacada).toBe(true);
      expect(resultado?.fechaModificacion).toBeTruthy();
    });
  });

  describe('Flujo de Eliminación', () => {
    it('debe eliminar una noticia', () => {
      let deleted = false;

      newsService.delete(1).subscribe(() => {
        deleted = true;
      });

      const req = httpMock.expectOne('/api/news/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(deleted).toBe(true);
    });
  });

  describe('Flujo de Detalles', () => {
    it('debe obtener noticia por ID', () => {
      let resultado: News | undefined;

      newsService.getById(1).subscribe(news => {
        resultado = news;
      });

      const req = httpMock.expectOne('/api/news/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockNews);

      expect(resultado?.id).toBe(1);
      expect(resultado?.titulo).toBe('Noticia de prueba');
    });

    it('debe incrementar visitas de una noticia', () => {
      let success = false;

      newsService.incrementViews(1).subscribe(() => {
        success = true;
      });

      const req = httpMock.expectOne('/api/news/1/view');
      expect(req.request.method).toBe('POST');
      req.flush(null);

      expect(success).toBe(true);
    });
  });

  describe('Flujo Completo CRUD', () => {
    it('debe realizar ciclo completo: crear, leer, actualizar, eliminar', () => {
      // 1. CREAR
      const newNews: CreateNewsDto = {
        titulo: 'Noticia CRUD Test',
        contenido: 'Contenido de prueba',
        autorId: 1,
        categoria: 'GENERAL'
      };

      const createdNews: News = {
        id: 10,
        titulo: newNews.titulo,
        contenido: newNews.contenido,
        autorId: newNews.autorId,
        categoria: newNews.categoria,
        subtitulo: '',
        imagenPrincipalUrl: null,
        autorNombre: 'Admin',
        fechaPublicacion: null,
        publicada: false,
        destacada: false,
        visitas: 0,
        fechaCreacion: '2024-01-16',
        fechaModificacion: null
      };

      let newsId = 0;

      newsService.create(newNews).subscribe(news => {
        newsId = news.id;
      });

      httpMock.expectOne('/api/news').flush(createdNews);
      expect(newsId).toBe(10);

      // 2. LEER
      let readNews: News | undefined;

      newsService.getById(10).subscribe(news => {
        readNews = news;
      });

      httpMock.expectOne('/api/news/10').flush(createdNews);
      expect(readNews?.titulo).toBe('Noticia CRUD Test');

      // 3. ACTUALIZAR
      let updatedNews: News | undefined;
      const updates = { titulo: 'Título Modificado' };

      newsService.update(10, updates).subscribe(news => {
        updatedNews = news;
      });

      httpMock.expectOne('/api/news/10').flush({
        ...createdNews,
        titulo: 'Título Modificado'
      });
      expect(updatedNews?.titulo).toBe('Título Modificado');

      // 4. ELIMINAR
      let deleted = false;

      newsService.delete(10).subscribe(() => {
        deleted = true;
      });

      httpMock.expectOne('/api/news/10').flush(null);
      expect(deleted).toBe(true);
    });
  });
});
