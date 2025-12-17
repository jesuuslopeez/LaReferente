# Arquitectura de Servicios - La Referente

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    Componentes (UI Layer)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │  Toast   │  │ Loading  │  │   Card   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        │          inject()      AsyncPipe      Signals
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                  Servicios Reactivos (Singleton)             │
│  ┌────────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │ Communication  │  │   Toast    │  │     Loading      │  │
│  │   Service      │  │  Service   │  │     Service      │  │
│  │                │  │            │  │                  │  │
│  │ BehaviorSubject│  │ BehaviorSu-│  │ BehaviorSubject  │  │
│  │ <string>       │  │ bject<Toast│  │ <boolean>        │  │
│  │                │  │ Message>   │  │ + requestCount   │  │
│  └────────────────┘  └────────────┘  └──────────────────┘  │
│                                                              │
│  @Injectable({ providedIn: 'root' })                        │
└──────────────────────────────────────────────────────────────┘
        │                     │                    │
        ▼                     ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│              Estado Global Reactivo (RxJS + Signals)         │
│         notifications$ | toast$ | isLoading$                │
└──────────────────────────────────────────────────────────────┘
```

## Servicios Implementados

### 1. CommunicationService
**Ubicación:** `src/app/shared/services/communication.ts`

**Propósito:** Comunicación entre componentes hermanos o no relacionados.

**Características:**
- Usa `BehaviorSubject<string>` para notificaciones
- Patrón Observable/Subject
- Singleton con `providedIn: 'root'`

**Uso:**
```typescript
// Emisor
constructor(private comm: CommunicationService) {}
onAction() {
  this.comm.sendNotification('Mensaje desde componente A');
}

// Receptor
ngOnInit() {
  this.comm.notifications$.subscribe(msg =>
    console.log('Recibido:', msg)
  );
}
```

### 2. ToastService
**Ubicación:** `src/app/shared/services/toast.ts`

**Propósito:** Sistema centralizado de notificaciones tipo toast.

**Características:**
- Interfaz `ToastMessage` tipada
- Tipos: success, error, info, warning
- Duración configurable por tipo
- Auto-dismiss configurable

**Uso:**
```typescript
constructor(private toast: ToastService) {}

onSuccess() {
  this.toast.success('¡Operación exitosa!', 3000);
}

onError() {
  this.toast.error('Error de validación');
}
```

**Duraciones por defecto:**
- Success: 4000ms
- Error: 8000ms
- Info: 3000ms
- Warning: 6000ms

### 3. LoadingService
**Ubicación:** `src/app/shared/services/loading.ts`

**Propósito:** Gestión de estados de carga global y local.

**Características:**
- Control de múltiples requests simultáneos
- `BehaviorSubject<boolean>` para estado reactivo
- Contador interno para requests pendientes

**Uso:**
```typescript
// Servicio
saveUser(user: User): Observable<User> {
  this.loadingService.show();
  return this.http.post<User>('/api/users', user).pipe(
    finalize(() => this.loadingService.hide())
  );
}

// Componente con loading local
isSaving = signal(false);

save() {
  this.isSaving.set(true);
  this.userService.saveUser(this.user).subscribe({
    next: () => this.isSaving.set(false),
    error: () => this.isSaving.set(false)
  });
}
```

## Componentes de UI

### Toast Component
**Ubicación:** `src/app/shared/components/toast/`

**Características:**
- Se suscribe automáticamente a `ToastService`
- Auto-dismiss con timeout configurable
- Botón de cierre manual
- Animaciones de entrada/salida
- Posicionamiento fixed superior derecha

**Incluir en app.component.html:**
```html
<app-toast />
```

## Patrones de Comunicación

### 1. Observable/Subject
- **BehaviorSubject:** Estado persistente con valor inicial
- **Subject:** Eventos one-time sin valor histórico
- **ReplaySubject:** Historial limitado de emisiones

### 2. Servicio Singleton
- Todos los servicios usan `providedIn: 'root'`
- Única instancia compartida en toda la aplicación
- Inyección automática sin necesidad de providers

### 3. Signals + AsyncPipe
- Signals para estado reactivo local en componentes
- AsyncPipe en templates para auto-suscripción/desuscripción
- Sin memory leaks

## Buenas Prácticas de Separación de Responsabilidades

### Componentes "Dumb" ✅
```typescript
@Component({...})
export class UserList {
  users$ = this.userService.getUsers();
  selectedUser = signal<User | null>(null);

  constructor(private userService: UserService) {}

