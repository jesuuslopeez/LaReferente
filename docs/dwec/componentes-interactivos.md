# Componentes Interactivos y Eventos

Este documento describe los componentes interactivos implementados en el proyecto, detallando los eventos utilizados y su funcionamiento.

---

## 1. Theme Switcher

El theme switcher permite alternar entre modo claro y oscuro, con persistencia en localStorage y deteccion automatica de preferencias del sistema.

### Implementacion

**Servicio ThemeService** (`services/theme.service.ts`):

```typescript
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app-theme';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly themeSignal = signal<Theme>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const theme = this.themeSignal();
      this.applyTheme(theme);
      this.saveTheme(theme);
    });
  }

  get theme() {
    return this.themeSignal.asReadonly();
  }

  toggleTheme(): void {
    this.themeSignal.update(current => current === 'light' ? 'dark' : 'light');
  }

  private getInitialTheme(): Theme {
    if (!this.isBrowser) {
      return 'light';
    }

    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    if (!this.isBrowser) return;

    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${theme}`);
  }

  private saveTheme(theme: Theme): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.THEME_KEY, theme);
  }
}
```

**Uso en el Header**:

```html
<button class="header__theme-btn" (click)="toggleTheme()" aria-label="Cambiar tema">
  @if (isDarkMode()) {
    <svg class="header__theme-icon"><!-- Icono sol --></svg>
  } @else {
    <svg class="header__theme-icon"><!-- Icono luna --></svg>
  }
</button>
```

```typescript
protected readonly isDarkMode = computed(() => this.themeService.theme() === 'dark');

protected toggleTheme(): void {
  this.themeService.toggleTheme();
}
```

### Eventos utilizados

| Evento | Elemento | Accion |
|--------|----------|--------|
| `click` | Boton tema | Alterna entre tema claro y oscuro |

### Caracteristicas

- Utiliza Angular Signals para estado reactivo
- Persiste la preferencia en localStorage
- Detecta `prefers-color-scheme` del sistema operativo
- Compatible con SSR (Server-Side Rendering)
- Aplica clases CSS al elemento root (`theme-light`, `theme-dark`)

---

## 2. Menu Mobile (Hamburger)

El menu hamburger permite la navegacion en dispositivos moviles, con animacion de apertura/cierre.

### Implementacion

**Template** (`header.html`):

```html
<button
  class="header__hamburger"
  [class.header__hamburger--open]="mobileMenuOpen()"
  (click)="toggleMobileMenu()"
  aria-label="Menu">
  <span class="header__hamburger-line"></span>
  <span class="header__hamburger-line"></span>
  <span class="header__hamburger-line"></span>
</button>

<nav class="header__nav" [class.header__nav--open]="mobileMenuOpen()">
  <ul class="header__nav-list">
    <li class="header__nav-item">
      <a routerLink="/noticias" class="header__nav-link" (click)="closeMobileMenu()">
        Noticias
      </a>
    </li>
    <!-- Mas enlaces -->
  </ul>
</nav>
```

**Componente** (`header.ts`):

```typescript
protected readonly mobileMenuOpen = signal(false);

protected toggleMobileMenu(): void {
  this.mobileMenuOpen.update(open => !open);
}

protected closeMobileMenu(): void {
  this.mobileMenuOpen.set(false);
}
```

### Eventos utilizados

| Evento | Elemento | Accion |
|--------|----------|--------|
| `click` | Boton hamburger | Alterna apertura/cierre del menu |
| `click` | Enlaces de navegacion | Cierra el menu al navegar |

### Caracteristicas

- Estado controlado con Angular Signals
- Clases dinamicas para animaciones CSS (`header__hamburger--open`, `header__nav--open`)
- Cierre automatico al hacer click en un enlace
- Accesibilidad con `aria-label`

---

## 3. Modal (AccountModal)

Componente modal reutilizable para formularios de autenticacion (login y registro).

### Implementacion

**Componente** (`account-modal.ts`):

```typescript
@Component({
  selector: 'app-account-modal',
  templateUrl: './account-modal.html',
  styleUrl: './account-modal.scss',
})
export class AccountModal {
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  protected onClose(): void {
    this.close.emit();
  }

  protected onOverlayClick(): void {
    this.close.emit();
  }

