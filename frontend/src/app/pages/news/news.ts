import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NewsService } from '../../core/services';
import { News, RequestState } from '../../core/models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-news',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class NewsPage implements OnInit {
  private readonly newsService = inject(NewsService);
  private readonly route = inject(ActivatedRoute);
  protected readonly authService = inject(AuthService);

  // Estado de la petición con loading, error y data
  state = signal<RequestState<News[]>>({
    loading: false,
    error: null,
    data: null,
  });

  // Filtros
  filtroActivo = signal('todas');
  categorias = [
    { valor: 'todas', texto: 'Todas' },
    { valor: 'FICHAJES', texto: 'Fichajes' },
    { valor: 'PARTIDOS', texto: 'Partidos' },
    { valor: 'LESIONES', texto: 'Lesiones' },
    { valor: 'RUEDAS_PRENSA', texto: 'Ruedas de prensa' },
    { valor: 'GENERAL', texto: 'General' },
  ];

  // Búsqueda
  busquedaControl = new FormControl('');
  busqueda = signal('');

  ngOnInit(): void {
    this.loadNews();

    // Búsqueda con debounce manual
    this.busquedaControl.valueChanges.subscribe((valor) => {
      this.busqueda.set(valor || '');
    });

    // Leer parámetro de búsqueda de la URL
    this.route.queryParams.subscribe((params) => {
      const query = params['q'] || '';
      if (query) {
        this.busquedaControl.setValue(query);
        this.busqueda.set(query);
      }
    });
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

  setFiltro(valor: string): void {
    this.filtroActivo.set(valor);
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

  get todasNoticias(): News[] {
    return this.state().data || [];
  }

  get noticias(): News[] {
    const filtro = this.filtroActivo();
    const texto = this.busqueda().toLowerCase().trim();
    let resultado = this.todasNoticias;

    // Filtrar por categoría
    if (filtro !== 'todas') {
      resultado = resultado.filter((n) => n.categoria === filtro);
    }

    // Filtrar por texto de búsqueda
    if (texto) {
      resultado = resultado.filter(
        (n) =>
          n.titulo.toLowerCase().includes(texto) ||
          (n.subtitulo && n.subtitulo.toLowerCase().includes(texto))
      );
    }

    return resultado;
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
