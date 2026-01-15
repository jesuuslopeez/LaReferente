import { Component, inject, signal, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsService } from '../../core/services';
import { AuthService } from '../../services/auth.service';
import { News, NewsCategory, UpdateNewsDto } from '../../core/models';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [RouterLink, FormsModule],
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

  // Estado del modal de edición
  showEditModal = signal(false);
  closingModal = signal(false);
  saving = signal(false);
  saveError = signal<string | null>(null);

  // Datos del formulario de edición
  editForm = signal<UpdateNewsDto>({});

  // Opciones para selects
  categorias: { value: NewsCategory; label: string }[] = [
    { value: 'GENERAL', label: 'General' },
    { value: 'FICHAJES', label: 'Fichajes' },
    { value: 'PARTIDOS', label: 'Partidos' },
    { value: 'LESIONES', label: 'Lesiones' },
    { value: 'RUEDAS_PRENSA', label: 'Ruedas de prensa' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadNews(+id);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showEditModal() && !this.closingModal()) {
      this.closeEditModal();
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

  openEditModal(): void {
    const n = this.noticia();
    if (!n) return;

    this.editForm.set({
      titulo: n.titulo,
      subtitulo: n.subtitulo ?? undefined,
      contenido: n.contenido,
      imagenPrincipalUrl: n.imagenPrincipalUrl ?? undefined,
      categoria: n.categoria,
      destacada: n.destacada,
      publicada: n.publicada,
    });
    this.saveError.set(null);
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.closingModal.set(true);
    setTimeout(() => {
      this.showEditModal.set(false);
      this.closingModal.set(false);
    }, 300);
  }

  updateFormField(field: keyof UpdateNewsDto, value: any): void {
    this.editForm.update(form => ({ ...form, [field]: value }));
  }

  saveNews(): void {
    const n = this.noticia();
    if (!n) return;

    this.saving.set(true);
    this.saveError.set(null);

    this.newsService.update(n.id, this.editForm()).subscribe({
      next: (updatedNews) => {
        this.noticia.set(updatedNews);
        this.saving.set(false);
        this.showEditModal.set(false);
        this.closingModal.set(false);
      },
      error: () => {
        this.saveError.set('Error al guardar los cambios');
        this.saving.set(false);
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
