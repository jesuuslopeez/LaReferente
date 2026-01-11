import { Injectable, inject, signal, computed } from '@angular/core';
import { News, CreateNewsDto, UpdateNewsDto } from '../models';
import { NewsService } from '../services/news.service';

@Injectable({ providedIn: 'root' })
export class NewsStore {
  private readonly newsService = inject(NewsService);

  // Estado privado
  private _noticias = signal<News[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Estado publico de solo lectura
  noticias = this._noticias.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // Computed para estadisticas
  total = computed(() => this._noticias().length);
  destacadas = computed(() => this._noticias().filter(n => n.destacada));
  totalDestacadas = computed(() => this.destacadas().length);

  // Por categoria
  porCategoria = computed(() => {
    const noticias = this._noticias();
    const grupos: Record<string, News[]> = {};

    noticias.forEach(n => {
      if (!grupos[n.categoria]) {
        grupos[n.categoria] = [];
      }
      grupos[n.categoria].push(n);
    });

    return grupos;
  });

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this._loading.set(true);
    this._error.set(null);

    this.newsService.getPublished().subscribe({
      next: (lista) => {
        this._noticias.set(lista);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message || 'Error al cargar noticias');
        this._loading.set(false);
      },
    });
  }

  agregar(dto: CreateNewsDto): void {
    this.newsService.create(dto).subscribe({
      next: (nueva) => {
        this._noticias.update(lista => [...lista, nueva]);
      },
      error: (err) => {
        this._error.set(err.message || 'Error al crear noticia');
      },
    });
  }

  actualizar(id: number, dto: UpdateNewsDto): void {
    this.newsService.update(id, dto).subscribe({
      next: (actualizada) => {
        this._noticias.update(lista =>
          lista.map(n => (n.id === id ? actualizada : n))
        );
      },
      error: (err) => {
        this._error.set(err.message || 'Error al actualizar noticia');
      },
    });
  }

  eliminar(id: number): void {
    this.newsService.delete(id).subscribe({
      next: () => {
        this._noticias.update(lista => lista.filter(n => n.id !== id));
      },
      error: (err) => {
        this._error.set(err.message || 'Error al eliminar noticia');
      },
    });
  }

  // Para actualizar optimisticamente sin esperar al servidor
  agregarLocal(noticia: News): void {
    this._noticias.update(lista => [...lista, noticia]);
  }

  actualizarLocal(noticia: News): void {
    this._noticias.update(lista =>
      lista.map(n => (n.id === noticia.id ? noticia : n))
    );
  }

  eliminarLocal(id: number): void {
    this._noticias.update(lista => lista.filter(n => n.id !== id));
  }
}
