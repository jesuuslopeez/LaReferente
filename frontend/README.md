# La Referente - Frontend

Aplicación web de noticias deportivas desarrollada con Angular 19+ usando arquitectura standalone.

## URL de Producción

**[https://yiisus.com](https://yiisus.com)**

## Características Principales

- Angular 19 con Standalone Components
- Zoneless Change Detection
- SSR Ready (Server-Side Rendering)
- Lazy Loading de módulos
- Sistema de autenticación JWT
- Tema claro/oscuro
- Tests unitarios y de integración

## Requisitos

- Node.js 20+
- npm 10+
- Angular CLI 19+

## Instalación

```bash
# Clonar repositorio
git clone <url-repositorio>
cd frontend

# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve

# Build de producción
ng build --configuration production
```

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `ng serve` | Servidor de desarrollo en http://localhost:4200 |
| `ng build` | Build de producción |
| `npm test` | Ejecutar tests unitarios |
| `npm test -- --code-coverage` | Tests con reporte de coverage |

## Testing

```bash
# Ejecutar tests
npm test -- --browsers=ChromeHeadless --watch=false

# Con coverage
npm test -- --code-coverage
```

**Coverage actual:** >75% statements, >55% branches

## Build de Producción

```bash
ng build --configuration production
```

**Tamaño del bundle:**
- main.js: ~422KB (gzipped: ~52KB)
- Total initial: <500KB

## Performance (Lighthouse)

| Métrica | Valor | Estado |
|---------|-------|--------|
| LCP | 257 ms | Excelente |
| CLS | 0.10 | Bueno |
| TTFB | 2 ms | Excelente |

**Performance Score estimado: >90**

---

## Sistema de Rutas

### Mapa de Rutas

| Path | Componente | Guard | Resolver | Descripción |
|------|------------|-------|----------|-------------|
| `/` | `Home` | - | - | Página principal con slider y destacados |
| `/login` | `Login` | - | - | Inicio de sesión y registro |
| `/noticias` | `NewsPage` | - | - | Listado de noticias |
| `/noticias/:id` | `NewsDetail` | - | - | Detalle de una noticia |
| `/equipos` | `Teams` | - | - | Listado de equipos |
| `/equipos/:id` | `TeamDetail` | - | - | Detalle de un equipo |
| `/jugadores` | `Players` | - | - | Listado de jugadores |
| `/jugadores/:id` | `PlayerDetail` | - | - | Detalle de un jugador |
| `/competiciones` | `Competitions` | - | - | Listado de competiciones |
| `/competiciones/:id` | `CompetitionDetail` | - | `competitionResolver` | Detalle de competición |
| `/calendario` | `Calendar` | - | - | Calendario de partidos |
| `/usuario/*` | Lazy loaded | `authGuard` | - | Área privada de usuario |
| `/admin/*` | Varios | `editorGuard` | - | Panel de administración |
| `/404` | `NotFound` | - | - | Página no encontrada |
| `**` | - | - | - | Wildcard → redirige a 404 |

### Rutas con Parámetros Dinámicos

```typescript
// Ejemplo: /noticias/123
{
  path: 'noticias/:id',
  component: NewsDetail
}

// Lectura del parámetro en el componente
const id = this.route.snapshot.params['id'];
// O reactivo:
this.route.params.subscribe(params => params['id']);
```

### Lazy Loading

El módulo de usuario se carga de forma perezosa:

```typescript
{
  path: 'usuario',
  canActivate: [authGuard],
  loadChildren: () => import('./pages/user/user.routes').then(m => m.userRoutes)
}
```

**Estrategia de precarga**: `PreloadAllModules` - Los módulos lazy se precargan en segundo plano después de la carga inicial.

**Verificación de chunks**: Ejecutar `ng build` y comprobar que se generan archivos separados en `dist/`.

---

## Guards

### authGuard (CanActivate)

Protege rutas que requieren autenticación.

```typescript
// Ubicación: src/app/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;
  }

  // Guarda la URL de retorno para redirigir después del login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
```

**Uso**: Rutas bajo `/usuario/*`

### editorGuard (CanActivate)

Protege rutas que requieren rol de editor/admin.

```typescript
// Ubicación: src/app/guards/editor.guard.ts
export const editorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.esEditor()) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
```

**Uso**: Rutas bajo `/admin/*`

### formGuard (CanDeactivate)

Previene la pérdida de datos en formularios con cambios sin guardar.

```typescript
// Ubicación: src/app/guards/form.guard.ts
export interface FormularioConCambios {
  tieneCambiosSinGuardar(): boolean;
}

export const formGuard: CanDeactivateFn<FormularioConCambios> = (component) => {
  if (component.tieneCambiosSinGuardar?.()) {
    return confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?');
  }
  return true;
};
```

**Uso**: Formularios de edición de perfil y contenido

---

## Resolvers

### competitionResolver

Precarga los datos de una competición antes de activar la ruta.

```typescript
// Ubicación: src/app/resolvers/competition.resolver.ts
export const competitionResolver: ResolveFn<Competition | undefined> = (route) => {
  const service = inject(CompetitionService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);
  const id = Number(route.paramMap.get('id'));

  loadingService.show('Cargando competición...');

  return service.obtenerPorId(id).pipe(
    tap(comp => { if (!comp) router.navigate(['/404']); }),
    catchError(() => { router.navigate(['/404']); return of(undefined); }),
    finalize(() => loadingService.hide())
  );
};
```

**Características**:
- Muestra estado de carga global mientras resuelve
- Redirige a 404 si no existe o hay error
- Valida que el ID sea numérico

**Acceso a datos resueltos**:
```typescript
constructor(private route: ActivatedRoute) {
  this.competicion = this.route.snapshot.data['competicion'];
}
```

---

## Comunicación HTTP

### Configuración

```typescript
// app.config.ts
provideHttpClient(
  withFetch(),
  withInterceptors([
    authInterceptor,
    errorInterceptor,
    loggingInterceptor
  ])
)
```

### Servicio Base (ApiService)

Patrón Facade que centraliza las peticiones HTTP.

```typescript
// Ubicación: src/app/core/services/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080/api';

  get<T>(endpoint, params?): Observable<T>     // GET con retry automático
  post<T>(endpoint, body): Observable<T>       // POST
  put<T>(endpoint, body): Observable<T>        // PUT (reemplazo completo)
  patch<T>(endpoint, body): Observable<T>      // PATCH (actualización parcial)
  delete<T>(endpoint): Observable<T>           // DELETE
  upload<T>(endpoint, formData): Observable<T> // FormData para archivos
}
```

---

## Interceptores HTTP

### authInterceptor

Añade token JWT a las peticiones.

```typescript
// Ubicación: src/app/core/interceptors/auth.interceptor.ts
```

| Característica | Descripción |
|----------------|-------------|
| Token | `Authorization: Bearer {token}` |
| Almacenamiento | `localStorage` |
| Rutas excluidas | `/auth/login`, `/auth/register`, `/public` |
| SSR | Compatible (detecta plataforma) |

### errorInterceptor

Manejo global de errores HTTP.

```typescript
// Ubicación: src/app/core/interceptors/error.interceptor.ts
```

| Status | Acción |
|--------|--------|
| 0 | "No hay conexión con el servidor" |
| 400 | Muestra mensaje de error de validación |
| 401 | Limpia sesión, redirige a `/login` |
| 403 | "No tienes permisos" |
| 404 | Sin toast (manejado por componente) |
| 409 | "Conflicto con datos existentes" |
| 422 | "Error de validación" |
| 429 | "Demasiadas peticiones" |
| 5xx | "Error interno del servidor" |

### loggingInterceptor

Logging de peticiones en desarrollo.

```typescript
// Ubicación: src/app/core/interceptors/logging.interceptor.ts
```

| Característica | Descripción |
|----------------|-------------|
| Entorno | Solo `isDevMode()` |
| Request | Método, URL, body |
| Response | Status, tiempo, body |
| Colores | Azul (req), verde (2xx), naranja (otros), rojo (error) |

---

## API REST - Endpoints

### Base URL
```
http://localhost:8080/api
```

### Noticias (`/news`)

| Método | Endpoint | Descripción | Parámetros |
|--------|----------|-------------|------------|
| GET | `/news` | Listar todas | `page`, `limit`, `categoria` |
| GET | `/news/published` | Solo publicadas | - |
| GET | `/news/featured` | Destacadas | - |
| GET | `/news/:id` | Obtener por ID | - |
| POST | `/news` | Crear noticia | Body: `CreateNewsDto` |
| PUT | `/news/:id` | Actualizar | Body: `UpdateNewsDto` |
| DELETE | `/news/:id` | Eliminar | - |
| POST | `/news/:id/view` | Incrementar visitas | - |

### Equipos (`/teams`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/teams` | Listar todos |
| GET | `/teams/active` | Solo activos |
| GET | `/teams/:id` | Obtener por ID |
| POST | `/teams` | Crear equipo |
| PUT | `/teams/:id` | Actualizar |
| DELETE | `/teams/:id` | Eliminar |

### Jugadores (`/players`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/players` | Listar todos |
| GET | `/players/active` | Solo activos |
| GET | `/players/:id` | Obtener por ID |
| POST | `/players` | Crear jugador |
| PUT | `/players/:id` | Actualizar |
| DELETE | `/players/:id` | Eliminar |

### Competiciones (`/competitions`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/competitions` | Listar todas |
| GET | `/competitions/:id` | Obtener por ID |
| POST | `/competitions` | Crear competición |
| PUT | `/competitions/:id` | Actualizar |
| DELETE | `/competitions/:id` | Eliminar |

### Partidos (`/matches`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/matches` | Listar todos |
| GET | `/matches/:id` | Obtener por ID |
| POST | `/matches` | Crear partido |
| PUT | `/matches/:id` | Actualizar |
| DELETE | `/matches/:id` | Eliminar |

### Autenticación (`/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/register` | Registrar usuario |
| GET | `/auth/me` | Usuario actual |

---

## Interfaces TypeScript

### News
```typescript
interface News {
  id: number;
  titulo: string;
  subtitulo: string;
  contenido: string;
  imagenPrincipalUrl: string | null;
  autorId: number;
  autorNombre: string;
  categoria: 'FICHAJES' | 'PARTIDOS' | 'LESIONES' | 'RUEDAS_PRENSA' | 'GENERAL';
  destacada: boolean;
  publicada: boolean;
  fechaPublicacion: string | null;
  visitas: number;
  fechaCreacion: string;
  fechaModificacion: string | null;
}
```

### Team
```typescript
interface Team {
  id: number;
  nombre: string;
  nombreCorto: string;
  ciudad: string;
  estadio: string;
  fundacion: number;
  logoUrl: string | null;
  activo: boolean;
}
```

### Player
```typescript
interface Player {
  id: number;
  nombre: string;
  apellidos: string;
  apodo: string | null;
  fechaNacimiento: string;
  nacionalidad: string;
  posicion: string;
  dorsal: number | null;
  altura: number | null;
  peso: number | null;
  pieHabil: 'DERECHO' | 'IZQUIERDO' | 'AMBIDIESTRO';
  fotoUrl: string | null;
  equipoId: number | null;
  equipoNombre: string | null;
  activo: boolean;
}
```

### Competition
```typescript
interface Competition {
  id: number;
  nombre: string;
  nombreCompleto: string | null;
  pais: string | null;
  tipo: 'LIGA' | 'COPA';
  categoria: 'SENIOR' | 'JUVENIL' | 'CADETE' | 'INFANTIL' | 'ALEVIN' | 'BENJAMIN' | 'PREBENJAMIN';
  numEquipos: number | null;
  temporada: string;
  descripcion: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  activa: boolean;
  logoUrl: string | null;
}
```

---

## Manejo de Estados

### Estados de Carga

Se utiliza `LoadingService` para mostrar un overlay de carga global:

```typescript
// Mostrar carga
loadingService.show('Mensaje opcional...');

// Ocultar carga
loadingService.hide();
```

### Estados en Componentes

Cada componente gestiona sus propios estados:

```typescript
loading = signal(true);      // Cargando datos
error = signal<string|null>(null);  // Mensaje de error
items = signal<Item[]>([]);  // Datos
```

### Estados Vacíos

Cuando no hay datos, se muestra un mensaje con acción sugerida:

```html
@if (items().length === 0 && !loading()) {
  <section class="empty-state">
    <p>No hay elementos disponibles</p>
    <a routerLink="/crear">Crear nuevo</a>
  </section>
}
```

---

## Estructura del Proyecto

```
src/app/
├── core/
│   ├── interceptors/     # Interceptores HTTP
│   ├── models/           # Interfaces TypeScript
│   └── services/         # Servicios de datos (API)
├── guards/               # Guards de rutas
├── resolvers/            # Resolvers de datos
├── pages/                # Componentes de página
├── components/           # Componentes reutilizables
├── shared/
│   ├── components/       # Componentes compartidos (Toast, Loading)
│   └── services/         # Servicios compartidos
├── services/             # Servicios específicos
└── directives/           # Directivas personalizadas
```

---

## Scripts Disponibles

```bash
ng serve          # Desarrollo en http://localhost:4200
ng build          # Build de producción
ng test           # Tests unitarios
ng e2e            # Tests end-to-end
```
