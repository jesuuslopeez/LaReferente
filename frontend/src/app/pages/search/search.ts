import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { NewsService, TeamService, PlayerService } from '../../core/services';
import { News, Team, Player } from '../../core/models';

@Component({
  selector: 'app-search',
  imports: [RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class SearchPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly newsService = inject(NewsService);
  private readonly teamService = inject(TeamService);
  private readonly playerService = inject(PlayerService);

  query = signal('');
  loading = signal(true);

  noticias = signal<News[]>([]);
  equipos = signal<Team[]>([]);
  jugadores = signal<Player[]>([]);

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const q = params['q'] || '';
        this.query.set(q);
        if (q) {
          this.search(q);
        } else {
          this.loading.set(false);
        }
      });
  }

  private search(query: string): void {
    this.loading.set(true);
    const texto = query.toLowerCase().trim();

    forkJoin({
      noticias: this.newsService.getPublished(),
      equipos: this.teamService.getActive(),
      jugadores: this.playerService.getActive(),
    }).subscribe({
      next: ({ noticias, equipos, jugadores }) => {
        // Filtrar noticias
        this.noticias.set(
          noticias
            .filter(
              (n) =>
                n.titulo.toLowerCase().includes(texto) ||
                (n.subtitulo && n.subtitulo.toLowerCase().includes(texto))
            )
            .slice(0, 6)
        );

        // Filtrar equipos
        this.equipos.set(
          equipos
            .filter(
              (e) =>
                e.nombre.toLowerCase().includes(texto) ||
                e.nombreCompleto.toLowerCase().includes(texto) ||
                e.ciudad.toLowerCase().includes(texto)
            )
            .slice(0, 6)
        );

        // Filtrar jugadores
        this.jugadores.set(
          jugadores
            .filter((j) => {
              const nombreCompleto = `${j.nombre} ${j.apellidos}`.toLowerCase();
              return (
                nombreCompleto.includes(texto) ||
                j.nombre.toLowerCase().includes(texto) ||
                j.apellidos.toLowerCase().includes(texto) ||
                (j.equipoNombre && j.equipoNombre.toLowerCase().includes(texto))
              );
            })
            .slice(0, 6)
        );

        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  get totalResultados(): number {
    return this.noticias().length + this.equipos().length + this.jugadores().length;
  }

  get hayResultados(): boolean {
    return this.totalResultados > 0;
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  }
}
