# Sistema de rutas y navegación

Este documento recoge como he estructurado el enrutamiento de la aplicación, las decisiones que he tomado y como funcionan los distintos elementos del sistema de navegación.

---

## 1. Estructura General de Rutas

He organizado las rutas pensando en la escalabilidad y en mantener el codigo limpio. La configuracion principal esta en `app.routes.ts`:

```typescript
export const routes: Routes = [
  // Paginas publicas
  { path: '', component: Home },
  { path: 'style-guide', component: StyleGuide },
  { path: 'login', component: Login },
  { path: 'noticias', component: NewsPage },

  // Competiciones con rutas anidadas
  {
    path: 'competiciones',
    children: [
      { path: '', component: Competitions },
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

  // Area privada con lazy loading
  {
    path: 'usuario',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/user/user.routes').then((m) => m.userRoutes),
  },

  // Manejo de errores
  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404' },
];
```

### Mapa de rutas

| Ruta | Componente | Protegida | Lazy | Resolver |
|------|-----------|-----------|------|----------|
| `/` | Home | No | No | - |
| `/style-guide` | StyleGuide | No | No | - |
| `/login` | Login | No | No | - |
| `/noticias` | NewsPage | No | No | - |
| `/competiciones` | Competitions | No | No | - |
| `/competiciones/:slug` | CompetitionDetail | No | No | competitionResolver |
| `/competiciones/:slug/grupo/:grupo` | CompetitionGroup | No | No | groupResolver |
| `/usuario` | UserLayout | Si | Si | - |
| `/usuario/perfil` | Profile | Si | Si | - |
| `/usuario/favoritos` | Favorites | Si | Si | - |
| `/404` | NotFound | No | No | - |

---

## 2. Rutas con Parametros

Para las paginas de detalle uso parametros dinamicos. Por ejemplo, en competiciones:

```typescript
{
  path: ':slug',
  component: CompetitionDetail,
  resolve: { competicion: competitionResolver },
}
```

Luego en el componente accedo al parametro de dos formas segun lo que necesite:

```typescript
// Opcion 1: Snapshot (valor estatico, util en constructor)
const slug = this.route.snapshot.paramMap.get('slug');

// Opcion 2: Observable (si el parametro puede cambiar sin destruir el componente)
this.route.paramMap.subscribe(params => {
  const slug = params.get('slug');
});
```

He optado por usar slugs en lugar de IDs numericos porque quedan mejor en la URL y son mas descriptivos para el usuario.

---

## 3. Rutas Hijas

Las rutas de competiciones tienen una estructura anidada porque necesito mantener el contexto del detalle mientras muestro información de grupos:

```
/competiciones
  └── /:slug                    → CompetitionDetail
        └── /grupo/:grupo       → CompetitionGroup
```

Esto me permite que `CompetitionDetail` tenga su propio `<router-outlet>` donde se renderiza `CompetitionGroup` sin perder la cabecera de la competicion.

En el area de usuario hago algo parecido:

```typescript
// user.routes.ts
export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-layout').then((m) => m.UserLayout),
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
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
```

El `UserLayout` tiene la navegación lateral y el outlet donde van apareciendo las distintas secciones.

---

## 4. Lazy Loading

He aplicado lazy loading al area de usuario porque es una seccion que no todos los visitantes van a usar. No tiene sentido cargar ese codigo en el bundle inicial.

```typescript
{
  path: 'usuario',
  canActivate: [authGuard],
  loadChildren: () => import('./pages/user/user.routes').then((m) => m.userRoutes),
}
```

Dentro de las rutas de usuario, cada componente tambien se carga de forma lazy con `loadComponent`:

```typescript
{
  path: 'perfil',
  loadComponent: () => import('./profile/profile').then((m) => m.Profile),
}
```

### Estrategia de precarga

En `app.config.ts` uso `PreloadAllModules` para que los chunks lazy se descarguen en segundo plano una vez cargada la aplicación:

```typescript
provideRouter(routes, withPreloading(PreloadAllModules))
```

Esto hace que la primera navegación a `/usuario` sea instantanea porque el chunk ya esta descargado. El usuario no nota que es lazy loading.

---

## 5. Guards

### authGuard

Protege las rutas que requieren autenticación. Es un guard funcional (el estilo moderno de Angular):

```typescript
// guards/auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
```

Si el usuario no esta logueado, lo mando a `/login`. Simple y directo.

### formGuard

Este guard es de tipo `CanDeactivate` y lo uso para evitar que el usuario pierda cambios sin guardar en formularios:

```typescript
// guards/form.guard.ts
export interface FormularioConCambios {
  tieneCambiosSinGuardar(): boolean;
}

export const formGuard: CanDeactivateFn<FormularioConCambios> = (component) => {
  if (component.tieneCambiosSinGuardar && component.tieneCambiosSinGuardar()) {
    return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
  }
  return true;
};
```

