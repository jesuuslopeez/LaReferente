import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { NewsPage } from './pages/news/news';
import { NewsDetail } from './pages/news-detail/news-detail';
import { Teams } from './pages/teams/teams';
import { TeamDetail } from './pages/team-detail/team-detail';
import { Players } from './pages/players/players';
import { PlayerDetail } from './pages/player-detail/player-detail';
import { Calendar } from './pages/calendar/calendar';
import { Competitions } from './pages/competitions/competitions';
import { CompetitionDetail } from './pages/competition-detail/competition-detail';
import { NotFound } from './pages/not-found/not-found';
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
    component: Login,
  },

  // Noticias (eager - todo)
  {
    path: 'noticias',
    children: [
      {
        path: '',
        component: NewsPage,
      },
      {
        path: ':id',
        component: NewsDetail,
      },
    ],
  },

  // Equipos (eager - todo)
  {
    path: 'equipos',
    children: [
      {
        path: '',
        component: Teams,
      },
      {
        path: ':id',
        component: TeamDetail,
      },
    ],
  },

  // Jugadores (eager - todo)
  {
    path: 'jugadores',
    children: [
      {
        path: '',
        component: Players,
      },
      {
        path: ':id',
        component: PlayerDetail,
      },
    ],
  },

  // Calendario (eager)
  {
    path: 'calendario',
    component: Calendar,
  },

  // Competiciones (eager)
  {
    path: 'competiciones',
    children: [
      {
        path: '',
        component: Competitions,
      },
      {
        path: ':id',
        component: CompetitionDetail,
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

  // Admin (lazy - solo para editores)
  {
    path: 'admin',
    canActivate: [editorGuard],
    loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes),
  },

  // 404 (eager)
  {
    path: '404',
    component: NotFound,
  },

  // Wildcard - redirige a 404
  {
    path: '**',
    redirectTo: '404',
  },
];