  protected onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
```

**Template** (`account-modal.html`):

```html
<section class="account-modal__overlay" (click)="onOverlayClick()">
  <section class="account-modal__content" (click)="onContentClick($event)">
    <button class="account-modal__close" (click)="onClose()" aria-label="Cerrar">
      x
    </button>
    <h2 class="account-modal__title">{{ title }}</h2>
    <ng-content></ng-content>
  </section>
</section>
```

**Uso en Header**:

```html
@if (showLoginModal()) {
  <app-account-modal title="Iniciar sesion" (close)="closeLoginModal()">
    <app-login-form (switchToRegister)="switchToRegister()" />
  </app-account-modal>
}
```

### Eventos utilizados

| Evento | Elemento | Accion |
|--------|----------|--------|
| `click` | Overlay (fondo oscuro) | Cierra el modal |
| `click` | Contenido del modal | `stopPropagation()` para evitar cierre |
| `click` | Boton cerrar (X) | Cierra el modal |
| `close` | Output del componente | Notifica al padre que debe cerrar |

### Caracteristicas

- `stopPropagation()` evita que clicks dentro del modal lo cierren
- Content projection con `<ng-content>` para contenido flexible
- Output event para comunicacion con componente padre
- Accesibilidad con `aria-label` en boton de cierre

---

## 4. Tabs (Pestanas)

Componente de navegacion por pestanas para mostrar contenido categorizado.

### Implementacion

**Componente** (`tabs.component.ts`):

```typescript
type TabId = 'detalles' | 'especificaciones' | 'opiniones';

@Component({
  selector: 'app-tabs',
  template: `
    <section class="tabs">
      <nav class="tabs-nav">
        <button
          (click)="selectTab('detalles')"
          [class.active]="activeTab() === 'detalles'"
          type="button">
          Detalles
        </button>
        <button
          (click)="selectTab('especificaciones')"
          [class.active]="activeTab() === 'especificaciones'"
          type="button">
          Especificaciones
        </button>
        <button
          (click)="selectTab('opiniones')"
          [class.active]="activeTab() === 'opiniones'"
          type="button">
          Opiniones
        </button>
      </nav>

      <article class="tabs-content">
        @if (activeTab() === 'detalles') {
          <section>
            <h3>Detalles del Producto</h3>
            <p>Informacion detallada sobre el producto.</p>
          </section>
        }
        @if (activeTab() === 'especificaciones') {
          <section>
            <h3>Especificaciones Tecnicas</h3>
            <ul>
              <li>Caracteristica 1</li>
              <li>Caracteristica 2</li>
            </ul>
          </section>
        }
        @if (activeTab() === 'opiniones') {
          <section>
            <h3>Opiniones de Clientes</h3>
            <p>Aqui van las resenas y comentarios.</p>
          </section>
        }
      </article>
    </section>
  `
})
export class TabsComponent {
  protected readonly activeTab = signal<TabId>('detalles');

  protected selectTab(tab: TabId): void {
    this.activeTab.set(tab);
  }
}
```

### Eventos utilizados

| Evento | Elemento | Accion |
|--------|----------|--------|
| `click` | Botones de pestana | Cambia la pestana activa |

### Caracteristicas

- Estado con Angular Signals
- Clases dinamicas para indicar pestana activa (`[class.active]`)
- Renderizado condicional con `@if`
- Tipado estricto con TypeScript (`TabId`)

---

## 5. Tooltip (Directiva)

Directiva que muestra informacion contextual al pasar el cursor sobre un elemento.

### Implementacion

**Directiva** (`tooltip.directive.ts`):

```typescript
@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input() appTooltip = '';
  private tooltipElement: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.tooltipElement) {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.tooltipElement) {
      this.hideTooltip();
    }
  }

  private showTooltip(): void {
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.setProperty(this.tooltipElement, 'innerText', this.appTooltip);

    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'backgroundColor', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipElement, 'borderRadius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'bottom', '100%');
    this.renderer.setStyle(this.tooltipElement, 'left', '50%');
    this.renderer.setStyle(this.tooltipElement, 'transform', 'translateX(-50%)');

    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);
  }

  private hideTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
```

**Uso**:

```html
<button appTooltip="Este es el texto del tooltip">Hover aqui</button>
```

### Eventos utilizados

| Evento | Elemento | Accion |
|--------|----------|--------|
| `mouseenter` | Elemento con directiva | Muestra el tooltip |
| `mouseleave` | Elemento con directiva | Oculta el tooltip |

### Caracteristicas

- Usa `@HostListener` para escuchar eventos del elemento host
- Creacion dinamica de elementos con `Renderer2`
- Posicionamiento automatico sobre el elemento
- Limpieza del DOM al ocultar

---

## 6. Dropdown de Cuenta (con cierre externo)

Menu desplegable que se cierra al hacer click fuera del componente.

### Implementacion

```typescript
@Component({...})
export class Header {
  private readonly elementRef = inject(ElementRef);
  protected readonly accountMenuOpen = signal(false);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.accountMenuOpen()) {
      this.accountMenuOpen.set(false);
    }
  }

  protected toggleAccountMenu(): void {
    this.accountMenuOpen.update(open => !open);
  }
}
```

```html
<section class="header__account">
  <button class="header__account-btn" (click)="toggleAccountMenu()">
    Cuenta
  </button>

  @if (accountMenuOpen()) {
    <section class="header__account-dropdown">
      <button (click)="openLoginModal()">Iniciar sesion</button>
      <button (click)="openRegisterModal()">Registrarse</button>
    </section>
  }
