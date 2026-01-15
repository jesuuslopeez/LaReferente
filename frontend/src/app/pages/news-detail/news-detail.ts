import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../core/services';
import { AuthService } from '../../services/auth.service';
import { News, NewsCategory } from '../../core/models';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './news-detail.html',
  styleUrl: './news-detail.scss',
})
export class NewsDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private newsService = inject(NewsService);
  authService = inject(AuthService);

  noticia = signal<News | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadNews(+id);
    }
  }

  private loadNews(id: number): void {
    this.newsService.getById(id).subscribe({
      next: (noticia) => {
        this.noticia.set(noticia);
        this.loading.set(false);
        // Incrementar visitas
        this.newsService.incrementViews(id).subscribe();
      },
      error: () => {
        this.error.set('No se pudo cargar la noticia');
        this.loading.set(false);
      },
    });
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  formatDateTime(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getCategoryLabel(category: NewsCategory): string {
    const labels: Record<NewsCategory, string> = {
      FICHAJES: 'Fichajes',
      PARTIDOS: 'Partidos',
      LESIONES: 'Lesiones',
      RUEDAS_PRENSA: 'Ruedas de prensa',
      GENERAL: 'General',
    };
    return labels[category] || category;
  }
}
