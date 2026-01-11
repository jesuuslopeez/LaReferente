import { Routes } from '@angular/router';
import { formGuard } from '../../guards/form.guard';

export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-layout').then((m) => m.UserLayout),
    children: [
      {
        path: '',
        redirectTo: 'perfil',
        pathMatch: 'full',
      },
      {
        path: 'perfil',
        loadComponent: () => import('./profile/profile').then((m) => m.Profile),
        canDeactivate: [formGuard],
      },
      {
        path: 'favoritos',
        loadComponent: () => import('./favorites/favorites').then((m) => m.Favorites),
      },
    ],
  },
];