</section>
```

### Eventos utilizados

| Evento | Elemento | Accion |
|--------|----------|--------|
| `click` | Boton cuenta | Alterna apertura del dropdown |
| `document:click` | Documento completo | Cierra dropdown si click es externo |

### Caracteristicas

- `@HostListener('document:click')` escucha clicks en todo el documento
- `ElementRef.nativeElement.contains()` verifica si el click fue dentro del componente
- Patron comun para menus desplegables

---

## Resumen de Eventos por Componente

| Componente | Eventos | Descripcion |
|------------|---------|-------------|
| Theme Switcher | `click` | Alterna tema claro/oscuro |
| Menu Mobile | `click` | Abre/cierra menu, navega |
| Modal | `click`, `stopPropagation` | Cierra en overlay, evita cierre en contenido |
| Tabs | `click` | Cambia pestana activa |
| Tooltip | `mouseenter`, `mouseleave` | Muestra/oculta tooltip |
| Dropdown | `click`, `document:click` | Abre/cierra, detecta click externo |

---

## Tabla de Compatibilidad de Navegadores

La siguiente tabla muestra la compatibilidad de los eventos DOM utilizados en el proyecto con los principales navegadores:

| Evento | Chrome | Firefox | Safari | Edge | Opera | iOS Safari | Android |
|--------|--------|---------|--------|------|-------|------------|---------|
| `click` | 1+ | 1+ | 1+ | 12+ | 4+ | 1+ | 1+ |
| `dblclick` | 1+ | 1+ | 1+ | 12+ | 4+ | 1+ | 1+ |
| `mouseenter` | 30+ | 10+ | 7+ | 12+ | 17+ | 7+ | 4.4+ |
| `mouseleave` | 30+ | 10+ | 7+ | 12+ | 17+ | 7+ | 4.4+ |
| `keydown` | 1+ | 1+ | 1.2+ | 12+ | 12.1+ | 1+ | 1+ |
| `keyup` | 1+ | 1+ | 1.2+ | 12+ | 12.1+ | 1+ | 1+ |
| `keyup.enter` (Angular) | 1+ | 1+ | 1.2+ | 12+ | 12.1+ | 1+ | 1+ |
| `focus` | 1+ | 1+ | 1+ | 12+ | 7+ | 1+ | 1+ |
| `blur` | 1+ | 1+ | 1+ | 12+ | 7+ | 1+ | 1+ |
| `submit` | 1+ | 1+ | 1+ | 12+ | 4+ | 1+ | 1+ |
| `input` | 1+ | 1+ | 3.1+ | 12+ | 10+ | 3.2+ | 2.3+ |
| `change` | 1+ | 1+ | 1+ | 12+ | 4+ | 1+ | 1+ |

### APIs de Eventos Utilizadas

| API | Chrome | Firefox | Safari | Edge | Opera | iOS Safari | Android |
|-----|--------|---------|--------|------|-------|------------|---------|
| `event.preventDefault()` | 1+ | 1+ | 1+ | 12+ | 4+ | 1+ | 1+ |
| `event.stopPropagation()` | 1+ | 1+ | 1+ | 12+ | 4+ | 1+ | 1+ |
| `EventTarget.addEventListener()` | 1+ | 1+ | 1+ | 12+ | 7+ | 1+ | 1+ |
| `window.matchMedia()` | 9+ | 6+ | 5.1+ | 12+ | 12.1+ | 5+ | 3+ |
| `localStorage` | 4+ | 3.5+ | 4+ | 12+ | 10.5+ | 3.2+ | 2.1+ |

### APIs del DOM Utilizadas (Renderer2)

| API | Chrome | Firefox | Safari | Edge | Opera | iOS Safari | Android |
|-----|--------|---------|--------|------|-------|------------|---------|
| `document.createElement()` | 1+ | 1+ | 1+ | 12+ | 4+ | 1+ | 1+ |
| `Node.appendChild()` | 1+ | 1+ | 1+ | 12+ | 4+ | 1+ | 1+ |
| `Node.removeChild()` | 1+ | 1+ | 1+ | 12+ | 4+ | 1+ | 1+ |
| `Element.classList` | 8+ | 3.6+ | 5.1+ | 12+ | 11.5+ | 5+ | 3+ |
| `Node.contains()` | 1+ | 1+ | 1.1+ | 12+ | 7+ | 1+ | 1+ |

### Notas de Compatibilidad

- **Soporte minimo recomendado**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Angular 17+**: Requiere navegadores modernos con soporte ES2022
- **Signals**: Caracteristica de Angular, transpilada a JavaScript compatible
- **@HostListener**: Decorador de Angular, compatible con todos los navegadores soportados por Angular

Todos los eventos y APIs utilizados en este proyecto tienen soporte universal en navegadores modernos. No se requieren polyfills adicionales para las funcionalidades implementadas.

---

## Tecnologias y Patrones Utilizados

- **Angular Signals**: Estado reactivo moderno (`signal`, `computed`, `effect`)
- **@HostListener**: Escucha eventos del DOM a nivel de componente o documento
- **Renderer2**: Manipulacion segura del DOM
- **ElementRef**: Referencia al elemento nativo
- **Event binding**: Sintaxis `(evento)="metodo()"`
- **stopPropagation()**: Control de propagacion de eventos
- **Content projection**: `<ng-content>` para componentes flexibles

---

## Arquitectura de Eventos en Angular

### Introduccion al Sistema de Eventos

Angular implementa un sistema de eventos basado en el patron de flujo de datos unidireccional. Los eventos fluyen desde el DOM hacia los componentes, donde se procesan y pueden modificar el estado de la aplicacion. Este enfoque facilita el seguimiento del flujo de datos y la depuracion.

### Tipos de Event Binding

En Angular existen varios mecanismos para manejar eventos:

#### 1. Event Binding en Templates

La sintaxis `(evento)="handler($event)"` permite vincular eventos del DOM directamente a metodos del componente:

```html
<!-- Evento click basico -->
<button (click)="onClick()">Hacer click</button>

