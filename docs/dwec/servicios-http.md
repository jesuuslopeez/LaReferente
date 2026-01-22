# Servicios y comunicación HTTP

En este documento explico como he montado toda la capa de comunicación con el backend, los servicios que consumen la API y como gestiono los errores y estados de carga.

---

## 1. Arquitectura General

He separado la logica HTTP en varias capas para mantener el codigo organizado:

```
core/
├── interceptors/       # Modifican las peticiones/respuestas
├── models/            # Interfaces y tipos
└── services/          # Servicios que consumen la API
```

La idea es que los componentes no trabajen directamente con HttpClient. En su lugar, usan servicios de dominio (como `NewsService`) que a su vez usan un `ApiService` base. Asi si cambio algo de la API solo tengo que tocar un sitio.

---

## 2. ApiService - El Servicio Base

Este es el nucleo de todas las peticiones HTTP. Tiene metodos genericos para cada operacion CRUD:

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api';

  get<T>(endpoint: string, params?: HttpParams | { [key: string]: string | number }): Observable<T> {
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

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, body).pipe(
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
}
```

### Por que uso genericos

El `<T>` me permite tipar la respuesta. Cuando llamo a `api.get<News[]>('news')`, TypeScript sabe que voy a recibir un array de noticias. Esto me da autocompletado y deteccion de errores en tiempo de desarrollo.

### Retry automatico

En los GET he puesto un `retry` que reintenta la peticion 2 veces con 1 segundo de espera si falla. Esto ayuda con errores de red puntuales. No lo pongo en POST/PUT/DELETE porque esas operaciones no son idempotentes y podria causar problemas (crear duplicados, por ejemplo).

### Construccion de parametros

Para las peticiones GET que llevan query params, tengo un metodo helper:

```typescript
private buildParams(params: HttpParams | { [key: string]: string | number }): HttpParams {
  if (params instanceof HttpParams) {
    return params;
  }

  let httpParams = new HttpParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      httpParams = httpParams.set(key, String(params[key]));
    }
  });
  return httpParams;
}
```

Esto me permite pasar parametros como objeto normal: `api.get('news', { page: 1, limit: 10 })` y el metodo se encarga de convertirlo a HttpParams.

---

## 3. Servicios de Dominio

Los servicios de dominio encapsulan la logica especifica de cada entidad. Por ejemplo, `NewsService`:

```typescript
@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly api = inject(ApiService);
  private readonly endpoint = 'news';

  getAll(): Observable<News[]> {
    return this.api.get<News[]>(this.endpoint);
  }

  getPublished(): Observable<News[]> {
    return this.api.get<News[]>(`${this.endpoint}/published`);
  }

  getById(id: number): Observable<News> {
    return this.api.get<News>(`${this.endpoint}/${id}`);
  }

  create(dto: CreateNewsDto): Observable<News> {
    return this.api.post<News>(this.endpoint, dto);
  }

  update(id: number, dto: UpdateNewsDto): Observable<News> {
    return this.api.put<News>(`${this.endpoint}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
```

### Transformacion de datos

A veces necesito adaptar los datos que vienen del backend antes de usarlos en la vista. Para eso uso el operador `map`:

```typescript
getPublishedForView(): Observable<News[]> {
  return this.getPublished().pipe(
    map(noticias => noticias.map(n => ({
      ...n,
      fechaPublicacion: n.fechaPublicacion
        ? new Date(n.fechaPublicacion).toLocaleDateString('es-ES')
        : null
    })))
  );
}
```

Aqui transformo las fechas a formato legible antes de que lleguen al componente.

---

## 4. Interceptores

Los interceptores son funciones que se ejecutan en cada peticion HTTP. Los configuro en `app.config.ts`:

```typescript
provideHttpClient(
  withFetch(),
  withInterceptors([
    authInterceptor,
    errorInterceptor,
    loggingInterceptor
  ])
)
```

El orden importa: primero se ejecuta `authInterceptor`, luego `errorInterceptor` y finalmente `loggingInterceptor`.

### authInterceptor

Anade el token JWT a las peticiones que lo necesitan:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // En SSR no hay localStorage
  if (!isPlatformBrowser(platformId)) {
    return next(req);
  }

  // Rutas publicas que no necesitan token
  const publicUrls = ['/auth/login', '/auth/register', '/public'];
  const isPublicUrl = publicUrls.some(url => req.url.includes(url));

  if (isPublicUrl) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
```

Uso `isPlatformBrowser` porque en SSR (Server Side Rendering) no existe `localStorage` y petaria.

### errorInterceptor

Maneja los errores HTTP de forma centralizada:

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Error inesperado. Intentalo de nuevo mas tarde.';
      let showToast = true;

      switch (error.status) {
        case 0:
          message = 'No hay conexion con el servidor.';
          break;
        case 400:
          message = error.error?.message || 'Los datos enviados no son validos.';
          break;
        case 401:
          message = 'Tu sesion ha expirado. Por favor, inicia sesion de nuevo.';
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          router.navigate(['/login']);
          break;
        case 403:
          message = 'No tienes permisos para realizar esta accion.';
          break;
        case 404:
          message = 'El recurso solicitado no existe.';
          showToast = false; // Dejo que el componente lo maneje
          break;
        case 429:
          message = 'Demasiadas peticiones. Espera un momento.';
          break;
        default:
          if (error.status >= 500) {
            message = 'Error interno del servidor. Intentalo mas tarde.';
          }
      }

      if (showToast) {
        toast.error(message);
      }

      return throwError(() => ({ status: error.status, message, original: error }));
    })
  );
};
```

Lo que me gusta de este enfoque es que no tengo que repetir el manejo de errores en cada componente. Si hay un 401, automaticamente limpio la sesion y redirijo al login.

### loggingInterceptor

Solo para desarrollo. Muestra en consola las peticiones y respuestas con colores:

```typescript
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isDevMode()) {
    return next(req);
  }

  const started = Date.now();
  const method = req.method;
  const url = req.urlWithParams;

  console.log(`%c[HTTP] → ${method} ${url}`, 'color: #2196F3; font-weight: bold');

  return next(req).pipe(
    tap({
      next: event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          const color = event.status >= 200 && event.status < 300 ? '#4CAF50' : '#FF9800';
          console.log(`%c[HTTP] ← ${method} ${url} [${event.status}] (${elapsed}ms)`, `color: ${color}`);
        }
      },
      error: err => {
        const elapsed = Date.now() - started;
        console.log(`%c[HTTP] ✗ ${method} ${url} [${err.status}] (${elapsed}ms)`, 'color: #F44336');
      }
    })
  );
};
```

Muy util para debuggear. En produccion se desactiva solo gracias a `isDevMode()`.

---

## 5. Modelos e Interfaces

Tengo todas las interfaces en `core/models/`. Esto me da tipado fuerte y autocompletado:

```typescript
// news.model.ts
export type NewsCategory = 'FICHAJES' | 'PARTIDOS' | 'LESIONES' | 'RUEDAS_PRENSA' | 'GENERAL';

export interface News {
  id: number;
  titulo: string;
  subtitulo: string;
  contenido: string;
  imagenPrincipalUrl: string | null;
  autorId: number;
  autorNombre: string;
  categoria: NewsCategory;
  destacada: boolean;
  publicada: boolean;
  fechaPublicacion: string | null;
  visitas: number;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

export interface CreateNewsDto {
  titulo: string;
  subtitulo?: string;
  contenido: string;
  // ...
}
```

### Patron RequestState

Para manejar el estado de las peticiones en los componentes uso esta interfaz:

```typescript
export interface RequestState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}
```

Y en el componente:

```typescript
state = signal<RequestState<News[]>>({
  loading: false,
  error: null,
  data: null,
});

loadNews(): void {
  this.state.set({ loading: true, error: null, data: null });

  this.newsService.getPublished().subscribe({
    next: (noticias) => {
      this.state.set({ loading: false, error: null, data: noticias });
    },
    error: (err) => {
      this.state.set({
        loading: false,
        error: err.message || 'Error al cargar las noticias',
        data: null,
      });
    },
  });
}
```

Esto me permite mostrar spinners, mensajes de error o los datos segun el estado actual.

---

## 6. Servicio de Autenticacion

El `AuthService` gestiona todo lo relacionado con login, registro y sesion:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private platformId = inject(PLATFORM_ID);

  usuario = signal<Usuario | null>(null);
  cargando = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    this.cargarUsuarioGuardado();
  }

  login(datos: LoginRequest): Observable<LoginResponse> {
    this.cargando.set(true);

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, datos).pipe(
      tap((respuesta) => {
        if (this.isBrowser) {
          localStorage.setItem('token', respuesta.token);
          localStorage.setItem('usuario', JSON.stringify({
            email: respuesta.email,
            nombre: respuesta.nombre,
            rol: respuesta.rol,
          }));
        }
        this.usuario.set({
          email: respuesta.email,
          nombre: respuesta.nombre,
          rol: respuesta.rol,
        });
        this.cargando.set(false);
      }),
      catchError((error) => {
        this.cargando.set(false);
        throw error;
      })
    );
  }

  cerrarSesion(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    this.usuario.set(null);
    this.router.navigate(['/']);
  }

  estaAutenticado(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem('token');
  }
}
```

Uso signals para el estado del usuario, asi los componentes se actualizan automaticamente cuando cambia.

---

## 7. ToastService para Notificaciones

Un servicio sencillo basado en BehaviorSubject para mostrar mensajes al usuario:

```typescript
@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  public toast$ = this.toastSubject.asObservable();

  success(message: string, duration = 4000): void {
    this.toastSubject.next({ message, type: 'success', duration });
  }

  error(message: string, duration = 8000): void {
    this.toastSubject.next({ message, type: 'error', duration });
  }

  info(message: string, duration = 3000): void {
    this.toastSubject.next({ message, type: 'info', duration });
  }

  warning(message: string, duration = 6000): void {
    this.toastSubject.next({ message, type: 'warning', duration });
  }
}
```

El `errorInterceptor` usa este servicio para mostrar los errores HTTP automaticamente.

---

## Resumen

| Elemento | Proposito |
|----------|-----------|
| `ApiService` | CRUD generico con retry y manejo de errores |
| `NewsService` | Operaciones especificas de noticias |
| `AuthService` | Login, registro, sesion |
| `authInterceptor` | Anadir token Bearer |
| `errorInterceptor` | Manejo global de errores HTTP |
| `loggingInterceptor` | Debug en desarrollo |
| `RequestState<T>` | Patron para estados de carga |
| `ToastService` | Notificaciones al usuario |

La clave de esta arquitectura es que cada pieza tiene una responsabilidad clara. Los componentes no saben nada de HTTP, solo llaman a metodos del servicio de dominio y reaccionan a los datos que reciben.
