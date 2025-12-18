# Arquitectura de Servicios y Comunicacion

Este documento describe la arquitectura de servicios implementada en el proyecto, incluyendo el sistema de comunicacion entre componentes, notificaciones, estados de carga y la separacion entre logica y presentacion.

---

## 1. Patron de Servicios en Angular

La aplicacion implementa un patron de arquitectura basado en servicios que centraliza la logica de negocio y facilita la comunicacion entre componentes desacoplados.

### Principios aplicados

- **Single Responsibility**: Cada servicio tiene una unica responsabilidad
- **Dependency Injection**: Los servicios se inyectan donde se necesitan
- **Observables**: Uso de RxJS para comunicacion reactiva
- **Singleton Pattern**: Servicios con `providedIn: 'root'` como instancias unicas

---

## 2. Servicio de Comunicacion entre Componentes

El `CommunicationService` permite la comunicacion entre componentes que no tienen relacion padre-hijo directa.

### Implementacion

**Servicio** (`shared/services/communication.ts`):

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private notificationSubject = new BehaviorSubject<string>('');
  public notifications$: Observable<string> = this.notificationSubject.asObservable();

  sendNotification(message: string): void {
    this.notificationSubject.next(message);
  }
}
```

### Patron BehaviorSubject

El `BehaviorSubject` es un tipo especial de Observable que:

- Mantiene el ultimo valor emitido
- Emite inmediatamente el valor actual a nuevos suscriptores
- Permite emitir nuevos valores mediante `next()`

### Uso en componentes

**Emisor de notificaciones** (`home.ts`):

```typescript
export class Home {
  private commService = inject(CommunicationService);

  sendNotification() {
    const timestamp = new Date().toLocaleTimeString();
    this.commService.sendNotification(`Notificacion enviada a las ${timestamp}`);
  }
}
```

**Receptor de notificaciones**:

```typescript
export class Home {
  private commService = inject(CommunicationService);
  lastMessage = signal('');

  constructor() {
    this.commService.notifications$.subscribe(msg => {
      if (msg) {
        this.lastMessage.set(msg);
        this.toastService.info(`Mensaje recibido: ${msg}`);
      }
    });
  }
}
```

### Diagrama de flujo

```
Componente A                    CommunicationService                 Componente B
     |                                  |                                  |
     |-- sendNotification(msg) -------->|                                  |
     |                                  |-- BehaviorSubject.next(msg) ---->|
     |                                  |                                  |
     |                                  |<-- subscribe() -----------------|
     |                                  |-- emite valor actual ----------->|
```

---

## 3. Sistema de Notificaciones (Toast)

El sistema de notificaciones proporciona feedback visual al usuario mediante mensajes temporales.

### Arquitectura

El sistema sigue el patron de separacion logica-presentacion:

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| Logica | `services/toast.ts` | Gestiona estado y tipos de mensajes |
| Presentacion | `components/toast/toast.ts` | Renderiza y anima los mensajes |

### Servicio ToastService

**Definicion de tipos** (`shared/services/toast.ts`):

```typescript
export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
```

**Implementacion del servicio**:

```typescript
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  public toast$: Observable<ToastMessage | null> = this.toastSubject.asObservable();

  show(message: string, type: ToastMessage['type'], duration = 5000): void {
    this.toastSubject.next({ message, type, duration });
  }

  success(message: string, duration = 4000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 8000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  warning(message: string, duration = 6000): void {
    this.show(message, 'warning', duration);
  }
}
```

### Componente Toast (Presentacion)

**Logica del componente** (`shared/components/toast/toast.ts`):

```typescript
@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  toast = signal<ToastMessage | null>(null);
  private timeoutId: any = null;

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe(msg => {
      this.dismiss();
      this.toast.set(msg);

      if (msg?.duration) {
        this.timeoutId = setTimeout(() => {
          this.toast.set(null);
        }, msg.duration);
      }
    });
  }

  dismiss(): void {
    this.toast.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
```

**Template** (`toast.html`):

```html
@if (toast()) {
  <aside class="toast" [class]="'toast--' + toast()!.type" (click)="dismiss()" role="status" aria-live="polite">
    <span class="toast__message">{{ toast()!.message }}</span>
    <button class="toast__close" (click)="dismiss()" aria-label="Cerrar">x</button>
  </aside>
}
```

### Uso en formularios

**Ejemplo en LoginForm** (`login-form.ts`):

```typescript
export class LoginForm {
  private toastService = inject(ToastService);

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.error('Por favor completa todos los campos correctamente');
      return;
    }

    console.log('Login form submitted', this.loginForm.value);
    this.toastService.success('Inicio de sesion exitoso');
  }
}
```

### Tipos de notificacion y duraciones

| Tipo | Metodo | Duracion por defecto | Uso |
|------|--------|---------------------|-----|
| Success | `success()` | 4000ms | Operaciones completadas correctamente |
| Error | `error()` | 8000ms | Errores que requieren atencion |
| Info | `info()` | 3000ms | Informacion general |
| Warning | `warning()` | 6000ms | Advertencias importantes |

---

## 4. Loading States (Estados de Carga)

El sistema de loading proporciona indicadores visuales durante operaciones asincronas.

### Servicio LoadingService

**Implementacion** (`shared/services/loading.ts`):

```typescript
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.loadingSubject.asObservable();
  private requestCount = 0;

  show(): void {
    this.requestCount++;
    this.loadingSubject.next(this.requestCount > 0);
  }

  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next(false);
    }
  }
}
```

### Patron Request Counter

El servicio implementa un contador de peticiones que:

1. Incrementa al iniciar una operacion (`show()`)
2. Decrementa al finalizar (`hide()`)
3. Solo oculta el loading cuando todas las operaciones terminan

Este patron es util cuando multiples operaciones asincronas pueden ejecutarse simultaneamente.

```
Operacion A: show() -------- hide()
Operacion B:      show() ---------- hide()
                  |                      |
