import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dwec } from './pages/dwec/dwec';
import { StyleGuide } from './pages/style-guide/style-guide';
import { Competitions } from './pages/competitions/competitions';
import { CompetitionDetail } from './pages/competition-detail/competition-detail';
import { CompetitionGroup } from './pages/competition-group/competition-group';
import { Teams } from './pages/teams/teams';
import { TeamDetail } from './pages/team-detail/team-detail';
import { Players } from './pages/players/players';
import { PlayerDetail } from './pages/player-detail/player-detail';
import { Calendar } from './pages/calendar/calendar';
import { Login } from './pages/login/login';
import { NotFound } from './pages/not-found/not-found';
import { NewsPage } from './pages/news/news';
import { authGuard } from './guards/auth.guard';
import { editorGuard } from './guards/editor.guard';
import { competitionResolver } from './resolvers/competition.resolver';
import { NewsCreate } from './pages/admin/news-create/news-create';
import { CompetitionCreate } from './pages/admin/competition-create/competition-create';
import { TeamCreate } from './pages/admin/team-create/team-create';
import { PlayerCreate } from './pages/admin/player-create/player-create';
import { MatchCreate } from './pages/admin/match-create/match-create';

export const routes: Routes = [
  // Inicio
  {
    path: '',
    component: Home,
  },

  // Style Guide (desarrollo)
  {
    path: 'style-guide',
    component: StyleGuide,
  },

  // DWEC - Ejemplos y Demos
  {
    path: 'dwec',
    component: Dwec,
  },

  // Login
  {
    path: 'login',
    component: Login,
  },

  // Noticias (consume API real)
  {
    path: 'noticias',
    component: NewsPage,
  },

  // Equipos
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

  // Jugadores
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

  // Calendario
  {
    path: 'calendario',
    component: Calendar,
  },

  // Competiciones
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

  // Admin - Crear contenido (solo editores/admin)
  {
    path: 'admin',
    canActivate: [editorGuard],
    children: [
      { path: 'noticias/nueva', component: NewsCreate },
      { path: 'competiciones/nueva', component: CompetitionCreate },
      { path: 'equipos/nuevo', component: TeamCreate },
      { path: 'jugadores/nuevo', component: PlayerCreate },
      { path: 'encuentros/nuevo', component: MatchCreate },
    ],
  },

  // 404
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
