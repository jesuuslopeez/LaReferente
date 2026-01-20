# 📚 GUÍA DE ESTUDIO COMPLETA - LaReferente

> **Documento de preparación para examen técnico**
> Aplicación web full-stack de gestión deportiva

---

## 📑 ÍNDICE

1. [Arquitectura General](#1-arquitectura-general)
2. [Frontend - Angular 20](#2-frontend-angular-20)
3. [Backend - Spring Boot](#3-backend-spring-boot)
4. [Base de Datos](#4-base-de-datos)
5. [Autenticación - Flujo Completo](#5-autenticación-flujo-completo)
6. [Infraestructura y Despliegue](#6-infraestructura-y-despliegue)
7. [Guías "Cómo Hacer"](#7-guías-cómo-hacer)
8. [Preguntas de Examen](#8-preguntas-de-examen)
9. [Glosario Técnico](#9-glosario-técnico)
10. [Cheatsheet Rápido](#10-cheatsheet-rápido)

---

## 1. ARQUITECTURA GENERAL

### 1.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTE (Navegador)                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         NGINX (Reverse Proxy)                                │
│                              Puerto: 80                                      │
│  ┌─────────────────────────────┐    ┌─────────────────────────────────────┐ │
│  │   Rutas estáticas (/)       │    │   Rutas API (/api/*)                │ │
│  │   → Frontend Angular        │    │   → Backend Spring Boot             │ │
│  └─────────────────────────────┘    └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
          │                                        │
          ▼                                        ▼
┌─────────────────────────┐          ┌─────────────────────────────────────────┐
│   FRONTEND (Angular)    │          │         BACKEND (Spring Boot)           │
│      Puerto: 4200       │          │              Puerto: 8080               │
│                         │          │                                         │
│  ┌───────────────────┐  │          │  ┌─────────────┐  ┌─────────────────┐  │
│  │   Components      │  │          │  │ Controllers │→ │    Services     │  │
│  │   (Standalone)    │  │          │  └─────────────┘  └─────────────────┘  │
│  └───────────────────┘  │          │         │                  │           │
│  ┌───────────────────┐  │          │         ▼                  ▼           │
│  │    Services       │  │  HTTP    │  ┌─────────────┐  ┌─────────────────┐  │
│  │    (inject())     │──┼─────────→│  │    DTOs     │  │  Repositories   │  │
│  └───────────────────┘  │          │  └─────────────┘  └─────────────────┘  │
│  ┌───────────────────┐  │          │                           │           │
│  │   Interceptors    │  │          │  ┌─────────────────────────┘           │
│  │  (JWT, Errors)    │  │          │  │                                     │
│  └───────────────────┘  │          │  ▼                                     │
│  ┌───────────────────┐  │          │  ┌─────────────────────────────────┐   │
│  │  Guards/Resolvers │  │          │  │      JPA Entities (Models)      │   │
│  └───────────────────┘  │          │  └─────────────────────────────────┘   │
│  ┌───────────────────┐  │          │                   │                    │
│  │  Signals (State)  │  │          │                   ▼                    │
│  └───────────────────┘  │          │  ┌─────────────────────────────────┐   │
└─────────────────────────┘          │  │     Security (JWT Filter)       │   │
                                     │  └─────────────────────────────────┘   │
                                     └─────────────────────────────────────────┘
                                                        │
                                                        ▼
                                     ┌─────────────────────────────────────────┐
                                     │          PostgreSQL Database            │
                                     │              Puerto: 5432               │
                                     │                                         │
                                     │  Tablas: usuarios, equipos, jugadores,  │
                                     │  competiciones, partidos, noticias,     │
                                     │  comentarios, clasificaciones           │
                                     └─────────────────────────────────────────┘
```

### 1.2 Flujo de Datos Frontend ↔ Backend

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        FLUJO DE UNA PETICIÓN HTTP                            │
└──────────────────────────────────────────────────────────────────────────────┘

1. COMPONENTE hace llamada
   │
   ▼
2. SERVICE usa ApiService.get<T>()
   │
   ▼
3. INTERCEPTOR authInterceptor añade: "Authorization: Bearer {token}"
   │
   ▼
4. INTERCEPTOR loggingInterceptor registra en consola (dev)
   │
   ▼
5. HTTP REQUEST → Nginx → Backend
   │
   ▼
6. JwtRequestFilter valida token y extrae email/rol
   │
   ▼
7. SecurityConfig verifica permisos del endpoint
   │
   ▼
8. CONTROLLER recibe petición
   │
   ▼
9. SERVICE ejecuta lógica de negocio
   │
   ▼
10. REPOSITORY consulta base de datos (JPA)
    │
    ▼
11. SERVICE convierte Entity → DTO
    │
    ▼
12. HTTP RESPONSE ← JSON
    │
    ▼
13. INTERCEPTOR errorInterceptor maneja errores (401, 403, 500...)
    │
    ▼
14. SERVICE recibe Observable<T>
    │
    ▼
15. COMPONENTE actualiza vista con Signal/Estado
```

### 1.3 Por Qué Esta Arquitectura

| Decisión | Justificación |
|----------|---------------|
| **Angular Standalone** | Elimina complejidad de NgModules, mejor tree-shaking, carga más rápida |
| **Signals** | Reactividad más simple que RxJS para estado local, mejor rendimiento |
| **Spring Boot** | Framework maduro, ecosistema rico, integración perfecta con JPA |
| **JWT Stateless** | Escalabilidad horizontal, no requiere sesiones en servidor |
| **PostgreSQL** | ACID compliant, soporte JSON, rendimiento superior a MySQL |
| **Docker** | Entornos reproducibles, despliegue consistente dev/prod |
| **Nginx** | Reverse proxy eficiente, sirve estáticos, gzip, SSL termination |

---

## 2. FRONTEND - ANGULAR 20

### 2.1 Standalone Components

#### QUÉ ES
Los **Standalone Components** son componentes Angular que NO requieren un NgModule para funcionar. Se declaran con `standalone: true` en el decorador `@Component`.

#### CÓMO FUNCIONA
```typescript
// frontend/src/app/pages/home/home.ts
@Component({
  selector: 'app-home',
  standalone: true,                    // ← Indica que es standalone
  imports: [CommonModule, RouterLink], // ← Importa lo que necesita directamente
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  // Lógica del componente
}
```

El componente importa directamente sus dependencias (otros componentes, directivas, pipes) en lugar de depender de un módulo padre.

#### POR QUÉ SE USA
1. **Simplicidad**: Elimina la capa extra de NgModules
2. **Tree-shaking mejorado**: Solo se incluye lo que se importa
3. **Lazy loading granular**: Cada componente puede cargarse independientemente
4. **Menos boilerplate**: No hay que mantener módulos separados

#### CÓMO AÑADIR UNO NUEVO
```bash
# 1. Crear el componente
ng generate component pages/mi-pagina --standalone

# 2. Estructura generada:
# src/app/pages/mi-pagina/
#   ├── mi-pagina.ts
#   ├── mi-pagina.html
#   ├── mi-pagina.scss
#   └── mi-pagina.spec.ts

# 3. Añadir a las rutas (app.routes.ts)
```

```typescript
// app.routes.ts
import { MiPagina } from './pages/mi-pagina/mi-pagina';

export const routes: Routes = [
  { path: 'mi-pagina', component: MiPagina }
];
```

---

### 2.2 Signals (Gestión de Estado)

#### QUÉ ES
Los **Signals** son primitivas reactivas introducidas en Angular 16+ que permiten gestionar estado de forma más simple y eficiente que RxJS para casos de uso comunes.

#### CÓMO FUNCIONA
```typescript
// frontend/src/app/services/auth.service.ts
import { signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signal: valor reactivo que notifica cambios
  usuario = signal<Usuario | null>(null);
  cargando = signal(false);

  // Para leer el valor: usuario() - se llama como función
  // Para escribir: usuario.set(nuevoValor)
  // Para actualizar: usuario.update(actual => modificado)
}
```

**Ejemplo del Store de Noticias (real del proyecto):**
```typescript
// frontend/src/app/core/stores/news.store.ts
@Injectable({ providedIn: 'root' })
export class NewsStore {
  // Estado privado (signals)
  private _noticias = signal<News[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Estado público de solo lectura
  noticias = this._noticias.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // Computed: valores derivados que se recalculan automáticamente
  total = computed(() => this._noticias().length);
  destacadas = computed(() => this._noticias().filter(n => n.destacada));

  cargar(): void {
    this._loading.set(true);
    this.newsService.getPublished().subscribe({
      next: (lista) => {
        this._noticias.set(lista);     // Actualiza el signal
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message);
        this._loading.set(false);
      }
    });
  }
}
```

#### DIFERENCIA CON RXJS

| Aspecto | Signals | RxJS (Observables) |
|---------|---------|-------------------|
| **Sintaxis** | `valor()` para leer | `.subscribe()` necesario |
| **Suscripción** | Automática en templates | Manual, hay que hacer unsubscribe |
| **Uso ideal** | Estado síncrono local | Streams asíncronos, eventos complejos |
| **Curva aprendizaje** | Baja | Alta |
| **Memory leaks** | No hay riesgo | Fácil olvidar unsubscribe |

#### POR QUÉ SE USA
1. **Rendimiento**: Angular puede detectar cambios más eficientemente
2. **Simplicidad**: Código más legible sin operadores RxJS complejos
3. **Zoneless**: Preparado para Angular sin Zone.js (más rápido)

---

### 2.3 Services (Inyección de Dependencias)

#### QUÉ ES
Un **Service** es una clase que encapsula lógica reutilizable (llamadas HTTP, lógica de negocio, estado compartido). Se inyecta en componentes mediante **Dependency Injection**.

#### CÓMO FUNCIONA
```typescript
// frontend/src/app/core/services/api.service.ts
@Injectable({ providedIn: 'root' })  // ← Disponible en toda la app
export class ApiService {
  private readonly http = inject(HttpClient);  // ← Nueva sintaxis de inyección
  private readonly baseUrl = '/api';

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
      retry({ count: 2, delay: 1000 }),  // Reintenta 2 veces
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }
}
```

**Uso en un componente:**
```typescript
@Component({ ... })
export class TeamsComponent {
  private teamService = inject(TeamService);  // ← inject() en lugar de constructor

  teams = signal<Team[]>([]);

  ngOnInit() {
    this.teamService.getActive().subscribe(data => this.teams.set(data));
  }
}
```

#### POR QUÉ SE USA
1. **Separación de responsabilidades**: Componentes solo presentan, servicios hacen lógica
2. **Reutilización**: Un servicio puede usarse en múltiples componentes
3. **Testabilidad**: Fácil de mockear en tests
4. **Singleton**: `providedIn: 'root'` garantiza una única instancia

#### CÓMO AÑADIR UNO NUEVO
```bash
ng generate service core/services/mi-servicio
```

```typescript
// mi-servicio.service.ts
@Injectable({ providedIn: 'root' })
export class MiServicioService {
  private api = inject(ApiService);

  obtenerDatos(): Observable<MiTipo[]> {
    return this.api.get<MiTipo[]>('mi-endpoint');
  }
}
```

---

### 2.4 Guards (Protección de Rutas)

#### QUÉ ES
Un **Guard** es una función que decide si una ruta puede activarse o no. Protege rutas privadas verificando autenticación o permisos.

#### CÓMO FUNCIONA

**authGuard (real del proyecto):**
```typescript
// frontend/src/app/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaAutenticado()) {
    return true;  // ← Permite acceso
  }

  // Redirige a login guardando la URL original
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;  // ← Bloquea acceso
};
```

**editorGuard (para admin/editores):**
```typescript
// frontend/src/app/guards/editor.guard.ts
export const editorGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.esEditor()) {  // EDITOR o ADMIN
    return true;
  }

  router.navigate(['/']);
  return false;
};
```

**formGuard (previene pérdida de datos):**
```typescript
// frontend/src/app/guards/form.guard.ts
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

#### USO EN RUTAS
```typescript
// app.routes.ts
export const routes: Routes = [
  // Ruta protegida por autenticación
  {
    path: 'usuario',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/user/user.routes').then(m => m.userRoutes)
  },

  // Ruta protegida para editores/admin
  {
    path: 'admin',
    canActivate: [editorGuard],
    children: [
      { path: 'noticias/nueva', component: NewsCreate }
    ]
  },

  // Prevenir salida sin guardar
  {
    path: 'perfil',
    component: Profile,
    canDeactivate: [formGuard]
  }
];
```

#### POR QUÉ SE USA
1. **Seguridad**: Protege rutas sensibles
2. **UX**: Redirige apropiadamente según el estado del usuario
3. **Prevención de pérdida de datos**: Advierte antes de salir sin guardar

---

### 2.5 Interceptors

#### QUÉ ES
Un **Interceptor** es una función que intercepta TODAS las peticiones HTTP para modificarlas (añadir headers) o las respuestas (manejar errores).

#### CÓMO FUNCIONA

**authInterceptor (añade JWT):**
```typescript
// frontend/src/app/core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Solo en navegador (no en SSR)
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // Rutas públicas que no necesitan token
  const publicUrls = ['/auth/login', '/auth/register', '/public'];
  if (publicUrls.some(url => req.url.includes(url))) {
    return next(req);
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return next(req);
  }

  // Clona la request y añade el header
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq);
};
```

**errorInterceptor (maneja errores):**
```typescript
// frontend/src/app/core/interceptors/error.interceptor.ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Error inesperado';
      const isUserAction = req.method !== 'GET';

      switch (error.status) {
        case 401:
          message = 'Tu sesión ha expirado';
          localStorage.removeItem('token');
          router.navigate(['/login']);
          break;
        case 403:
          message = 'No tienes permisos';
          break;
        case 404:
          message = 'Recurso no encontrado';
          break;
        // ... más casos
      }

      if (isUserAction) {
        toast.error(message);
      }

      return throwError(() => ({ status: error.status, message }));
    })
  );
};
```

#### REGISTRO EN app.config.ts
```typescript
// frontend/src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptor,    // 1º: Añade token
        errorInterceptor,   // 2º: Maneja errores
        loggingInterceptor  // 3º: Logging en dev
      ])
    )
  ]
};
```

---

### 2.6 Resolvers

#### QUÉ ES
Un **Resolver** es una función que precarga datos ANTES de activar una ruta. Garantiza que los datos estén disponibles cuando el componente se renderiza.

#### CÓMO FUNCIONA
```typescript
// frontend/src/app/resolvers/competition.resolver.ts
export const competitionResolver: ResolveFn<Competition | undefined> = (route) => {
  const service = inject(CompetitionService);
  const router = inject(Router);
  const loadingService = inject(LoadingService);

  const id = Number(route.paramMap.get('id'));

  if (!id || isNaN(id)) {
    router.navigate(['/404']);
    return of(undefined);
  }

  loadingService.show('Cargando competición...');

  return service.obtenerPorId(id).pipe(
    tap((comp) => {
      if (!comp) router.navigate(['/404']);
    }),
    catchError(() => {
      router.navigate(['/404']);
      return of(undefined);
    }),
    finalize(() => loadingService.hide())
  );
};
```

#### USO EN RUTAS
```typescript
// app.routes.ts
{
  path: 'competiciones/:id',
  component: CompetitionDetail,
  resolve: { competicion: competitionResolver }  // ← Los datos llegan al componente
}
```

**En el componente:**
```typescript
@Component({ ... })
export class CompetitionDetail {
  private route = inject(ActivatedRoute);

  competicion = this.route.snapshot.data['competicion'];  // ← Ya está cargado
}
```

---

### 2.7 Routing (Sistema de Rutas)

#### CONFIGURACIÓN PRINCIPAL
```typescript
// frontend/src/app/app.routes.ts
export const routes: Routes = [
  // Página principal
  { path: '', component: Home },

  // Rutas públicas simples
  { path: 'login', component: Login },
  { path: 'style-guide', component: StyleGuide },

  // Rutas con hijos (children)
  {
    path: 'noticias',
    children: [
      { path: '', component: NewsPage },           // /noticias
      { path: ':id', component: NewsDetail }       // /noticias/123
    ]
  },

  // Rutas con resolver
  {
    path: 'competiciones/:id',
    component: CompetitionDetail,
    resolve: { competicion: competitionResolver }
  },

  // Lazy loading con guard
  {
    path: 'usuario',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/user/user.routes').then(m => m.userRoutes)
  },

  // Admin con guard de editor
  {
    path: 'admin',
    canActivate: [editorGuard],
    children: [
      { path: 'noticias/nueva', component: NewsCreate },
      { path: 'equipos/nuevo', component: TeamCreate }
    ]
  },

  // 404 y wildcard
  { path: '404', component: NotFound },
  { path: '**', redirectTo: '404' }
];
```

#### LAZY LOADING
```typescript
// frontend/src/app/pages/user/user.routes.ts
export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-layout').then(m => m.UserLayout),
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      {
        path: 'perfil',
        loadComponent: () => import('./profile/profile').then(m => m.Profile),
        canDeactivate: [formGuard]
      },
      {
        path: 'favoritos',
        loadComponent: () => import('./favorites/favorites').then(m => m.Favorites)
      }
    ]
  }
];
```

---

### 2.8 Modelos/Interfaces TypeScript

#### EJEMPLO REAL DEL PROYECTO
```typescript
// frontend/src/app/core/models/team.model.ts
import { AgeCategory } from './competition.model';

export interface Team {
  id: number;
  nombre: string;
  nombreCompleto: string;
  categoria: AgeCategory;
  letra: string | null;
  pais: string;
  ciudad: string;
  estadio: string;
  fundacion: number;
  logoUrl: string | null;
  descripcion: string | null;
  activo: boolean;
}

export interface CreateTeamDto {
  nombre: string;
  nombreCompleto?: string;
  categoria: AgeCategory;
  letra?: string;
  pais: string;
  ciudad?: string;
  estadio?: string;
  fundacion?: number;
  logoUrl?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface UpdateTeamDto extends Partial<CreateTeamDto> {}
```

```typescript
// frontend/src/app/core/models/api.model.ts
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface RequestState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

export interface ApiError {
  status: number;
  message: string;
  original?: unknown;
}
```

#### POR QUÉ TIPADO FUERTE
1. **Autocompletado**: El IDE sugiere propiedades correctas
2. **Errores en compilación**: Detecta bugs antes de ejecutar
3. **Documentación viva**: Los tipos describen la estructura de datos
4. **Refactoring seguro**: Cambiar un tipo muestra todos los lugares afectados

---

### 2.9 ApiService (CRUD Genérico)

```typescript
// frontend/src/app/core/services/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  get<T>(endpoint: string, params?: HttpParams | Record<string, string | number>): Observable<T> {
    const options = params ? { params: this.buildParams(params) } : {};
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
      retry({ count: 2, delay: 1000 }),
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  upload<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.status === 0) errorMessage = 'No se puede conectar con el servidor';
    else if (error.status === 401) errorMessage = 'Sesión expirada';
    else if (error.status === 403) errorMessage = 'Sin permisos';
    else if (error.status === 404) errorMessage = 'Recurso no encontrado';
    else if (error.status >= 500) errorMessage = 'Error del servidor';

    return throwError(() => ({ status: error.status, message: errorMessage }));
  }
}
```

---

### 2.10 Estilos ITCSS + BEM

#### ESTRUCTURA ITCSS (Inverted Triangle CSS)
```
src/styles/
├── 00-settings/       # Variables SCSS y CSS Custom Properties
│   ├── _variables.scss
│   └── _css-variables.scss
├── 01-tools/          # Mixins y funciones
│   └── _mixins.scss
├── 02-generic/        # Reset/Normalize
│   └── _reset.scss
├── 03-elements/       # Estilos base HTML (sin clases)
│   ├── _typography.scss
│   ├── _buttons.scss
│   └── _forms.scss
├── 04-layout/         # Estructura (contenedores, grid)
│   └── _layout.scss
├── 05-components/     # Componentes reutilizables (BEM)
│   ├── _boton.scss
│   ├── _tarjeta.scss
│   └── _modal.scss
└── 06-utilities/      # Clases de utilidad
    └── _utilities.scss
```

#### NOMENCLATURA BEM
```scss
// Bloque: .boton
// Elemento: .boton__icono
// Modificador: .boton--primario

.boton {
  // Estilos base
}

.boton__icono {
  // Elemento dentro del bloque
}

.boton--primario {
  // Variante del bloque
}

.boton--grande {
  // Otra variante
}
```

#### EJEMPLO REAL: _boton.scss
```scss
// frontend/src/styles/05-components/_boton.scss
@use '../01-tools/mixins' as *;

.boton {
  @include boton-base;
  font-family: var(--font-primary);
  padding: var(--spacing-2) var(--spacing-4);
  width: 100%;

  @include responsive('sm') {
    padding: var(--spacing-3) var(--spacing-6);
    width: auto;
  }
}

.boton--primario {
  background-color: var(--white);
  border-color: var(--primary);
  color: var(--primary);

  &:hover:not(:disabled) {
    background-color: var(--primary);
    color: var(--white);
  }
}

.boton__icono {
  margin-right: var(--spacing-2);
  width: var(--spacing-5);
  height: var(--spacing-5);
}
```

#### CSS CUSTOM PROPERTIES (Variables)
```scss
// frontend/src/styles/00-settings/_css-variables.scss
:root {
  // Colores del tema
  --primary: #388e3c;
  --secondary: #039be5;
  --bg-color: #ffffff;
  --text-color: #222222;

  // Tipografías
  --font-primary: 'Inter', sans-serif;
  --font-secondary: 'ABeeZee', sans-serif;

  // Espaciados
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-4: 1rem;

  // Bordes
  --radius-md: 0.25rem;
  --radius-lg: 0.5rem;
}

:root.theme-dark {
  --primary: #2a6b2d;
  --bg-color: #222222;
  --text-color: #ffffff;
}
```

---

## 3. BACKEND - SPRING BOOT

### 3.1 Controllers (Endpoints REST)

#### QUÉ ES
Un **Controller** es una clase que maneja las peticiones HTTP entrantes. Define los endpoints de la API REST y delega la lógica al Service correspondiente.

#### CÓMO FUNCIONA
```java
// backend/src/main/java/lareferente/backend/controller/TeamController.java
@RestController                           // ← Indica que es un controlador REST
@RequestMapping("/api/teams")             // ← Prefijo de todas las rutas
public class TeamController {

    @Autowired
    private TeamService teamService;      // ← Inyección de dependencia

    @GetMapping                           // GET /api/teams
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/active")                // GET /api/teams/active
    public ResponseEntity<List<TeamDTO>> getActiveTeams() {
        return ResponseEntity.ok(teamService.getActiveTeams());
    }

    @GetMapping("/{id}")                  // GET /api/teams/123
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }

    @PostMapping                          // POST /api/teams
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO teamDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(teamService.createTeam(teamDTO));
    }

    @PutMapping("/{id}")                  // PUT /api/teams/123
    public ResponseEntity<TeamDTO> updateTeam(
            @PathVariable Long id,
            @RequestBody TeamDTO teamDTO) {
        return ResponseEntity.ok(teamService.updateTeam(id, teamDTO));
    }

    @DeleteMapping("/{id}")               // DELETE /api/teams/123
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")                // GET /api/teams/search?nombre=Real&categoria=SENIOR
    public ResponseEntity<List<TeamDTO>> searchTeams(
            @RequestParam(required = false) String nombre,
            @RequestParam AgeCategory categoria) {
        return ResponseEntity.ok(teamService.searchByNameAndCategoria(nombre, categoria));
    }
}
```

#### ANOTACIONES PRINCIPALES

| Anotación | Descripción |
|-----------|-------------|
| `@RestController` | Combina @Controller + @ResponseBody |
| `@RequestMapping` | Define el prefijo de ruta |
| `@GetMapping` | Maneja peticiones GET |
| `@PostMapping` | Maneja peticiones POST |
| `@PutMapping` | Maneja peticiones PUT |
| `@DeleteMapping` | Maneja peticiones DELETE |
| `@PathVariable` | Extrae variable de la URL |
| `@RequestParam` | Extrae parámetro de query string |
| `@RequestBody` | Deserializa JSON del body |

#### CÓMO AÑADIR UNO NUEVO
```java
// 1. Crear archivo: controller/MiController.java
@RestController
@RequestMapping("/api/mi-recurso")
public class MiController {

    @Autowired
    private MiService miService;

    @GetMapping
    public ResponseEntity<List<MiDTO>> getAll() {
        return ResponseEntity.ok(miService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MiDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(miService.getById(id));
    }

    @PostMapping
    public ResponseEntity<MiDTO> create(@RequestBody MiDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(miService.create(dto));
    }
}
```

---

### 3.2 Services (Lógica de Negocio)

#### QUÉ ES
Un **Service** contiene la lógica de negocio. Procesa datos, aplica reglas y coordina entre Controllers y Repositories.

#### CÓMO FUNCIONA
```java
// backend/src/main/java/lareferente/backend/service/TeamService.java
@Service                                  // ← Marca como servicio de Spring
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TeamDTO> getActiveTeams() {
        return teamRepository.findByActivoTrueOrderByNombreAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public TeamDTO getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con ID: " + id));
        return convertToDTO(team);
    }

    public TeamDTO createTeam(TeamDTO dto) {
        Team team = new Team();
        team.setNombre(dto.getNombre());
        team.setNombreCompleto(dto.getNombreCompleto());
        team.setCategoria(dto.getCategoria() != null ? dto.getCategoria() : AgeCategory.SENIOR);
        team.setPais(dto.getPais());
        team.setCiudad(dto.getCiudad());
        team.setEstadio(dto.getEstadio());
        team.setActivo(true);

        Team saved = teamRepository.save(team);
        return convertToDTO(saved);
    }

    public TeamDTO updateTeam(Long id, TeamDTO dto) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        team.setNombre(dto.getNombre());
        team.setNombreCompleto(dto.getNombreCompleto());
        // ... más campos

        Team updated = teamRepository.save(team);
        return convertToDTO(updated);
    }

    public void deleteTeam(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
        team.setActivo(false);            // ← Soft delete (no elimina, marca inactivo)
        teamRepository.save(team);
    }

    // Convierte Entity a DTO (no expone la entidad directamente)
    private TeamDTO convertToDTO(Team team) {
        TeamDTO dto = new TeamDTO();
        dto.setId(team.getId());
        dto.setNombre(team.getNombre());
        dto.setNombreCompleto(team.getNombreCompleto());
        dto.setCategoria(team.getCategoria());
        dto.setPais(team.getPais());
        dto.setCiudad(team.getCiudad());
        dto.setActivo(team.getActivo());
        return dto;
    }
}
```

#### POR QUÉ SE USA
1. **Separación de responsabilidades**: Controller no tiene lógica de negocio
2. **Reutilización**: Varios controllers pueden usar el mismo service
3. **Transacciones**: Se pueden anotar métodos con `@Transactional`
4. **Testabilidad**: Fácil de testear con mocks

---

### 3.3 Repositories (Acceso a Datos)

#### QUÉ ES
Un **Repository** es una interfaz que extiende `JpaRepository` y proporciona métodos para acceder a la base de datos. Spring Data JPA genera la implementación automáticamente.

#### CÓMO FUNCIONA
```java
// backend/src/main/java/lareferente/backend/repository/TeamRepository.java
@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    // Métodos derivados: Spring genera el SQL automáticamente
    Optional<Team> findByNombre(String nombre);

    List<Team> findByActivoTrueOrderByNombreAsc();

    List<Team> findByPaisAndActivoTrue(String pais);

    List<Team> findByCiudadAndActivoTrue(String ciudad);

    // Query personalizada con JPQL
    @Query("SELECT DISTINCT t FROM Team t INNER JOIN Player p ON p.equipo.id = t.id WHERE t.activo = true")
    List<Team> findTeamsWithPlayers();

    // Query con parámetros nombrados
    @Query("SELECT t FROM Team t WHERE LOWER(t.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) AND t.activo = true")
    List<Team> searchByName(@Param("nombre") String nombre);

    // Query con múltiples parámetros
    @Query("SELECT t FROM Team t WHERE LOWER(t.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')) " +
           "AND t.categoria = :categoria AND t.activo = true ORDER BY t.nombre ASC")
    List<Team> searchByNameAndCategoria(
            @Param("nombre") String nombre,
            @Param("categoria") AgeCategory categoria);

    // Contar registros
    @Query("SELECT COUNT(p) FROM Player p WHERE p.equipo.id = :teamId AND p.activo = true")
    Long countPlayersByTeam(@Param("teamId") Long teamId);
}
```

#### MÉTODOS DERIVADOS (Naming Conventions)

| Método | SQL Generado |
|--------|--------------|
| `findByNombre(String)` | `WHERE nombre = ?` |
| `findByActivoTrue()` | `WHERE activo = true` |
| `findByPaisAndActivoTrue(String)` | `WHERE pais = ? AND activo = true` |
| `findByNombreContainingIgnoreCase(String)` | `WHERE LOWER(nombre) LIKE LOWER('%?%')` |
| `findByFechaCreacionAfter(LocalDate)` | `WHERE fecha_creacion > ?` |
| `findByEdadBetween(int, int)` | `WHERE edad BETWEEN ? AND ?` |
| `findFirstByOrderByNombreAsc()` | `ORDER BY nombre ASC LIMIT 1` |
| `countByActivoTrue()` | `SELECT COUNT(*) WHERE activo = true` |

---

### 3.4 Entities/Models (Mapeo JPA)

#### QUÉ ES
Una **Entity** es una clase Java que representa una tabla en la base de datos. JPA mapea los atributos de la clase a columnas de la tabla.

#### CÓMO FUNCIONA
```java
// backend/src/main/java/lareferente/backend/model/Team.java
@Entity                                   // ← Marca como entidad JPA
@Table(name = "equipos")                  // ← Nombre de la tabla en BD
@Data                                     // ← Lombok: genera getters, setters, toString
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ← Auto-increment
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(name = "nombre_completo", length = 255)      // ← Nombre de columna diferente
    private String nombreCompleto;

    @Enumerated(EnumType.STRING)                         // ← Guarda como texto, no número
    @Column(nullable = false)
    private AgeCategory categoria = AgeCategory.SENIOR;

    @Column(length = 5)
    private String letra;

    @Column(nullable = false, length = 100)
    private String pais;

    @Column(length = 150)
    private String ciudad;

    @Column(length = 200)
    private String estadio;

    private Integer fundacion;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(columnDefinition = "TEXT")                   // ← Tipo TEXT en PostgreSQL
    private String descripcion;

    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp                                    // ← Hibernate asigna automáticamente
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
}
```

#### RELACIONES ENTRE ENTIDADES
```java
// backend/src/main/java/lareferente/backend/model/Player.java
@Entity
@Table(name = "jugadores")
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    // Relación Many-to-One: Muchos jugadores pertenecen a un equipo
    @ManyToOne(fetch = FetchType.LAZY)    // ← LAZY: no carga equipo hasta que se accede
    @JoinColumn(name = "equipo_id")        // ← Columna FK en tabla jugadores
    private Team equipo;
}
```

```java
// backend/src/main/java/lareferente/backend/model/News.java
@Entity
@Table(name = "noticias")
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "autor_id", nullable = false)
    private User autor;

    @UpdateTimestamp                       // ← Se actualiza automáticamente
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;
}
```

---

### 3.5 DTOs (Data Transfer Objects)

#### QUÉ ES
Un **DTO** es un objeto simple que transporta datos entre capas. Se usa para no exponer las entidades JPA directamente en la API.

#### CÓMO FUNCIONA
```java
// backend/src/main/java/lareferente/backend/dto/TeamDTO.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TeamDTO {
    private Long id;
    private String nombre;
    private String nombreCompleto;
    private AgeCategory categoria;
    private String letra;
    private String pais;
    private String ciudad;
    private String estadio;
    private Integer fundacion;
    private String logoUrl;
    private String descripcion;
    private Boolean activo;
    // NO incluye: fechaCreacion (interno), relaciones complejas
}
```

#### POR QUÉ NO EXPONER ENTIDADES

| Problema con Entidades | Solución con DTOs |
|------------------------|-------------------|
| Expone campos internos (password, fechas sistema) | Solo incluye campos necesarios |
| Lazy loading puede fallar fuera de transacción | DTO tiene datos aplanados |
| Serialización circular (equipo → jugadores → equipo) | No hay referencias circulares |
| Cambiar entidad afecta API | DTO aísla cambios internos |

---

### 3.6 Security Config (JWT)

#### QUÉ ES
La configuración de seguridad define qué endpoints son públicos, cuáles requieren autenticación, y cómo se procesa el JWT.

#### CÓMO FUNCIONA
```java
// backend/src/main/java/lareferente/backend/config/SecurityConfig.java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())                    // API REST no usa CSRF
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Endpoints públicos
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/teams/active", "/api/teams/{id}").permitAll()
                .requestMatchers("/api/players/active", "/api/players/{id}").permitAll()
                .requestMatchers("/api/news/published", "/api/news/featured").permitAll()
                .requestMatchers("/api/matches/**").permitAll()
                .requestMatchers("/api/competitions/active", "/api/competitions/{id}").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // Resto requiere autenticación
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Sin sesiones
            )
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

---

### 3.7 JWT (JSON Web Token)

#### JwtUtil - Generación y Validación
```java
// backend/src/main/java/lareferente/backend/security/JwtUtil.java
@Component
public class JwtUtil {

    @Value("${jwt.secret:L4R3F3R3N73VLTR4S3CVR1TYBYY115VS}")
    private String secret;

    @Value("${jwt.expiration:86400000}")  // 24 horas
    private Long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public Boolean validateToken(String token, String email) {
        final String tokenEmail = extractEmail(token);
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
}
```

#### JwtRequestFilter - Filtro de Peticiones
```java
// backend/src/main/java/lareferente/backend/security/JwtRequestFilter.java
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String email = null;
        String jwt = null;

        // Extraer token del header "Authorization: Bearer xxxxx"
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
            try {
                email = jwtUtil.extractEmail(jwt);
            } catch (Exception e) {
                // Token inválido, continuar sin autenticación
            }
        }

        // Si hay email y no hay autenticación previa
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtUtil.validateToken(jwt, email)) {
                String role = jwtUtil.extractRole(jwt);
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.singletonList(authority)
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Establecer autenticación en el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}
```

---

### 3.8 Enums

```java
// backend/src/main/java/lareferente/backend/enums/UserRole.java
public enum UserRole {
    ADMIN,      // Acceso total
    EDITOR,     // Puede crear/editar contenido
    USER        // Usuario normal
}

// backend/src/main/java/lareferente/backend/enums/PlayerPosition.java
public enum PlayerPosition {
    PORTERO,
    DEFENSA,
    CENTROCAMPISTA,
    DELANTERO
}

// backend/src/main/java/lareferente/backend/enums/AgeCategory.java
public enum AgeCategory {
    SENIOR,
    JUVENIL,
    CADETE,
    INFANTIL,
    ALEVIN,
    BENJAMIN,
    PREBENJAMIN
}

// backend/src/main/java/lareferente/backend/enums/MatchStatus.java
public enum MatchStatus {
    PROGRAMADO,
    EN_CURSO,
    FINALIZADO,
    APLAZADO,
    CANCELADO
}

// backend/src/main/java/lareferente/backend/enums/NewsCategory.java
public enum NewsCategory {
    GENERAL,
    FICHAJES,
    PARTIDOS,
    LESIONES,
    RUEDAS_PRENSA,
    NOTICIA,
    ENTREVISTA,
    ANALISIS,
    OPINION
}
```

---

### 3.9 DataLoader (Carga Inicial)

```java
// backend/src/main/java/lareferente/backend/config/DataLoader.java
@Component
@RequiredArgsConstructor
@Slf4j
@Profile("!test")  // No ejecutar en tests
public class DataLoader implements CommandLineRunner {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (teamRepository.count() == 0) {
            log.info("Cargando datos iniciales...");
            loadUsers();
            loadTeams();
            loadPlayers();
            log.info("Datos iniciales cargados correctamente");
        }
    }

    private void loadUsers() {
        User admin = new User();
        admin.setEmail("admin@lareferente.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setNombre("Administrador");
        admin.setRol(UserRole.ADMIN);
        admin.setActivo(true);
        userRepository.save(admin);
    }

    private void loadTeams() {
        List<Team> teams = List.of(
            createTeam("Real Madrid", "España", "Madrid", "Santiago Bernabéu", 1902),
            createTeam("Barcelona", "España", "Barcelona", "Camp Nou", 1899)
        );
        teamRepository.saveAll(teams);
    }
}
```

---

### 3.10 application.properties

```properties
# backend/src/main/resources/application.properties

# Nombre de la aplicación
spring.application.name=lareferente-backend

# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/lareferente
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update    # Actualiza schema automáticamente
spring.jpa.show-sql=true                 # Muestra SQL en consola
spring.jpa.properties.hibernate.format_sql=true

# Server
server.port=8080

# JWT Configuration
jwt.secret=L4R3F3R3N73VLTR4S3CVR1TYBYY115VS
jwt.expiration=86400000                  # 24 horas en ms

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=uploads

# Swagger/OpenAPI
springdoc.api-docs.path=/api-docs
```

---

## 4. BASE DE DATOS

### 4.1 Modelo Entidad-Relación

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    USUARIOS     │       │    NOTICIAS     │       │   COMENTARIOS   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ PK id           │       │ PK id           │       │ PK id           │
│    email        │◄──────┤ FK autor_id     │◄──────┤ FK noticia_id   │
│    password     │       │    titulo       │       │ FK usuario_id   │──┐
│    nombre       │       │    subtitulo    │       │    contenido    │  │
│    apellidos    │       │    contenido    │       │    aprobado     │  │
│    rol          │       │    categoria    │       │    fecha_creac  │  │
│    activo       │       │    destacada    │       └─────────────────┘  │
│    fecha_reg    │       │    publicada    │                            │
└─────────────────┘       │    visitas      │                            │
         │                └─────────────────┘                            │
         └───────────────────────────────────────────────────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  COMPETICIONES  │       │    PARTIDOS     │       │    EQUIPOS      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ PK id           │◄──────┤ FK competicion  │   ┌──►│ PK id           │
│    nombre       │       │ FK equipo_local │───┘   │    nombre       │
│    tipo         │       │ FK equipo_visit │───────│    categoria    │
│    categoria    │       │    fecha_hora   │       │    pais         │
│    temporada    │       │    estadio      │       │    ciudad       │
│    fecha_inicio │       │    jornada      │       │    estadio      │
│    fecha_fin    │       │    goles_local  │       │    fundacion    │
│    activa       │       │    goles_visit  │       │    activo       │
└─────────────────┘       │    estado       │       └─────────────────┘
                          └─────────────────┘               │
                                                            │
┌─────────────────┐       ┌─────────────────┐               │
│   JUGADORES     │       │ CLASIFICACIONES │               │
├─────────────────┤       ├─────────────────┤               │
│ PK id           │       │ PK id           │               │
│ FK equipo_id    │───────│ FK competicion  │               │
│    nombre       │       │ FK equipo_id    │───────────────┘
│    apellidos    │       │    posicion     │
│    posicion     │       │    puntos       │
│    dorsal       │       │    victorias    │
│    nacionalidad │       │    empates      │
│    activo       │       │    derrotas     │
└─────────────────┘       └─────────────────┘
```

### 4.2 Tablas y Campos

#### Tabla: `usuarios`
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | Identificador único |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email del usuario |
| password | VARCHAR(255) | NOT NULL | Hash BCrypt |
| nombre | VARCHAR(100) | NOT NULL | Nombre |
| apellidos | VARCHAR(150) | | Apellidos |
| rol | VARCHAR(20) | NOT NULL | ADMIN, EDITOR, USER |
| activo | BOOLEAN | NOT NULL, DEFAULT true | Estado |
| fecha_registro | TIMESTAMP | NOT NULL | Fecha de registro |
| ultima_conexion | TIMESTAMP | | Último login |

#### Tabla: `equipos`
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | Identificador único |
| nombre | VARCHAR(200) | NOT NULL | Nombre corto |
| nombre_completo | VARCHAR(255) | | Nombre oficial |
| categoria | VARCHAR(20) | NOT NULL | SENIOR, JUVENIL, etc. |
| letra | VARCHAR(5) | | Letra identificadora (A, B, C) |
| pais | VARCHAR(100) | NOT NULL | País |
| ciudad | VARCHAR(150) | | Ciudad |
| estadio | VARCHAR(200) | | Nombre del estadio |
| fundacion | INTEGER | | Año de fundación |
| logo_url | VARCHAR(500) | | URL del logo |
| descripcion | TEXT | | Descripción |
| activo | BOOLEAN | NOT NULL, DEFAULT true | Estado |
| fecha_creacion | TIMESTAMP | NOT NULL | Fecha de creación |

#### Tabla: `jugadores`
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | Identificador único |
| equipo_id | BIGINT | FK → equipos | Equipo actual |
| nombre | VARCHAR(100) | NOT NULL | Nombre |
| apellidos | VARCHAR(150) | NOT NULL | Apellidos |
| fecha_nacimiento | DATE | NOT NULL | Fecha nacimiento |
| nacionalidad | VARCHAR(100) | NOT NULL | Nacionalidad |
| posicion | VARCHAR(20) | NOT NULL | PORTERO, DEFENSA, etc. |
| categoria | VARCHAR(20) | NOT NULL | Categoría de edad |
| dorsal | INTEGER | | Número de camiseta |
| altura | DECIMAL(3,2) | | Altura en metros |
| peso | DECIMAL(5,2) | | Peso en kg |
| foto_url | VARCHAR(500) | | URL de la foto |
| activo | BOOLEAN | NOT NULL, DEFAULT true | Estado |

#### Tabla: `competiciones`
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | Identificador único |
| nombre | VARCHAR(200) | NOT NULL | Nombre corto |
| nombre_completo | VARCHAR(255) | | Nombre oficial |
| tipo | VARCHAR(20) | NOT NULL | LIGA, COPA |
| categoria | VARCHAR(20) | NOT NULL | Categoría de edad |
| pais | VARCHAR(100) | | País |
| temporada | VARCHAR(20) | NOT NULL | Ej: "2025-2026" |
| fecha_inicio | DATE | | Fecha de inicio |
| fecha_fin | DATE | | Fecha de fin |
| activa | BOOLEAN | NOT NULL, DEFAULT true | Estado |

#### Tabla: `partidos`
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | Identificador único |
| competicion_id | BIGINT | FK → competiciones, NOT NULL | Competición |
| equipo_local_id | BIGINT | FK → equipos, NOT NULL | Equipo local |
| equipo_visitante_id | BIGINT | FK → equipos, NOT NULL | Equipo visitante |
| fecha_hora | TIMESTAMP | NOT NULL | Fecha y hora |
| estadio | VARCHAR(200) | | Estadio |
| jornada | INTEGER | | Número de jornada |
| goles_local | INTEGER | NOT NULL, DEFAULT 0 | Goles local |
| goles_visitante | INTEGER | NOT NULL, DEFAULT 0 | Goles visitante |
| estado | VARCHAR(20) | NOT NULL | PROGRAMADO, EN_CURSO, etc. |

#### Tabla: `noticias`
| Campo | Tipo | Restricciones | Descripción |
|-------|------|---------------|-------------|
| id | BIGSERIAL | PK | Identificador único |
| autor_id | BIGINT | FK → usuarios, NOT NULL | Autor |
| titulo | VARCHAR(255) | NOT NULL | Título |
| subtitulo | VARCHAR(300) | | Subtítulo |
| contenido | TEXT | NOT NULL | Contenido completo |
| imagen_principal_url | VARCHAR(500) | | URL imagen |
| categoria | VARCHAR(20) | NOT NULL | Categoría |
| destacada | BOOLEAN | NOT NULL, DEFAULT false | Es destacada |
| publicada | BOOLEAN | NOT NULL, DEFAULT false | Está publicada |
| fecha_publicacion | TIMESTAMP | | Fecha publicación |
| visitas | INTEGER | NOT NULL, DEFAULT 0 | Contador visitas |

### 4.3 Por Qué PostgreSQL

| Característica | Beneficio |
|----------------|-----------|
| **ACID Compliant** | Transacciones seguras, integridad de datos |
| **Tipos nativos** | JSON, Arrays, UUID, TIMESTAMP WITH TIME ZONE |
| **JSONB** | Almacenamiento eficiente de datos semi-estructurados |
| **Full-text search** | Búsqueda de texto integrada |
| **Extensiones** | PostGIS para geolocalización, pg_trgm para fuzzy search |
| **Rendimiento** | Superior a MySQL en operaciones complejas |
| **Concurrencia** | MVCC permite lecturas sin bloqueos |
| **Replicación** | Streaming replication nativo |

---

## 5. AUTENTICACIÓN - FLUJO COMPLETO

### 5.1 Diagrama de Flujo de Login

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│   USUARIO   │                    │  FRONTEND   │                    │   BACKEND   │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │ 1. Ingresa email/password        │                                  │
       │─────────────────────────────────►│                                  │
       │                                  │                                  │
       │                                  │ 2. POST /api/auth/login          │
       │                                  │  { email, password }             │
       │                                  │─────────────────────────────────►│
       │                                  │                                  │
       │                                  │                      3. Busca usuario por email
       │                                  │                         UserRepository.findByEmail()
       │                                  │                                  │
       │                                  │                      4. Verifica password
       │                                  │                         BCrypt.matches()
       │                                  │                                  │
       │                                  │                      5. Si válido, genera JWT
       │                                  │                         JwtUtil.generateToken()
       │                                  │                                  │
       │                                  │ 6. Response: { token, email,     │
       │                                  │    nombre, rol }                 │
       │                                  │◄─────────────────────────────────│
       │                                  │                                  │
       │                                  │ 7. Guarda en localStorage:       │
       │                                  │    - token                       │
       │                                  │    - usuario (JSON)              │
       │                                  │                                  │
       │                                  │ 8. Actualiza signal:             │
       │                                  │    usuario.set({...})            │
       │                                  │                                  │
       │ 9. Redirige a la app            │                                  │
       │◄─────────────────────────────────│                                  │
       │                                  │                                  │
```

### 5.2 Flujo de Petición Autenticada

```
┌─────────────┐                    ┌─────────────┐                    ┌─────────────┐
│  COMPONENTE │                    │INTERCEPTORS │                    │   BACKEND   │
└──────┬──────┘                    └──────┬──────┘                    └──────┬──────┘
       │                                  │                                  │
       │ 1. teamService.getAll()          │                                  │
       │─────────────────────────────────►│                                  │
       │                                  │                                  │
       │                    2. authInterceptor:                              │
       │                       - Lee token de localStorage                   │
       │                       - Clona request                               │
       │                       - Añade header:                               │
       │                         Authorization: Bearer eyJhbG...             │
       │                                  │                                  │
       │                                  │ 3. GET /api/teams               │
       │                                  │    Authorization: Bearer xxx     │
       │                                  │─────────────────────────────────►│
       │                                  │                                  │
       │                                  │                    4. JwtRequestFilter:
       │                                  │                       - Extrae token del header
       │                                  │                       - Valida firma y expiración
       │                                  │                       - Extrae email y rol
       │                                  │                       - Establece SecurityContext
       │                                  │                                  │
       │                                  │                    5. SecurityConfig:
       │                                  │                       - Verifica permisos
       │                                  │                       - Permite acceso
       │                                  │                                  │
       │                                  │                    6. Controller → Service
       │                                  │                       → Repository → DB
       │                                  │                                  │
       │                                  │ 7. Response: [{ team1 }, ...]   │
       │                                  │◄─────────────────────────────────│
       │                                  │                                  │
       │                    8. errorInterceptor:                             │
       │                       - Si 200 OK, pasa respuesta                   │
       │                       - Si 401, limpia token y redirige             │
       │                                  │                                  │
       │ 9. Observable<Team[]>           │                                  │
       │◄─────────────────────────────────│                                  │
       │                                  │                                  │
       │ 10. teams.set(data)              │                                  │
       │                                  │                                  │
```

### 5.3 Código del Flujo Completo

**1. Frontend - Login Component**
```typescript
// Componente llama al servicio
this.authService.login({ email, password }).subscribe({
  next: () => this.router.navigate(['/usuario']),
  error: (err) => this.errorMessage = err.message
});
```

**2. Frontend - AuthService**
```typescript
login(datos: LoginRequest): Observable<LoginResponse> {
  return this.http.post<LoginResponse>('/api/auth/login', datos).pipe(
    tap((respuesta) => {
      localStorage.setItem('token', respuesta.token);
      localStorage.setItem('usuario', JSON.stringify({
        email: respuesta.email,
        nombre: respuesta.nombre,
        rol: respuesta.rol
      }));
      this.usuario.set({ ... });
    })
  );
}
```

**3. Backend - AuthController**
```java
@PostMapping("/login")
public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
    return ResponseEntity.ok(authService.login(request));
}
```

**4. Backend - AuthService**
```java
public LoginResponseDTO login(LoginRequestDTO request) {
    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new RuntimeException("Credenciales inválidas");
    }

    String token = jwtUtil.generateToken(user.getEmail(), user.getRol().name());

    return new LoginResponseDTO(token, user.getEmail(),
            user.getNombre() + " " + user.getApellidos(), user.getRol().name());
}
```

**5. JWT Generado (ejemplo)**
```
eyJhbGciOiJIUzM4NCJ9.eyJyb2xlIjoiQURNSU4iLCJzdWIiOiJhZG1pbkBsYXJlZmVyZW50ZS5jb20iLCJpYXQiOjE3MDU2NzIwMDAsImV4cCI6MTcwNTc1ODQwMH0.xxx
```

**Payload decodificado:**
```json
{
  "role": "ADMIN",
  "sub": "admin@lareferente.com",
  "iat": 1705672000,
  "exp": 1705758400
}
```

---

## 6. INFRAESTRUCTURA Y DESPLIEGUE

### 6.1 Docker Compose - Desarrollo

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  postgres:
    image: postgres:16
    container_name: lareferente-postgres-dev
    environment:
      POSTGRES_DB: lareferente
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data-dev:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: lareferente-backend-dev
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/lareferente
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: postgres
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: lareferente-frontend-dev
    ports:
      - "4200:4200"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

volumes:
  postgres-data-dev:

networks:
  default:
    name: lareferente-network
```

### 6.2 Docker Compose - Producción

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:16
    container_name: lareferente-postgres-prod
    environment:
      POSTGRES_DB: lareferente
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-changeme}
    volumes:
      - postgres-data-prod:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-postgres}"]

  backend:
    build: ./backend
    container_name: lareferente-backend-prod
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/lareferente
      SPRING_DATASOURCE_USERNAME: ${DB_USER:-postgres}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD:-changeme}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "8081:8080"
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: lareferente-frontend-prod
    ports:
      - "8082:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres-data-prod:
```

### 6.3 Nginx Configuration

```nginx
# frontend/nginx.conf
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Rutas de Angular (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy para API
    location /api {
        proxy_pass http://backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Compresión Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### 6.4 Dockerfiles

**Backend (multi-stage):**
```dockerfile
# backend/Dockerfile
FROM gradle:8.11-jdk21 AS build
WORKDIR /app
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
COPY src ./src
RUN ./gradlew build -x test --no-daemon

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Frontend (multi-stage):**
```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx ng build

FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 6.5 Variables de Entorno

```bash
# .env.example
DB_USER=postgres
DB_PASSWORD=changeme
JWT_SECRET=L4R3F3R3N73VLTR4S3CVR1TYBYY115VS
JWT_EXPIRATION=86400000
```

### 6.6 Despliegue en VPS

```bash
# 1. Clonar repositorio
git clone https://github.com/user/lareferente.git
cd lareferente

# 2. Crear archivo .env
cp .env.example .env
nano .env  # Editar con valores de producción

# 3. Construir y levantar
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Verificar
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f

# 5. Acceso
# Frontend: http://servidor:8082
# Backend API: http://servidor:8081/api
# Swagger: http://servidor:8081/swagger-ui.html
```

---

## 7. GUÍAS "CÓMO HACER"

### 7.1 Crear un Nuevo Componente Angular

```bash
# 1. Generar componente standalone
ng generate component pages/mi-componente --standalone

# 2. Archivos generados:
# src/app/pages/mi-componente/
#   ├── mi-componente.ts
#   ├── mi-componente.html
#   ├── mi-componente.scss
#   └── mi-componente.spec.ts
```

```typescript
// 3. Estructura básica del componente
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-componente.html',
  styleUrl: './mi-componente.scss'
})
export class MiComponente {
  // Signals para estado
  datos = signal<MiTipo[]>([]);
  loading = signal(false);

  // Inyección de servicios
  private miService = inject(MiService);

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading.set(true);
    this.miService.getAll().subscribe({
      next: (data) => this.datos.set(data),
      error: (err) => console.error(err),
      complete: () => this.loading.set(false)
    });
  }
}
```

```typescript
// 4. Añadir a rutas (app.routes.ts)
import { MiComponente } from './pages/mi-componente/mi-componente';

export const routes: Routes = [
  { path: 'mi-ruta', component: MiComponente }
];
```

---

### 7.2 Crear un Nuevo Servicio Angular

```bash
ng generate service core/services/mi-servicio
```

```typescript
// src/app/core/services/mi-servicio.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { MiTipo, CreateMiTipoDto } from '../models';

@Injectable({ providedIn: 'root' })
export class MiServicioService {
  private api = inject(ApiService);
  private endpoint = 'mi-recurso';

  getAll(): Observable<MiTipo[]> {
    return this.api.get<MiTipo[]>(this.endpoint);
  }

  getById(id: number): Observable<MiTipo> {
    return this.api.get<MiTipo>(`${this.endpoint}/${id}`);
  }

  create(dto: CreateMiTipoDto): Observable<MiTipo> {
    return this.api.post<MiTipo>(this.endpoint, dto);
  }

  update(id: number, dto: Partial<CreateMiTipoDto>): Observable<MiTipo> {
    return this.api.put<MiTipo>(`${this.endpoint}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
```

---

### 7.3 Añadir una Nueva Ruta

```typescript
// app.routes.ts

// Ruta simple
{ path: 'nueva-pagina', component: NuevaPagina }

// Ruta con parámetro
{ path: 'detalle/:id', component: DetallePagina }

// Ruta con hijos
{
  path: 'seccion',
  children: [
    { path: '', component: ListadoSeccion },
    { path: ':id', component: DetalleSeccion }
  ]
}

// Ruta protegida con guard
{
  path: 'privado',
  canActivate: [authGuard],
  component: PaginaPrivada
}

// Ruta con lazy loading
{
  path: 'modulo',
  loadChildren: () => import('./pages/modulo/modulo.routes').then(m => m.moduloRoutes)
}

// Ruta con resolver
{
  path: 'recurso/:id',
  component: RecursoDetalle,
  resolve: { recurso: recursoResolver }
}
```

---

### 7.4 Crear un Nuevo Endpoint en Backend

**1. Crear DTO:**
```java
// dto/MiRecursoDTO.java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MiRecursoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Boolean activo;
}
```

**2. Crear Entity:**
```java
// model/MiRecurso.java
@Entity
@Table(name = "mi_recursos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MiRecurso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;
}
```

**3. Crear Repository:**
```java
// repository/MiRecursoRepository.java
@Repository
public interface MiRecursoRepository extends JpaRepository<MiRecurso, Long> {
    List<MiRecurso> findByActivoTrueOrderByNombreAsc();
    Optional<MiRecurso> findByNombre(String nombre);
}
```

**4. Crear Service:**
```java
// service/MiRecursoService.java
@Service
public class MiRecursoService {
    @Autowired
    private MiRecursoRepository repository;

    public List<MiRecursoDTO> getAll() {
        return repository.findByActivoTrueOrderByNombreAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MiRecursoDTO getById(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("No encontrado"));
    }

    public MiRecursoDTO create(MiRecursoDTO dto) {
        MiRecurso entity = new MiRecurso();
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setActivo(true);
        return toDTO(repository.save(entity));
    }

    private MiRecursoDTO toDTO(MiRecurso entity) {
        return new MiRecursoDTO(
            entity.getId(),
            entity.getNombre(),
            entity.getDescripcion(),
            entity.getActivo()
        );
    }
}
```

**5. Crear Controller:**
```java
// controller/MiRecursoController.java
@RestController
@RequestMapping("/api/mi-recursos")
public class MiRecursoController {
    @Autowired
    private MiRecursoService service;

    @GetMapping
    public ResponseEntity<List<MiRecursoDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MiRecursoDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<MiRecursoDTO> create(@RequestBody MiRecursoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }
}
```

**6. Configurar seguridad (si es público):**
```java
// SecurityConfig.java
.requestMatchers("/api/mi-recursos/**").permitAll()
```

---

### 7.5 Añadir una Nueva Entidad a la BD

```java
// 1. Crear la Entity con anotaciones JPA
@Entity
@Table(name = "nueva_tabla")
public class NuevaEntidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Campos...
}

// 2. Spring/Hibernate creará la tabla automáticamente
// (spring.jpa.hibernate.ddl-auto=update)

// 3. Para relaciones:
// Many-to-One (muchos a uno)
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "otra_entidad_id")
private OtraEntidad otraEntidad;

// One-to-Many (uno a muchos)
@OneToMany(mappedBy = "nuevaEntidad", cascade = CascadeType.ALL)
private List<EntidadHija> hijos = new ArrayList<>();
```

---

### 7.6 Crear un Nuevo Guard

```typescript
// src/app/guards/mi-guard.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const miGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Tu lógica de verificación
  if (authService.tienePermiso()) {
    return true;
  }

  // Redirigir si no tiene permiso
  router.navigate(['/sin-permiso']);
  return false;
};

// Uso en rutas:
{ path: 'ruta-protegida', canActivate: [miGuard], component: MiComponente }
```

---

### 7.7 Añadir un Nuevo Store

```typescript
// src/app/core/stores/mi-recurso.store.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { MiRecursoService } from '../services/mi-recurso.service';
import { MiRecurso } from '../models';

@Injectable({ providedIn: 'root' })
export class MiRecursoStore {
  private service = inject(MiRecursoService);

  // Estado privado
  private _items = signal<MiRecurso[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Estado público (readonly)
  items = this._items.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // Computed
  total = computed(() => this._items().length);
  activos = computed(() => this._items().filter(i => i.activo));

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this._loading.set(true);
    this._error.set(null);

    this.service.getAll().subscribe({
      next: (data) => {
        this._items.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message);
        this._loading.set(false);
      }
    });
  }

  agregar(item: MiRecurso): void {
    this._items.update(lista => [...lista, item]);
  }

  eliminar(id: number): void {
    this._items.update(lista => lista.filter(i => i.id !== id));
  }
}
```

---

### 7.8 Implementar una Feature Completa (Full-Stack)

**Ejemplo: Sistema de Comentarios**

**BACKEND:**

```java
// 1. Enum (si necesario)
public enum ComentarioEstado { PENDIENTE, APROBADO, RECHAZADO }

// 2. Entity
@Entity
@Table(name = "comentarios")
public class Comentario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "noticia_id", nullable = false)
    private News noticia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private User usuario;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenido;

    @Enumerated(EnumType.STRING)
    private ComentarioEstado estado = ComentarioEstado.PENDIENTE;

    @CreationTimestamp
    private LocalDateTime fechaCreacion;
}

// 3. DTO
@Data
public class ComentarioDTO {
    private Long id;
    private Long noticiaId;
    private Long usuarioId;
    private String usuarioNombre;
    private String contenido;
    private String estado;
    private LocalDateTime fechaCreacion;
}

// 4. Repository
@Repository
public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByNoticiaIdAndEstadoOrderByFechaCreacionDesc(
        Long noticiaId, ComentarioEstado estado);
}

// 5. Service
@Service
public class ComentarioService {
    @Autowired private ComentarioRepository repo;

    public List<ComentarioDTO> getByNoticia(Long noticiaId) {
        return repo.findByNoticiaIdAndEstadoOrderByFechaCreacionDesc(
            noticiaId, ComentarioEstado.APROBADO)
            .stream().map(this::toDTO).toList();
    }

    public ComentarioDTO create(ComentarioDTO dto) {
        // ... implementación
    }
}

// 6. Controller
@RestController
@RequestMapping("/api/comentarios")
public class ComentarioController {
    @Autowired private ComentarioService service;

    @GetMapping("/noticia/{noticiaId}")
    public ResponseEntity<List<ComentarioDTO>> getByNoticia(@PathVariable Long noticiaId) {
        return ResponseEntity.ok(service.getByNoticia(noticiaId));
    }

    @PostMapping
    public ResponseEntity<ComentarioDTO> create(@RequestBody ComentarioDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }
}
```

**FRONTEND:**

```typescript
// 1. Model
export interface Comentario {
  id: number;
  noticiaId: number;
  usuarioId: number;
  usuarioNombre: string;
  contenido: string;
  estado: string;
  fechaCreacion: string;
}

export interface CreateComentarioDto {
  noticiaId: number;
  contenido: string;
}

// 2. Service
@Injectable({ providedIn: 'root' })
export class ComentarioService {
  private api = inject(ApiService);

  getByNoticia(noticiaId: number): Observable<Comentario[]> {
    return this.api.get<Comentario[]>(`comentarios/noticia/${noticiaId}`);
  }

  create(dto: CreateComentarioDto): Observable<Comentario> {
    return this.api.post<Comentario>('comentarios', dto);
  }
}

// 3. Component
@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comentarios">
      @for (c of comentarios(); track c.id) {
        <div class="comentario">
          <strong>{{ c.usuarioNombre }}</strong>
          <p>{{ c.contenido }}</p>
        </div>
      }

      @if (authService.estaAutenticado()) {
        <form (ngSubmit)="enviar()">
          <textarea [(ngModel)]="nuevoComentario" name="contenido"></textarea>
          <button type="submit">Enviar</button>
        </form>
      }
    </div>
  `
})
export class ComentariosComponent {
  @Input() noticiaId!: number;

  comentarios = signal<Comentario[]>([]);
  nuevoComentario = '';

  private service = inject(ComentarioService);
  authService = inject(AuthService);

  ngOnInit() {
    this.service.getByNoticia(this.noticiaId).subscribe(
      data => this.comentarios.set(data)
    );
  }

  enviar() {
    this.service.create({
      noticiaId: this.noticiaId,
      contenido: this.nuevoComentario
    }).subscribe(nuevo => {
      this.comentarios.update(lista => [nuevo, ...lista]);
      this.nuevoComentario = '';
    });
  }
}
```

---

## 8. PREGUNTAS DE EXAMEN

### 8.1 Preguntas Conceptuales

**1. ¿Qué es un Standalone Component en Angular?**
> Es un componente que no requiere un NgModule para funcionar. Se declara con `standalone: true` e importa directamente sus dependencias en el array `imports` del decorador.

**2. ¿Qué es un Signal en Angular?**
> Es una primitiva reactiva que encapsula un valor y notifica a los consumidores cuando ese valor cambia. Se lee llamándolo como función: `miSignal()`, y se actualiza con `set()` o `update()`.

**3. ¿Cuál es la diferencia entre Signal y Observable (RxJS)?**
> - **Signal**: Valor síncrono, lectura simple con `()`, no requiere unsubscribe, ideal para estado local
> - **Observable**: Stream asíncrono, requiere `.subscribe()`, hay que hacer unsubscribe, ideal para eventos y streams complejos

**4. ¿Qué es un Interceptor en Angular?**
> Es una función que intercepta todas las peticiones HTTP salientes o respuestas entrantes. Se usa para añadir headers (autenticación), manejar errores globalmente, o logging.

**5. ¿Qué es un Guard en Angular?**
> Es una función que decide si una ruta puede activarse (`CanActivate`), desactivarse (`CanDeactivate`), o si sus hijos pueden cargarse (`CanActivateChild`).

**6. ¿Qué es un Resolver en Angular?**
> Es una función que precarga datos antes de que una ruta se active. Garantiza que los datos estén disponibles cuando el componente se renderiza.

**7. ¿Qué es JWT y cómo funciona?**
> JSON Web Token es un estándar para transmitir información de forma segura. Consta de 3 partes (header.payload.signature) codificadas en Base64. El servidor genera el token tras login y el cliente lo envía en cada petición.

**8. ¿Qué es JPA?**
> Java Persistence API es una especificación para mapear objetos Java a tablas de base de datos (ORM). Hibernate es la implementación más común.

**9. ¿Qué es un DTO y por qué se usa?**
> Data Transfer Object es un objeto que transporta datos entre capas. Se usa para no exponer entidades JPA directamente (evita lazy loading issues, campos sensibles, referencias circulares).

**10. ¿Qué es Spring Data JPA?**
> Es un módulo de Spring que simplifica el acceso a datos. Genera implementaciones automáticas de repositorios basándose en convenciones de nombres de métodos.

---

### 8.2 Preguntas de Código

**11. ¿Cómo inyectas un servicio en Angular moderno?**
```typescript
// Con inject() (preferido en standalone)
private miService = inject(MiService);

// Con constructor (tradicional)
constructor(private miService: MiService) {}
```

**12. ¿Cómo creas un signal y lo actualizas?**
```typescript
// Crear
datos = signal<string[]>([]);

// Leer
const valor = this.datos();

// Establecer nuevo valor
this.datos.set(['nuevo']);

// Actualizar basado en valor anterior
this.datos.update(actual => [...actual, 'nuevo']);
```

**13. ¿Cómo defines un endpoint GET en Spring Boot?**
```java
@GetMapping("/ruta")
public ResponseEntity<MiDTO> metodo() {
    return ResponseEntity.ok(service.getData());
}

@GetMapping("/{id}")
public ResponseEntity<MiDTO> getById(@PathVariable Long id) {
    return ResponseEntity.ok(service.getById(id));
}
```

**14. ¿Cómo defines una relación Many-to-One en JPA?**
```java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "equipo_id")
private Team equipo;
```

**15. ¿Cómo creas un método de búsqueda derivado en Spring Data?**
```java
// El método se implementa automáticamente
List<Team> findByActivoTrueOrderByNombreAsc();
List<Player> findByEquipoIdAndPosicion(Long equipoId, PlayerPosition posicion);
Optional<User> findByEmail(String email);
```

**16. ¿Cómo proteges una ruta en Angular?**
```typescript
{
  path: 'privado',
  canActivate: [authGuard],
  component: ComponentePrivado
}
```

**17. ¿Cómo añades el token JWT a las peticiones?**
```typescript
// En el interceptor
const authReq = req.clone({
  setHeaders: { Authorization: `Bearer ${token}` }
});
return next(authReq);
```

**18. ¿Cómo validas un token en el backend?**
```java
// En JwtRequestFilter
if (jwtUtil.validateToken(jwt, email)) {
    // Establecer autenticación en SecurityContext
}
```

---

### 8.3 Preguntas de Arquitectura

**19. ¿Por qué separar DTOs de Entities?**
> - Evita exponer campos sensibles (password, timestamps internos)
> - Previene problemas de lazy loading fuera de transacciones
> - Elimina referencias circulares en serialización JSON
> - Permite evolucionar la API sin cambiar el modelo de datos

**20. ¿Por qué usar ITCSS para los estilos?**
> - Organización predecible y escalable
> - Especificidad creciente (evita !important)
> - Fácil de mantener en equipos grandes
> - Separa settings, tools, generic, elements, objects, components, utilities

**21. ¿Por qué usar Signals en lugar de RxJS para estado?**
> - Código más simple y legible
> - No hay riesgo de memory leaks por olvidar unsubscribe
> - Mejor rendimiento con detección de cambios
> - Preparación para Angular Zoneless

**22. ¿Por qué JWT en lugar de sesiones?**
> - Stateless: el servidor no guarda estado
> - Escalabilidad horizontal: cualquier instancia puede validar
> - Microservicios: token válido en múltiples servicios
> - Mobile friendly: fácil almacenamiento local

**23. ¿Por qué PostgreSQL en lugar de MySQL?**
> - Mejor soporte de tipos (JSON, Arrays, UUID)
> - ACID compliant con mejor rendimiento
> - Full-text search nativo
> - Mejor concurrencia (MVCC)

---

### 8.4 Preguntas Prácticas

**24. ¿Cómo añadirías un nuevo rol de usuario (MODERATOR)?**
```java
// 1. Añadir al enum
public enum UserRole {
    ADMIN, EDITOR, MODERATOR, USER
}

// 2. Crear guard en frontend
export const moderatorGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.usuario()?.rol === 'MODERATOR' ||
         auth.usuario()?.rol === 'ADMIN';
};

// 3. Proteger endpoints en backend
@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
```

**25. ¿Cómo implementarías paginación?**
```java
// Backend - Repository
Page<Team> findByActivoTrue(Pageable pageable);

// Backend - Controller
@GetMapping
public Page<TeamDTO> getAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "10") int size) {
    return service.getAll(PageRequest.of(page, size));
}

// Frontend
this.api.get<PaginatedResponse<Team>>('teams', { page: 0, size: 10 });
```

**26. ¿Cómo añadirías búsqueda por texto?**
```java
// Repository
@Query("SELECT t FROM Team t WHERE " +
       "LOWER(t.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
       "LOWER(t.ciudad) LIKE LOWER(CONCAT('%', :query, '%'))")
List<Team> search(@Param("query") String query);
```

**27. ¿Cómo implementarías soft delete?**
```java
// Entity tiene campo activo
private Boolean activo = true;

// Service marca como inactivo
public void delete(Long id) {
    Entity e = repo.findById(id).orElseThrow();
    e.setActivo(false);
    repo.save(e);
}

// Queries filtran por activo
List<Entity> findByActivoTrue();
```

**28. ¿Cómo manejarías la subida de archivos?**
```java
// Backend
@PostMapping("/upload")
public ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) {
    String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
    Path path = Paths.get(uploadDir, filename);
    Files.copy(file.getInputStream(), path);
    return ResponseEntity.ok(filename);
}

// Frontend
const formData = new FormData();
formData.append('file', file);
this.api.upload('files/upload', formData);
```

**29. ¿Cómo implementarías validación de formularios?**
```typescript
// Frontend con Reactive Forms
form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(8)])
});

// Template
@if (form.get('email')?.errors?.['required']) {
  <span class="error">Email requerido</span>
}
```

**30. ¿Cómo añadirías caché a las peticiones?**
```typescript
// Usando shareReplay de RxJS
private cache$ = this.api.get<Team[]>('teams').pipe(
  shareReplay(1)
);

getAll(): Observable<Team[]> {
  return this.cache$;
}

// Invalidar caché
invalidateCache() {
  this.cache$ = this.api.get<Team[]>('teams').pipe(shareReplay(1));
}
```

---

## 9. GLOSARIO TÉCNICO

| Término | Definición |
|---------|------------|
| **Angular** | Framework de desarrollo web frontend basado en TypeScript |
| **API REST** | Interfaz de programación que usa HTTP para operaciones CRUD |
| **BEM** | Block Element Modifier: metodología de nomenclatura CSS |
| **BCrypt** | Algoritmo de hash para contraseñas |
| **CORS** | Cross-Origin Resource Sharing: política de seguridad del navegador |
| **CSRF** | Cross-Site Request Forgery: tipo de ataque web |
| **DTO** | Data Transfer Object: objeto para transferir datos entre capas |
| **Entity** | Clase Java que representa una tabla de base de datos |
| **Guard** | Función que protege rutas en Angular |
| **Hibernate** | Implementación de JPA para mapeo objeto-relacional |
| **Interceptor** | Función que intercepta peticiones HTTP |
| **ITCSS** | Inverted Triangle CSS: arquitectura de estilos escalable |
| **JPA** | Java Persistence API: especificación ORM para Java |
| **JPQL** | Java Persistence Query Language: lenguaje de consultas JPA |
| **JWT** | JSON Web Token: estándar de autenticación stateless |
| **Lazy Loading** | Carga diferida de módulos o datos |
| **Lombok** | Biblioteca Java que genera código boilerplate |
| **ManyToOne** | Relación donde muchos registros apuntan a uno |
| **NgModule** | Contenedor de componentes en Angular (deprecated en standalone) |
| **Observable** | Stream de datos asíncrono en RxJS |
| **ORM** | Object-Relational Mapping: mapeo objeto-relacional |
| **PostgreSQL** | Sistema de gestión de base de datos relacional |
| **Repository** | Interfaz de acceso a datos en Spring Data |
| **Resolver** | Función que precarga datos antes de activar una ruta |
| **RxJS** | Biblioteca de programación reactiva para JavaScript |
| **Service** | Clase que encapsula lógica de negocio |
| **Signal** | Primitiva reactiva de Angular para gestión de estado |
| **Spring Boot** | Framework Java para crear aplicaciones web |
| **Spring Security** | Módulo de Spring para autenticación y autorización |
| **Standalone** | Componente Angular independiente de NgModule |
| **TypeScript** | Superset tipado de JavaScript |

---

## 10. CHEATSHEET RÁPIDO

### Angular - Comandos Esenciales
```bash
ng new proyecto --standalone    # Crear proyecto
ng g c nombre --standalone      # Generar componente
ng g s nombre                   # Generar servicio
ng serve                        # Servidor desarrollo
ng build                        # Build producción
ng test                         # Ejecutar tests
```

### Angular - Signals
```typescript
// Crear
const count = signal(0);

// Leer
const valor = count();

// Escribir
count.set(5);
count.update(n => n + 1);

// Computed (derivado)
const doble = computed(() => count() * 2);

// Readonly (exposición pública)
readonly = this._signal.asReadonly();
```

### Angular - Routing
```typescript
// Rutas básicas
{ path: 'home', component: Home }
{ path: 'item/:id', component: Item }
{ path: '**', redirectTo: '404' }

// Protegidas
{ path: 'admin', canActivate: [authGuard], component: Admin }

// Lazy loading
{ path: 'modulo', loadChildren: () => import('./modulo/routes').then(m => m.routes) }

// Con resolver
{ path: 'detalle/:id', resolve: { data: miResolver }, component: Detalle }
```

### Spring Boot - Anotaciones
```java
@RestController           // Controlador REST
@RequestMapping("/api")   // Prefijo de rutas
@GetMapping("/ruta")      // GET
@PostMapping("/ruta")     // POST
@PutMapping("/{id}")      // PUT
@DeleteMapping("/{id}")   // DELETE
@PathVariable             // Parámetro de URL
@RequestParam             // Parámetro de query
@RequestBody              // Body JSON

@Service                  // Servicio
@Repository               // Repositorio
@Entity                   // Entidad JPA
@Table(name = "tabla")    // Nombre de tabla
@Id                       // Primary key
@GeneratedValue           // Auto-increment
@Column                   // Columna
@ManyToOne               // Relación N:1
@JoinColumn              // Foreign key

@Autowired               // Inyección
@Value("${prop}")        // Leer property
@Transactional           // Transacción
```

### Spring Data - Métodos Derivados
```java
findByNombre(String)              // WHERE nombre = ?
findByActivoTrue()                // WHERE activo = true
findByPaisAndCiudad(String, String) // WHERE pais = ? AND ciudad = ?
findByNombreContaining(String)    // WHERE nombre LIKE %?%
findByEdadGreaterThan(int)        // WHERE edad > ?
findByFechaBetween(Date, Date)    // WHERE fecha BETWEEN ? AND ?
countByActivoTrue()               // SELECT COUNT(*) WHERE activo = true
existsByEmail(String)             // SELECT EXISTS
```

### Docker - Comandos
```bash
docker-compose up -d              # Levantar en background
docker-compose down               # Detener
docker-compose logs -f            # Ver logs
docker-compose ps                 # Estado
docker-compose build              # Reconstruir imágenes
docker exec -it container bash    # Entrar al contenedor
```

### JWT - Estructura
```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzA1NzU4NDAwfQ.signature

Header: { "alg": "HS256" }
Payload: { "sub": "user", "role": "ADMIN", "exp": 1705758400 }
Signature: HMACSHA256(header + "." + payload, secret)
```

### Endpoints del Proyecto
```
# Autenticación
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/check-email?email=x

# Equipos
GET  /api/teams/active
GET  /api/teams/{id}
POST /api/teams
PUT  /api/teams/{id}
DELETE /api/teams/{id}

# Jugadores
GET  /api/players/active
GET  /api/players/team/{teamId}
GET  /api/players/{id}

# Noticias
GET  /api/news/published
GET  /api/news/featured
GET  /api/news/{id}
POST /api/news/{id}/view

# Competiciones
GET  /api/competitions/active
GET  /api/competitions/{id}

# Partidos
GET  /api/matches
GET  /api/matches/upcoming
```

### Usuarios de Prueba
```
Admin:  admin@lareferente.com / admin123
Editor: editor@lareferente.com / editor123
```

---

**Documento generado para el proyecto LaReferente**
*Versión: 1.0 | Angular 20 + Spring Boot 3.4 + PostgreSQL 16*