  onSelect(user: User) {
    this.selectedUser.set(user);
    this.userService.selectUser(user.id);
  }
}
```

**Responsabilidades:**
- Solo templates y presentación
- Signals locales para UI state
- Handlers que delegan a servicios
- Sin HTTP, validaciones o lógica compleja

### Servicios "Smart" ✅
```typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private toast: ToastService,
    private loading: LoadingService
  ) {}

  getUsers(): Observable<User[]> {
    this.loading.show();
    return this.http.get<User[]>('/api/users').pipe(
      map(users => users.filter(u => u.active)),
      tap(() => this.toast.success('Usuarios cargados')),
      catchError(this.handleError),
      finalize(() => this.loading.hide())
    );
  }

  private handleError(err: any) {
    this.toast.error('Error cargando usuarios');
    return throwError(() => new Error('Error'));
  }
}
```

**Responsabilidades:**
- Lógica de negocio
- Caching y estado global
- Validaciones
- Orquestación de APIs
- Manejo de errores

## Estructura de Carpetas

```
src/app/
├── shared/
│   ├── services/
│   │   ├── communication.ts
│   │   ├── toast.ts
│   │   └── loading.ts
│   └── components/
│       └── toast/
│           ├── toast.ts
│           ├── toast.html
│           └── toast.scss
├── features/
│   ├── user/
│   │   ├── user.component.ts
│   │   └── user.service.ts
│   └── product/
│       ├── product.component.ts
│       └── product.service.ts
```

## Flujo de Datos Unidireccional

```
Usuario Interactúa → Componente (Handler)
                          ↓
                    Servicio de Dominio
                          ↓
                    Servicios Reactivos
                    (Toast/Loading/Communication)
                          ↓
                    Estado Global (BehaviorSubject)
                          ↓
                    Componentes se actualizan (Observable/Signal)
                          ↓
                    Vista se renderiza
```

## Ventajas de esta Arquitectura

1. **Testabilidad:** Servicios y componentes se pueden testear independientemente
2. **Reutilización:** Servicios compartidos en múltiples componentes
3. **Mantenibilidad:** Responsabilidades claras y separadas
4. **Escalabilidad:** Fácil añadir nuevos servicios sin afectar componentes
5. **OnPush Change Detection:** Compatible con estrategia optimizada
6. **Type Safety:** TypeScript en toda la arquitectura

## Demo Interactiva en Home

El componente `Home` incluye una sección completa para probar todos los servicios implementados:

### Funcionalidades disponibles

1. **Toast Success**: Notificación verde de éxito (4s)
2. **Toast Error**: Notificación roja de error (8s)
3. **Toast Info**: Notificación azul informativa (3s)
4. **Toast Warning**: Notificación naranja de advertencia (6s)
5. **Simular Loading**: Spinner global + botón deshabilitado (2s)
6. **Enviar Notificación**: Comunicación con timestamp

### Acceso

Ejecutar el proyecto y navegar a: `http://localhost:4200/`

### Código de ejemplo implementado

```typescript
export class Home {
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private commService = inject(CommunicationService);

  isLoading = signal(false);
  lastMessage = signal('');

  constructor() {
    this.commService.notifications$.subscribe(msg => {
      if (msg) {
        this.lastMessage.set(msg);
        this.toastService.info(`Mensaje recibido: ${msg}`);
      }
    });
  }

  showSuccessToast() {
    this.toastService.success('¡Operación exitosa!');
  }

  simulateLoading() {
    this.isLoading.set(true);
    this.loadingService.show();

    setTimeout(() => {
      this.isLoading.set(false);
      this.loadingService.hide();
      this.toastService.success('¡Carga completada!');
    }, 2000);
  }

  sendNotification() {
    const timestamp = new Date().toLocaleTimeString();
    this.commService.sendNotification(`Notificación enviada a las ${timestamp}`);
  }
}
```

## Entregables Completados

- ✅ **Servicio de comunicación entre componentes**: `CommunicationService` con BehaviorSubject
- ✅ **Sistema de notificaciones funcional**: `ToastService` + componente Toast con 4 tipos
- ✅ **Loading states en operaciones asíncronas**: `LoadingService` con contador de requests
- ✅ **Separación clara entre lógica y presentación**: Componentes "dumb" + servicios "smart"
- ✅ **Documentación de arquitectura**: Este documento con diagramas y ejemplos

## Siguientes Pasos Recomendados

- Implementar HttpInterceptor para loading automático en llamadas HTTP
- Añadir signalStore (NgRx 18+) para estado complejo de dominio
- Crear facade services para orquestar múltiples observables
- Implementar caching en servicios de datos
