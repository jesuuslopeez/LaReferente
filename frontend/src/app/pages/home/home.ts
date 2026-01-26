import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NewsService, TeamService, PlayerService } from '../../core/services';
import { CompetitionService } from '../../services/competition.service';
import { News, Competition, Team, Player } from '../../core/models';

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  link: string;
  linkText: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  private newsService = inject(NewsService);
  private competitionService = inject(CompetitionService);
  private teamService = inject(TeamService);
  private playerService = inject(PlayerService);

  // Hero Slider
  heroSlides: HeroSlide[] = [
    {
      id: 1,
      image: 'assets/images/hero/1.jpg',
      title: 'La Referente',
      subtitle: 'Tu fuente de información sobre fútbol español',
      link: '/noticias',
      linkText: 'Ver noticias',
    },
    {
      id: 2,
      image: 'assets/images/hero/2.jpg',
      title: 'Competiciones',
      subtitle: 'Sigue todas las ligas del fútbol español',
      link: '/competiciones',
      linkText: 'Explorar',
    },
    {
      id: 3,
      image: 'assets/images/hero/3.jpg',
      title: 'Equipos y Jugadores',
      subtitle: 'Conoce a los protagonistas del fútbol español',
      link: '/jugadores',
      linkText: 'Descubrir',
    },
  ];

  currentSlide = signal(0);
  isPaused = signal(false);
  private slideInterval: ReturnType<typeof setInterval> | null = null;

  // Datos destacados
  featuredNews = signal<News[]>([]);
  competitions = signal<Competition[]>([]);
  teams = signal<Team[]>([]);
  players = signal<Player[]>([]);

  // Loading states
  loadingNews = signal(true);
  loadingCompetitions = signal(true);
  loadingTeams = signal(true);
  loadingPlayers = signal(true);

  ngOnInit(): void {
    this.startSlideshow();
    this.loadFeaturedData();
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  private startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  private stopSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  nextSlide(): void {
    this.currentSlide.update(current =>
      current === this.heroSlides.length - 1 ? 0 : current + 1
    );
  }

  prevSlide(): void {
    this.currentSlide.update(current =>
      current === 0 ? this.heroSlides.length - 1 : current - 1
    );
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    // Reset timer when manually changing slides
    this.stopSlideshow();
    this.startSlideshow();
  }

  // Accesibilidad: Botón para pausar/reanudar autoplay
  toggleAutoplay(): void {
    if (this.isPaused()) {
      this.startSlideshow();
      this.isPaused.set(false);
    } else {
      this.stopSlideshow();
      this.isPaused.set(true);
    }
  }

  // Accesibilidad: Navegación con teclado
  onKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        this.prevSlide();
        this.stopSlideshow();
        this.startSlideshow();
        break;
      case 'ArrowRight':
        this.nextSlide();
        this.stopSlideshow();
        this.startSlideshow();
        break;
      case 'Home':
        this.goToSlide(0);
        break;
      case 'End':
        this.goToSlide(this.heroSlides.length - 1);
        break;
    }
  }

  private loadFeaturedData(): void {
    // Cargar noticias destacadas
    this.newsService.getFeatured().subscribe({
      next: (news: News[]) => {
        this.featuredNews.set(news.slice(0, 3));
        this.loadingNews.set(false);
      },
      error: () => this.loadingNews.set(false),
    });

    // Cargar competiciones (aleatorias)
    this.competitionService.obtenerTodas().subscribe({
      next: (competitions: Competition[]) => {
        this.competitions.set(this.shuffleArray(competitions).slice(0, 4));
        this.loadingCompetitions.set(false);
      },
      error: () => this.loadingCompetitions.set(false),
    });

    // Cargar equipos (aleatorios)
    this.teamService.getActive().subscribe({
      next: (teams: Team[]) => {
        this.teams.set(this.shuffleArray(teams).slice(0, 4));
        this.loadingTeams.set(false);
      },
      error: () => this.loadingTeams.set(false),
    });

    // Cargar jugadores (aleatorios)
    this.playerService.getActive().subscribe({
      next: (players: Player[]) => {
        this.players.set(this.shuffleArray(players).slice(0, 6));
        this.loadingPlayers.set(false);
      },
      error: () => this.loadingPlayers.set(false),
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    // Si falla cargar la imagen, usar el placeholder
    img.src = 'assets/images/players/medium/no_cutout.webp';
    // Evitar loop infinito si el placeholder también falla
    img.onerror = null;
  }
}
