import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsService } from '../../core/services';
import { News, RequestState } from '../../core/models';

@Component({
  selector: 'app-news',
  imports: [RouterLink],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class NewsPage implements OnInit {
  private readonly newsService = inject(NewsService);

  // Estado de la petición con loading, error y data
  state = signal<RequestState<News[]>>({
    loading: false,
    error: null,
    data: null,
  });

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.state.set({ loading: true, error: null, data: null });

    this.newsService.getPublished().subscribe({
      next: (noticias) => {
        this.state.set({ loading: false, error: null, data: noticias });
      },
      error: (err) => {
        this.state.set({
          loading: false,
          error: err.message || 'Error al cargar las noticias',
          data: null,
        });
      },
    });
  }

  // Helpers para la plantilla
  get isLoading(): boolean {
    return this.state().loading;
  }

  get hasError(): boolean {
    return !!this.state().error;
  }

  get errorMessage(): string {
    return this.state().error || '';
  }

  get noticias(): News[] {
    return this.state().data || [];
  }

  get isEmpty(): boolean {
    return !this.isLoading && !this.hasError && this.noticias.length === 0;
  }

  get hasData(): boolean {
    return !this.isLoading && !this.hasError && this.noticias.length > 0;
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      FICHAJES: 'Fichajes',
      PARTIDOS: 'Partidos',
      LESIONES: 'Lesiones',
      RUEDAS_PRENSA: 'Ruedas de prensa',
      GENERAL: 'General',
    };
    return labels[category] || category;
  }
}