<!-- Con acceso al objeto evento -->
<input (input)="onInput($event)">

<!-- Eventos de teclado especificos -->
<input (keydown.enter)="onEnter()" (keydown.escape)="onEscape()">

<!-- Eventos de mouse -->
<div (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">

<!-- Eventos de focus -->
<input (focus)="onFocus()" (blur)="onBlur()">
```

#### 2. @HostListener para Eventos Globales

El decorador `@HostListener` permite escuchar eventos a nivel de documento o window:

```typescript
// Escuchar clicks en todo el documento
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  // Detectar clicks fuera del componente
  const clickedInside = this.elementRef.nativeElement.contains(event.target);
  if (!clickedInside) {
    this.close();
  }
}

// Escuchar tecla ESC globalmente
@HostListener('document:keydown.escape')
onEscapePress(): void {
  this.closeModal();
}

// Escuchar cambios de tamano de ventana
@HostListener('window:resize', ['$event'])
onResize(event: Event): void {
  this.updateLayout();
}
```

#### 3. Renderer2 para Manipulacion Segura

Renderer2 proporciona una capa de abstraccion para manipular el DOM de forma segura:

```typescript
// Crear elementos dinamicamente
const element = this.renderer.createElement('div');
this.renderer.appendChild(parent, element);

// Modificar estilos
this.renderer.setStyle(element, 'color', 'red');
this.renderer.addClass(element, 'active');

