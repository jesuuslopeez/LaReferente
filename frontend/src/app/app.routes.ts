import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Dwec } from './pages/dwec/dwec';
import { StyleGuide } from './pages/style-guide/style-guide';
import { Competitions } from './pages/competitions/competitions';
import { CompetitionDetail } from './pages/competition-detail/competition-detail';
import { CompetitionGroup } from './pages/competition-group/competition-group';
import { Login } from './pages/login/login';
import { NotFound } from './pages/not-found/not-found';
import { NewsPage } from './pages/news/news';
import { authGuard } from './guards/auth.guard';
import { competitionResolver, groupResolver } from './resolvers/competition.resolver';

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

  // Competiciones (rutas con parámetros y rutas hijas)
  {
    path: 'competiciones',
    children: [
      {
        path: '',
        component: Competitions,
      },
      {
        path: ':slug',
        component: CompetitionDetail,
        resolve: { competicion: competitionResolver },
        children: [
          {
            path: 'grupo/:grupo',
            component: CompetitionGroup,
            resolve: { grupoData: groupResolver },
          },
        ],
      },
    ],
  },

  // Area de usuario (lazy loading + guard)
  {
    path: 'usuario',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/user/user.routes').then((m) => m.userRoutes),
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
