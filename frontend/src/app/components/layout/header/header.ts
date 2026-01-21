import {
  Component,
  inject,
  computed,
  signal,
  HostListener,
  ElementRef,
  ViewChild,
  DestroyRef,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged, forkJoin, map, of, switchMap } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';
import { AuthService } from '../../../services/auth.service';
import { NewsService, TeamService, PlayerService } from '../../../core/services';
import { News, Team, Player } from '../../../core/models';
import { AccountModal } from '../../shared/account-modal/account-modal';
import { LoginForm } from '../../shared/login-form/login-form';
import { RegisterForm } from '../../shared/register-form/register-form';

interface SearchSuggestion {
  type: 'noticia' | 'equipo' | 'jugador';
  id: number;
  name: string;
  image?: string | null;
  subtitle?: string;
}

/**
 * Componente Header con menu mobile, modales y dropdown de cuenta
 * Demuestra: @HostListener (document:click, document:keydown.escape), ViewChild, ElementRef
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AccountModal, LoginForm, RegisterForm],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly themeService = inject(ThemeService);
  private readonly elementRef = inject(ElementRef);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly newsService = inject(NewsService);
  private readonly teamService = inject(TeamService);
  private readonly playerService = inject(PlayerService);
  protected readonly authService = inject(AuthService);

  protected readonly isDarkMode = computed(() => this.themeService.theme() === 'dark');
  protected readonly accountMenuOpen = signal(false);
  protected readonly showLoginModal = signal(false);
  protected readonly showRegisterModal = signal(false);
  protected readonly mobileMenuOpen = signal(false);
  protected readonly searchDropdownOpen = signal(false);

  // Búsqueda
  protected searchQuery = signal('');
  protected searchFilter = signal('all');
  protected suggestions = signal<SearchSuggestion[]>([]);
  protected showSuggestions = signal(false);
  protected loadingSuggestions = signal(false);
  private searchSubject = new Subject<string>();

  // Cache de datos para sugerencias
  private cachedNews: News[] = [];
  private cachedTeams: Team[] = [];
  private cachedPlayers: Player[] = [];
  private cacheLoaded = false;

  constructor() {
    // Configurar búsqueda con debounce
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (!query || query.length < 2) {
            return of([]);
          }
          return this.searchSuggestions(query);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((suggestions) => {
        this.suggestions.set(suggestions);
        this.loadingSuggestions.set(false);
      });
  }

  private loadCache(): void {
    if (this.cacheLoaded) return;

    forkJoin({
      news: this.newsService.getPublished(),
      teams: this.teamService.getActive(),
      players: this.playerService.getActive(),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ news, teams, players }) => {
          this.cachedNews = news;
          this.cachedTeams = teams;
          this.cachedPlayers = players;
          this.cacheLoaded = true;
        },
      });
  }

  private searchSuggestions(query: string) {
    const texto = query.toLowerCase().trim();
    const filter = this.searchFilter();

    // Si no hay cache, cargar y esperar
    if (!this.cacheLoaded) {
      return forkJoin({
        news: this.newsService.getPublished(),
        teams: this.teamService.getActive(),
        players: this.playerService.getActive(),
      }).pipe(
        map(({ news, teams, players }) => {
          this.cachedNews = news;
          this.cachedTeams = teams;
          this.cachedPlayers = players;
          this.cacheLoaded = true;
          return this.filterSuggestions(texto, filter);
        })
      );
    }

    return of(this.filterSuggestions(texto, filter));
  }

  private filterSuggestions(texto: string, filter: string): SearchSuggestion[] {
    const suggestions: SearchSuggestion[] = [];

    // Noticias
    if (filter === 'all' || filter === 'noticias') {
      const noticias = this.cachedNews
        .filter(
          (n) =>
            n.titulo.toLowerCase().includes(texto) ||
            (n.subtitulo && n.subtitulo.toLowerCase().includes(texto))
        )
        .slice(0, 3)
        .map((n) => ({
          type: 'noticia' as const,
          id: n.id,
          name: n.titulo,
          image: n.imagenPrincipalUrl,
          subtitle: n.subtitulo || undefined,
        }));
      suggestions.push(...noticias);
    }

    // Equipos
    if (filter === 'all' || filter === 'equipos') {
      const equipos = this.cachedTeams
        .filter(
          (e) =>
            e.nombre.toLowerCase().includes(texto) ||
            e.nombreCompleto.toLowerCase().includes(texto) ||
            e.ciudad.toLowerCase().includes(texto)
        )
        .slice(0, 3)
        .map((e) => ({
          type: 'equipo' as const,
          id: e.id,
          name: e.nombre,
          image: e.logoUrl,
          subtitle: e.ciudad,
        }));
      suggestions.push(...equipos);
    }

    // Jugadores
    if (filter === 'all' || filter === 'jugadores') {
      const jugadores = this.cachedPlayers
        .filter((j) => {
          const nombreCompleto = `${j.nombre} ${j.apellidos}`.toLowerCase();
          return (
            nombreCompleto.includes(texto) ||
            j.nombre.toLowerCase().includes(texto) ||
            j.apellidos.toLowerCase().includes(texto) ||
            (j.equipoNombre && j.equipoNombre.toLowerCase().includes(texto))
          );
        })
        .slice(0, 3)
        .map((j) => ({
          type: 'jugador' as const,
          id: j.id,
          name: `${j.nombre} ${j.apellidos}`,
          image: j.fotoUrl,
          subtitle: j.equipoNombre || undefined,
        }));
      suggestions.push(...jugadores);
    }

    return suggestions.slice(0, 8);
  }

  // Referencias al DOM mediante ViewChild
  @ViewChild('hamburgerButton') hamburgerButton!: ElementRef;
  @ViewChild('accountButton') accountButton!: ElementRef;

  // Evento global: cierra menus y modales con click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.accountMenuOpen()) {
      this.accountMenuOpen.set(false);
    }
  }

  // Evento global: cierra menus y modales con tecla ESC
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.mobileMenuOpen()) {
      this.mobileMenuOpen.set(false);
      // Devolver foco al boton hamburguesa
      this.hamburgerButton?.nativeElement?.focus();
    }
    if (this.accountMenuOpen()) {
      this.accountMenuOpen.set(false);
      this.accountButton?.nativeElement?.focus();
    }
    if (this.searchDropdownOpen()) {
      this.searchDropdownOpen.set(false);
    }
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  protected toggleAccountMenu(): void {
    this.accountMenuOpen.update((open) => !open);
  }

  protected openLoginModal(): void {
    this.showLoginModal.set(true);
    this.accountMenuOpen.set(false);
  }

  protected openRegisterModal(): void {
    this.showRegisterModal.set(true);
    this.accountMenuOpen.set(false);
  }

  protected closeLoginModal(): void {
    this.showLoginModal.set(false);
  }

  protected closeRegisterModal(): void {
    this.showRegisterModal.set(false);
  }

  protected switchToRegister(): void {
    this.showLoginModal.set(false);
    this.showRegisterModal.set(true);
  }

  protected switchToLogin(): void {
    this.showRegisterModal.set(false);
    this.showLoginModal.set(true);
  }

  protected onLoginSuccess(): void {
    this.showLoginModal.set(false);
  }

  protected onRegisterSuccess(): void {
    this.showRegisterModal.set(false);
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected toggleSearchDropdown(): void {
    this.searchDropdownOpen.update((open) => !open);
  }

  protected closeSearchDropdown(): void {
    this.searchDropdownOpen.set(false);
  }

  protected cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.accountMenuOpen.set(false);
  }

  protected onSearch(event: Event): void {
    event.preventDefault();
    const query = this.searchQuery().trim();
    if (!query) return;

    const filter = this.searchFilter();
    let route: string;

    switch (filter) {
      case 'noticias':
        route = '/noticias';
        break;
      case 'equipos':
        route = '/equipos';
        break;
      case 'jugadores':
        route = '/jugadores';
        break;
      default:
        route = '/buscar';
        break;
    }

    this.router.navigate([route], { queryParams: { q: query } });
    this.searchQuery.set('');
    this.closeSearchDropdown();
    this.closeMobileMenu();
  }

  protected onSearchQueryChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.searchQuery.set(value);

    if (value.length >= 2) {
      this.loadingSuggestions.set(true);
      this.showSuggestions.set(true);
      this.searchSubject.next(value);
    } else {
      this.suggestions.set([]);
      this.showSuggestions.set(false);
    }
  }

  protected onSearchFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.searchFilter.set(select.value);
    // Volver a buscar con el nuevo filtro
    const query = this.searchQuery();
    if (query.length >= 2) {
      this.searchSubject.next(query);
    }
  }

  protected onSearchFocus(): void {
    this.loadCache();
    if (this.searchQuery().length >= 2 && this.suggestions().length > 0) {
      this.showSuggestions.set(true);
    }
  }

  protected onSearchBlur(): void {
    // Pequeño delay para permitir click en sugerencias
    setTimeout(() => {
      this.showSuggestions.set(false);
    }, 200);
  }

  protected selectSuggestion(suggestion: SearchSuggestion): void {
    let route: string;
    switch (suggestion.type) {
      case 'noticia':
        route = `/noticias/${suggestion.id}`;
        break;
      case 'equipo':
        route = `/equipos/${suggestion.id}`;
        break;
      case 'jugador':
        route = `/jugadores/${suggestion.id}`;
        break;
    }

    this.router.navigate([route]);
    this.searchQuery.set('');
    this.suggestions.set([]);
    this.showSuggestions.set(false);
    this.closeSearchDropdown();
    this.closeMobileMenu();
  }

  protected getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      noticia: 'Noticia',
      equipo: 'Equipo',
      jugador: 'Jugador',
    };
    return labels[type] || type;
  }
}