El componente tiene que implementar la interfaz `FormularioConCambios`. Cuando el usuario intenta salir con cambios pendientes, le sale el tipico dialogo de confirmacion.

Lo aplico en la ruta del perfil:

```typescript
{
  path: 'perfil',
  loadComponent: () => import('./profile/profile').then((m) => m.Profile),
  canDeactivate: [formGuard],
}
```

---

## 6. Resolvers

Los resolvers me permiten cargar datos antes de que se active la ruta. Asi el componente ya tiene todo listo cuando se renderiza.

### competitionResolver

```typescript
export const competitionResolver: ResolveFn<Competicion | undefined> = (route) => {
  const service = inject(CompetitionService);
  const router = inject(Router);
  const slug = route.paramMap.get('slug')!;

  return service.obtenerPorSlug(slug).pipe(
    tap((comp) => {
      if (!comp) {
        router.navigate(['/404']);
      }
    }),
    catchError(() => {
      router.navigate(['/404']);
      return of(undefined);
    })
  );
};
```

Si la competicion no existe o hay un error, redirijo a la pagina 404. Esto evita que el usuario vea una pagina rota.

### groupResolver

Similar al anterior pero para los grupos dentro de una competicion:

```typescript
export const groupResolver: ResolveFn<{ competicion: Competicion; grupo: Grupo } | undefined> = (route) => {
  const service = inject(CompetitionService);
  const router = inject(Router);
  const compSlug = route.parent?.paramMap.get('slug') || route.paramMap.get('slug')!;
  const grupoSlug = route.paramMap.get('grupo')!;

  return service.obtenerGrupo(compSlug, grupoSlug).pipe(
    tap((data) => {
      if (!data) {
        router.navigate(['/404']);
      }
    }),
    catchError(() => {
      router.navigate(['/404']);
      return of(undefined);
    })
  );
};
```

Aqui hay un detalle: como es una ruta hija, el slug de la competicion esta en la ruta padre, por eso accedo con `route.parent?.paramMap`.

### Acceso a los datos resueltos

En el componente, los datos estan disponibles en `route.snapshot.data`:

```typescript
constructor() {
  this.competicion = this.route.snapshot.data['competicion'];
}
```

---

## 7. Navegación Programatica

Ademas de los `routerLink` en los templates, a veces necesito navegar desde el codigo:

```typescript
// Navegación basica
this.router.navigate(['/usuario']);

// Con parametros
this.router.navigate(['/competiciones', slug]);

// Redireccion tras login
this.router.navigate(['/usuario']);
```

En el interceptor de errores, si recibo un 401 (no autorizado), redirijo al login:

```typescript
if (status === 401) {
  localStorage.removeItem('token');
  router.navigate(['/login']);
}
```

---

## 8. Pagina 404

La ruta wildcard `**` captura cualquier URL que no coincida con las rutas definidas:

```typescript
{ path: '404', component: NotFound },
{ path: '**', redirectTo: '404' },
```

El componente `NotFound` es sencillo, muestra un mensaje y un boton para volver al inicio:

```html
<section class="not-found">
  <h1>404</h1>
  <p>La pagina que buscas no existe</p>
  <a routerLink="/" class="not-found__btn">Volver al inicio</a>
</section>
```

---

## 9. Configuracion SSR

Para el renderizado del lado del servidor he configurado que rutas se prerrenderizan y cuales se dejan para el cliente:

```typescript
// app.routes.server.ts
export const serverRoutes: ServerRoute[] = [
  // Rutas dinamicas: renderizar en cliente
  { path: 'competiciones/:slug/**', renderMode: RenderMode.Client },
  { path: 'usuario/**', renderMode: RenderMode.Client },

  // Resto: prerenderizar
  { path: '**', renderMode: RenderMode.Prerender },
];
```

Las rutas con parametros dinamicos o que dependen de autenticación se renderizan en el cliente. Las paginas estaticas como home o la guia de estilos se prerrenderizan para mejor SEO y tiempo de carga.

---

## Resumen

El sistema de rutas queda organizado asi:

- **Rutas publicas**: Accesibles sin login, carga inmediata
- **Rutas protegidas**: Requieren autenticación (`authGuard`), carga lazy
- **Rutas con datos**: Usan resolvers para precargar información
- **Rutas anidadas**: Permiten layouts compartidos con outlets internos
- **Manejo de errores**: Wildcard redirige a 404, resolvers validan existencia

La navegación funciona tanto con `routerLink` en templates como con `Router.navigate()` en el codigo, segun lo que sea mas comodo en cada caso.