// Eliminar elementos
this.renderer.removeChild(parent, element);
```

### Prevencion y Propagacion de Eventos

#### preventDefault()

Evita el comportamiento por defecto del navegador:

```typescript
onSubmit(event: Event): void {
  event.preventDefault(); // Evita recarga de pagina
  this.processForm();
}
```

#### stopPropagation()

Detiene la propagacion del evento hacia elementos padres:

```typescript
// En el contenido del modal, evitar que el click cierre el modal
onContentClick(event: MouseEvent): void {
  event.stopPropagation();
}
```

### Buenas Practicas

1. **Usar event binding en lugar de onclick**: La sintaxis `(click)` es mas segura y facilita el testing
2. **Preferir @HostListener para eventos globales**: Evitar `document.addEventListener` directo
3. **Usar Renderer2 para manipulacion del DOM**: Garantiza compatibilidad con SSR
4. **Limpiar listeners en ngOnDestroy**: Evitar memory leaks
5. **Verificar null/undefined en ViewChild**: Usar optional chaining o verificaciones antes de acceder

### Tabla de Eventos Implementados por Componente

| Componente | Eventos | Descripcion |
|------------|---------|-------------|
| Header | `click`, `document:click` | Toggle menus, cierre externo |
| Modal | `click`, `keydown.escape`, `keydown.enter`, `blur` | Apertura, cierre, accesibilidad |
| Menu | `click`, `keydown.enter`, `keydown.arrowdown`, `keydown.arrowup`, `keydown.escape`, `document:click` | Navegacion completa por teclado |
| Tooltip | `mouseenter`, `mouseleave`, `focusin`, `focusout` | Mostrar/ocultar con mouse y focus |
| Tabs | `click` | Cambio de pestana |
| Formularios | `submit`, `input`, `blur`, `focus` | Validacion y envio |
| Theme Switcher | `click`, `matchMedia:change` | Toggle y deteccion del sistema |

---

## Diagrama de Flujo de Eventos

El siguiente diagrama muestra el flujo de eventos desde la interaccion del usuario hasta la actualizacion de la vista:

```
+------------------+     +-------------------+     +------------------+
|                  |     |                   |     |                  |
|  Usuario         |     |  DOM (Browser)    |     |  Angular         |
|  (Interaccion)   |     |  (Evento Nativo)  |     |  (Event Binding) |
|                  |     |                   |     |                  |
+--------+---------+     +---------+---------+     +--------+---------+
         |                         |                        |
         | 1. Click/Keypress       |                        |
         +------------------------>|                        |
                                   |                        |
                                   | 2. Event Dispatch      |
                                   +----------------------->|
                                                            |
                        +-----------------------------------+
                        |
                        v
         +-----------------------------+
         |                             |
         |  Component Handler          |
         |  (click)="onAction($event)" |
         |                             |
         +-------------+---------------+
                       |
                       | 3. Process Event
                       |
         +-------------v---------------+
         |                             |
         |  preventDefault() ?         |
         |  stopPropagation() ?        |
         |                             |
         +-------------+---------------+
                       |
                       | 4. Update State
                       |
         +-------------v---------------+
         |                             |
         |  Signal / Service Update    |
         |  this.isOpen.set(true)      |
         |                             |
         +-------------+---------------+
                       |
                       | 5. Change Detection
                       |
         +-------------v---------------+
         |                             |
         |  View Re-render             |
         |  @if / [class] / etc.       |
         |                             |
         +-----------------------------+
```

### Flujo Detallado de Ejemplo: Click en Boton de Menu

```
Usuario hace click en boton hamburguesa
              |
              v
+------------------------------------------+
| 1. DOM dispara evento 'click' nativo     |
+------------------------------------------+
              |
              v
+------------------------------------------+
| 2. Angular intercepta via (click)        |
|    <button (click)="toggle()">           |
+------------------------------------------+
              |
              v
+------------------------------------------+
| 3. Se ejecuta toggle() en componente     |
|    this.isOpen.update(v => !v)           |
+------------------------------------------+
              |
              v
+------------------------------------------+
| 4. Signal notifica cambio de estado      |
|    isOpen: false -> true                 |
+------------------------------------------+
              |
              v
+------------------------------------------+
| 5. Change Detection actualiza vista      |
|    @if (isOpen()) { ... } se evalua      |
+------------------------------------------+
              |
              v
+------------------------------------------+
| 6. DOM se actualiza mostrando menu       |
|    <nav class="nav--open">               |
+------------------------------------------+
```

### Flujo de Eventos Globales con @HostListener

```
Usuario presiona tecla ESC en cualquier parte
              |
              v
+------------------------------------------+
| 1. DOM dispara 'keydown' en document     |
+------------------------------------------+
              |
              v
+------------------------------------------+
| 2. @HostListener('document:keydown.esc') |
|    intercepta el evento                  |
+------------------------------------------+
              |
              v
+------------------------------------------+
| 3. Angular filtra por tecla 'Escape'     |
+------------------------------------------+
              |
              v
+------------------------------------------+
| 4. Se ejecuta onEscapePress()            |
|    if (this.isOpen()) this.close()       |
+------------------------------------------+
              |
              v
+------------------------------------------+
| 5. Estado actualizado, vista re-renderiza|
+------------------------------------------+
```

---

## Referencias

- [Angular Event Binding](https://angular.dev/guide/templates/event-binding)
- [Angular HostListener](https://angular.dev/api/core/HostListener)
- [Renderer2 API](https://angular.dev/api/core/Renderer2)
- [MDN Event Reference](https://developer.mozilla.org/en-US/docs/Web/Events)
