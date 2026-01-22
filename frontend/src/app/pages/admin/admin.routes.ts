import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: 'noticias/nueva',
    loadComponent: () => import('./news-create/news-create').then(m => m.NewsCreate)
  },
  {
    path: 'competiciones/nueva',
    loadComponent: () => import('./competition-create/competition-create').then(m => m.CompetitionCreate)
  },
  {
    path: 'equipos/nuevo',
    loadComponent: () => import('./team-create/team-create').then(m => m.TeamCreate)
  },
  {
    path: 'jugadores/nuevo',
    loadComponent: () => import('./player-create/player-create').then(m => m.PlayerCreate)
  },
  {
    path: 'encuentros/nuevo',
    loadComponent: () => import('./match-create/match-create').then(m => m.MatchCreate)
  },
];