isLoading$:       true -------> true --> false
requestCount:     1 -> 2 -----> 1 -----> 0
```

### Componente Loading (Presentacion)

**Logica** (`shared/components/loading/loading.ts`):

```typescript
@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  private loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.isLoading$;
}
```

**Template** (`loading.html`):

```html
@if (isLoading$ | async) {
  <section class="loading-overlay">
    <section class="loading-spinner">
      <section class="spinner"></section>
      <p class="loading-text">Cargando...</p>
    </section>
  </section>
}
```

### Uso del pipe async

El componente utiliza el pipe `async` que:

- Se suscribe automaticamente al Observable
- Desuscribe al destruir el componente (evita memory leaks)
- Actualiza la vista cuando el valor cambia

### Ejemplo de uso

**Simulacion de carga** (`home.ts`):

```typescript
export class Home {
  private loadingService = inject(LoadingService);
  isLoading = signal(false);

  simulateLoading() {
    this.isLoading.set(true);
    this.loadingService.show();

    setTimeout(() => {
      this.isLoading.set(false);
      this.loadingService.hide();
      this.toastService.success('¡Carga completada!');
    }, 2000);
  }
}
```

---

## 5. Separacion Logica-Presentacion

La arquitectura implementa una clara separacion entre la logica de negocio y la presentacion visual.

### Principio de responsabilidad

| Capa | Responsabilidad | Ejemplo |
|------|-----------------|---------|
| **Servicio** | Logica de negocio, estado, comunicacion | `ToastService`, `LoadingService` |
| **Componente TS** | Conexion entre servicio y template | `Toast`, `Loading` |
| **Template HTML** | Estructura y binding de datos | `toast.html`, `loading.html` |
| **Estilos SCSS** | Presentacion visual | `toast.scss`, `loading.scss` |

### Beneficios de esta separacion

1. **Testabilidad**: Los servicios pueden probarse de forma aislada
2. **Reutilizacion**: Un servicio puede ser usado por multiples componentes
3. **Mantenibilidad**: Cambios en la UI no afectan la logica
4. **Escalabilidad**: Facilita agregar nuevas funcionalidades

### Ejemplo completo: Sistema de notificaciones

```
ToastService (Logica)
       |
       | Observable<ToastMessage>
       v
Toast Component (Controlador)
       |
       | signal<ToastMessage>
       v
toast.html (Vista)
       |
       | CSS classes
       v
toast.scss (Estilos)
```

---

## 6. Inyeccion de Dependencias

Angular proporciona dos formas de inyectar servicios, ambas utilizadas en el proyecto.

### Constructor injection

```typescript
export class Toast {
  constructor(private toastService: ToastService) {
    // ...
  }
}
```

### Funcion inject()

```typescript
export class Loading {
  private loadingService = inject(LoadingService);
}
```

### Comparativa

| Metodo | Ventajas | Uso recomendado |
|--------|----------|-----------------|
| Constructor | Mas explicito, compatible con herencia | Componentes con logica compleja |
| `inject()` | Menos codigo, permite usar fuera del constructor | Inyeccion simple, functional guards |

---

## 7. Resumen de Servicios

| Servicio | Proposito | Patron | Observable |
|----------|-----------|--------|------------|
| `CommunicationService` | Comunicacion entre componentes | BehaviorSubject | `notifications$` |
| `ToastService` | Notificaciones al usuario | BehaviorSubject | `toast$` |
| `LoadingService` | Estados de carga | BehaviorSubject + Counter | `isLoading$` |

---

## 8. Flujo de Datos Completo

```
                    ┌─────────────────────────────────────┐
                    │         Usuario interactua          │
                    └─────────────────────────────────────┘
                                      │
                                      v
                    ┌─────────────────────────────────────┐
                    │    Componente (ej: LoginForm)       │
                    │    - Valida formulario              │
                    │    - Llama al servicio              │
                    └─────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    v                                   v
    ┌───────────────────────────┐     ┌───────────────────────────┐
    │       ToastService        │     │      LoadingService       │
    │   toastSubject.next()     │     │   show() / hide()         │
    └───────────────────────────┘     └───────────────────────────┘
                    │                                   │
                    v                                   v
    ┌───────────────────────────┐     ┌───────────────────────────┐
    │     Toast Component       │     │    Loading Component      │
    │   subscribe(toast$)       │     │   isLoading$ | async      │
    └───────────────────────────┘     └───────────────────────────┘
                    │                                   │
                    v                                   v
    ┌───────────────────────────┐     ┌───────────────────────────┐
    │        toast.html         │     │       loading.html        │
    │   Renderiza notificacion  │     │   Muestra overlay/spinner │
    └───────────────────────────┘     └───────────────────────────┘
```

---

## Tecnologias y Conceptos Utilizados

- **RxJS BehaviorSubject**: Para estado reactivo con valor inicial
- **Angular Signals**: Para estado local en componentes
- **Dependency Injection**: Para desacoplar dependencias
- **Async Pipe**: Para suscripcion automatica a Observables
- **TypeScript Interfaces**: Para tipado fuerte de mensajes
- **Singleton Pattern**: Servicios compartidos en toda la aplicacion
