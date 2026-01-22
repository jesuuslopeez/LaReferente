import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth.guard';
import { editorGuard } from './guards/editor.guard';
import { competitionResolver } from './resolvers/competition.resolver';

export const routes: Routes = [
  // Inicio (eager loading - necesario para first paint)
  {
    path: '',
    component: Home,
  },

  // Login (eager - es pequeño y se usa frecuentemente)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },

  // Style Guide (lazy - solo desarrollo)
  {
    path: 'style-guide',
    loadComponent: () => import('./pages/style-guide/style-guide').then(m => m.StyleGuide),
  },

  // DWEC (lazy - solo demostración)
  {
    path: 'dwec',
    loadComponent: () => import('./pages/dwec/dwec').then(m => m.Dwec),
  },

  // Noticias (lazy loading con preload - sección popular)
  {
    path: 'noticias',
    data: { preload: true },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/news/news').then(m => m.NewsPage),
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/news-detail/news-detail').then(m => m.NewsDetail),
      },
    ],
  },

  // Equipos (lazy loading con preload - sección popular)
  {
    path: 'equipos',
    data: { preload: true },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/teams/teams').then(m => m.Teams),
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/team-detail/team-detail').then(m => m.TeamDetail),
      },
    ],
  },

  // Jugadores (lazy loading con preload - sección popular)
  {
    path: 'jugadores',
    data: { preload: true },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/players/players').then(m => m.Players),
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/player-detail/player-detail').then(m => m.PlayerDetail),
      },
    ],
  },

  // Calendario (lazy loading)
  {
    path: 'calendario',
    loadComponent: () => import('./pages/calendar/calendar').then(m => m.Calendar),
  },

  // Búsqueda (lazy loading)
  {
    path: 'buscar',
    loadComponent: () => import('./pages/search/search').then(m => m.SearchPage),
  },

  // Competiciones (lazy loading)
  {
    path: 'competiciones',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/competitions/competitions').then(m => m.Competitions),
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/competition-detail/competition-detail').then(m => m.CompetitionDetail),
        resolve: { competicion: competitionResolver },
      },
    ],
  },

  // Area de usuario (lazy loading + guard)
  {
    path: 'usuario',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/user/user.routes').then((m) => m.userRoutes),
  },

  // Admin (lazy loading + guard)
  {
    path: 'admin',
    canActivate: [editorGuard],
    children: [
      {
        path: 'noticias/nueva',
        loadComponent: () => import('./pages/admin/news-create/news-create').then(m => m.NewsCreate)
      },
      {
        path: 'competiciones/nueva',
        loadComponent: () => import('./pages/admin/competition-create/competition-create').then(m => m.CompetitionCreate)
      },
      {
        path: 'equipos/nuevo',
        loadComponent: () => import('./pages/admin/team-create/team-create').then(m => m.TeamCreate)
      },
      {
        path: 'jugadores/nuevo',
        loadComponent: () => import('./pages/admin/player-create/player-create').then(m => m.PlayerCreate)
      },
      {
        path: 'encuentros/nuevo',
        loadComponent: () => import('./pages/admin/match-create/match-create').then(m => m.MatchCreate)
      },
    ],
  },

  // 404 (lazy loading)
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFound),
  },

  // Wildcard - redirige a 404
  {
    path: '**',
    redirectTo: '404',
  },
];
