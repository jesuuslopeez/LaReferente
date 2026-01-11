import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas con parametros dinamicos - render en cliente
  {
    path: 'competiciones/:slug',
    renderMode: RenderMode.Client,
  },
  {
    path: 'competiciones/:slug/grupo/:grupo',
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
