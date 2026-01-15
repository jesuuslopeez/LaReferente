import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas con parametros dinamicos - render en cliente
  {
    path: 'competiciones/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'equipos/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'jugadores/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'noticias/:id',
    renderMode: RenderMode.Client,
  },
  {
    path: 'usuario/**',
    renderMode: RenderMode.Client,
  },
  // El resto prerender
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
