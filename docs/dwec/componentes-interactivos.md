# Componentes Interactivos y Eventos

Este documento describe los componentes interactivos implementados en el proyecto, detallando los eventos utilizados y su funcionamiento.

---

## 1. Theme Switcher

El theme switcher permite alternar entre modo claro y oscuro, con persistencia en localStorage y deteccion automatica de preferencias del sistema.

### Implementación

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

El menu hamburger permite la navegación en dispositivos moviles, con animacion de apertura/cierre.

### Implementación

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
| `click` | Enlaces de navegación | Cierra el menu al navegar |

### Caracteristicas

- Estado controlado con Angular Signals
- Clases dinamicas para animaciones CSS (`header__hamburger--open`, `header__nav--open`)
- Cierre automatico al hacer click en un enlace
- Accesibilidad con `aria-label`

---

## 3. Modal (AccountModal)

Componente modal reutilizable para formularios de autenticación (login y registro).

### Implementación

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
- Output event para comunicación con componente padre
- Accesibilidad con `aria-label` en boton de cierre

---

## 4. Tabs (Pestanas)

Componente de navegación por pestanas con soporte completo de teclado y accesibilidad.

### Implementación

**Componente** (`tabs.component.ts`):

```typescript
type TabId = 'detalles' | 'especificaciones' | 'opiniones';
const TABS: TabId[] = ['detalles', 'especificaciones', 'opiniones'];

@Component({
  selector: 'app-tabs',
  template: `
    <section class="tabs">
      <nav class="tabs-nav" role="tablist" #tabList>
        <button
          #tabButton
          (click)="selectTab('detalles')"
          (keydown.arrowright)="focusNextTab($event, 0)"
          (keydown.arrowleft)="focusPrevTab($event, 0)"
          (keydown.home)="focusFirstTab($event)"
          (keydown.end)="focusLastTab($event)"
          [class.active]="activeTab() === 'detalles'"
          [attr.aria-selected]="activeTab() === 'detalles'"
          [attr.tabindex]="activeTab() === 'detalles' ? 0 : -1"
          role="tab"
          aria-controls="panel-detalles"
          type="button">
          Detalles
        </button>
        <!-- Mas botones con la misma estructura -->
      </nav>

      <article class="tabs-content">
        @if (activeTab() === 'detalles') {
          <section role="tabpanel" id="panel-detalles" aria-labelledby="tab-detalles">
            <h3>Detalles del Producto</h3>
            <p>Informacion detallada sobre el producto.</p>
          </section>
        }
        <!-- Mas paneles -->
      </article>
    </section>
  `
})
export class TabsComponent {
  protected readonly activeTab = signal<TabId>('detalles');

  // Referencias para navegación por teclado
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef>;
  @ViewChild('tabList') tabList!: ElementRef;

  protected selectTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  // Navegacion: siguiente tab (ArrowRight)
  protected focusNextTab(event: Event, currentIndex: number): void {
    event.preventDefault();
    const buttons = this.tabButtons?.toArray();
    if (buttons) {
      const nextIndex = (currentIndex + 1) % buttons.length;
      buttons[nextIndex].nativeElement.focus();
      this.activeTab.set(TABS[nextIndex]);
    }
  }

  // Navegacion: tab anterior (ArrowLeft)
  protected focusPrevTab(event: Event, currentIndex: number): void {
    event.preventDefault();
    const buttons = this.tabButtons?.toArray();
    if (buttons) {
      const prevIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
      buttons[prevIndex].nativeElement.focus();
      this.activeTab.set(TABS[prevIndex]);
    }
  }

  // Navegacion: primer tab (Home)
  protected focusFirstTab(event: Event): void {
    event.preventDefault();
    const buttons = this.tabButtons?.toArray();
    if (buttons?.[0]) {
      buttons[0].nativeElement.focus();
      this.activeTab.set(TABS[0]);
    }
  }

  // Navegacion: ultimo tab (End)
  protected focusLastTab(event: Event): void {
    event.preventDefault();
    const buttons = this.tabButtons?.toArray();
    if (buttons?.length) {
      buttons[buttons.length - 1].nativeElement.focus();
      this.activeTab.set(TABS[buttons.length - 1]);
    }
  }
}
```

### Eventos utilizados

| Evento | Elemento | Accion |
|--------|----------|--------|
| `click` | Botones de pestana | Cambia la pestana activa |
| `keydown.arrowright` | Botones de pestana | Navega al siguiente tab |
| `keydown.arrowleft` | Botones de pestana | Navega al tab anterior |
| `keydown.home` | Botones de pestana | Navega al primer tab |
| `keydown.end` | Botones de pestana | Navega al ultimo tab |

### Caracteristicas

- Estado con Angular Signals
- Navegacion completa por teclado (ArrowLeft, ArrowRight, Home, End)
- ViewChild y ViewChildren para referencias al DOM
- Accesibilidad completa: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`
- Clases dinamicas para indicar pestana activa
- Renderizado condicional con `@if`

---

## 5. Tooltip (Directiva)

Directiva tooltip con delay configurable, posicionamiento dinamico (top, bottom, left, right), flecha indicadora y soporte para accesibilidad.

### Implementación

**Directiva** (`tooltip.directive.ts`):

```typescript
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnDestroy {
  @Input() appTooltip = '';
  @Input() tooltipPosition: TooltipPosition = 'top';
  @Input() tooltipDelay = 300; // Delay en milisegundos

  private tooltipElement: HTMLElement | null = null;
  private arrowElement: HTMLElement | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnDestroy(): void {
    this.clearTimeouts();
    this.hideTooltip();
  }

  // Evento mouse: muestra tooltip con delay
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.clearTimeouts();
    this.showTimeout = setTimeout(() => {
      if (!this.tooltipElement) this.showTooltip();
    }, this.tooltipDelay);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.clearTimeouts();
    this.hideTooltip();
  }

  // Evento focus: soporte para accesibilidad
  @HostListener('focusin')
  onFocusIn(): void {
    this.clearTimeouts();
    this.showTimeout = setTimeout(() => {
      if (!this.tooltipElement) this.showTooltip();
    }, this.tooltipDelay);
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.clearTimeouts();
    this.hideTooltip();
  }

  private showTooltip(): void {
    // Crear tooltip con Renderer2
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.setProperty(this.tooltipElement, 'innerText', this.appTooltip);
    this.renderer.setAttribute(this.tooltipElement, 'role', 'tooltip');

    // Crear flecha indicadora
    this.arrowElement = this.renderer.createElement('span');
    this.applyPosition(); // Aplicar posicion segun tooltipPosition

    // Animacion fade-in
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s ease');
    this.renderer.appendChild(this.tooltipElement, this.arrowElement);
    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);

    setTimeout(() => {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
    }, 10);
  }

  private applyPosition(): void {
    // Posicionamiento dinamico segun tooltipPosition (top, bottom, left, right)
    // Incluye flecha apuntando hacia el elemento
  }

  private hideTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
      setTimeout(() => {
        this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
        this.tooltipElement = null;
      }, 200);
    }
  }
}
```

**Uso basico**:

```html
<button appTooltip="Texto del tooltip">Hover aqui</button>
```

**Uso con opciones**:

```html
<button appTooltip="Texto" tooltipPosition="bottom" tooltipDelay="500">
  Con delay y posicion
</button>
```

### Eventos utilizados

| Evento | Elemento | Accion |
|--------|----------|--------|
| `mouseenter` | Elemento con directiva | Inicia timer para mostrar tooltip |
| `mouseleave` | Elemento con directiva | Oculta tooltip con animacion |
| `focusin` | Elemento con directiva | Muestra tooltip (accesibilidad) |
| `focusout` | Elemento con directiva | Oculta tooltip |

### Caracteristicas

- Delay configurable (default 300ms) para evitar tooltips accidentales
- Posicionamiento dinamico: top, bottom, left, right
- Flecha indicadora que apunta al elemento
- Soporte de accesibilidad con eventos focus
- Animacion fade-in/fade-out suave
- Creacion dinamica de elementos con Renderer2
- Limpieza en ngOnDestroy para evitar memory leaks
- Atributo `role="tooltip"` para lectores de pantalla

---

## 6. Dropdown de Cuenta (con cierre externo)

Menu desplegable que se cierra al hacer click fuera del componente.

### Implementación

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

## 7. Accordion

Componente accordion con navegación completa por teclado y animaciones CSS.

### Implementación

**Componente** (`accordion.component.ts`):

```typescript
interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-accordion',
  template: `
    <section class="accordion" #accordionContainer>
      @for (item of items; track item.id; let i = $index) {
        <article class="accordion__item">
          <button
            #accordionButton
            class="accordion__header"
            [class.accordion__header--open]="openItemId() === item.id"
            [attr.aria-expanded]="openItemId() === item.id"
            [attr.aria-controls]="'panel-' + item.id"
            (click)="toggle(item.id)"
            (keydown.arrowdown)="focusNextItem($event, i)"
            (keydown.arrowup)="focusPrevItem($event, i)"
            (keydown.home)="focusFirstItem($event)"
            (keydown.end)="focusLastItem($event)"
            (keydown.enter)="toggle(item.id)"
            (keydown.space)="onSpacePress($event, item.id)"
            type="button">
            <span>{{ item.title }}</span>
            <span class="accordion__icon" [class.accordion__icon--open]="openItemId() === item.id">
              <!-- Icono chevron -->
            </span>
          </button>
          <section
            class="accordion__panel"
            [class.accordion__panel--open]="openItemId() === item.id"
            [id]="'panel-' + item.id"
            role="region">
            <p>{{ item.content }}</p>
          </section>
        </article>
      }
    </section>
  `
})
export class AccordionComponent {
  protected readonly openItemId = signal<string | null>(null);

  // Referencias para navegación por teclado
  @ViewChildren('accordionButton') accordionButtons!: QueryList<ElementRef>;
  @ViewChild('accordionContainer') accordionContainer!: ElementRef;

  protected toggle(itemId: string): void {
    this.openItemId.update(current => current === itemId ? null : itemId);
  }

  protected onSpacePress(event: Event, itemId: string): void {
    event.preventDefault(); // Prevenir scroll
    this.toggle(itemId);
  }

  protected focusNextItem(event: Event, currentIndex: number): void {
    event.preventDefault();
    const buttons = this.accordionButtons?.toArray();
    if (buttons?.[currentIndex + 1]) {
      buttons[currentIndex + 1].nativeElement.focus();
    }
  }

  protected focusPrevItem(event: Event, currentIndex: number): void {
    event.preventDefault();
    const buttons = this.accordionButtons?.toArray();
    if (buttons?.[currentIndex - 1]) {
      buttons[currentIndex - 1].nativeElement.focus();
    }
  }

  protected focusFirstItem(event: Event): void {
    event.preventDefault();
    const buttons = this.accordionButtons?.toArray();
    buttons?.[0]?.nativeElement.focus();
  }

  protected focusLastItem(event: Event): void {
    event.preventDefault();
    const buttons = this.accordionButtons?.toArray();
    buttons?.[buttons.length - 1]?.nativeElement.focus();
  }
}
```

### Eventos utilizados

| Evento | Elemento | Accion |
|--------|----------|--------|
| `click` | Header del accordion | Expande/colapsa sección |
| `keydown.enter` | Header del accordion | Expande/colapsa sección |
| `keydown.space` | Header del accordion | Expande/colapsa sección (con preventDefault) |
| `keydown.arrowdown` | Header del accordion | Mueve foco al siguiente item |
| `keydown.arrowup` | Header del accordion | Mueve foco al item anterior |
| `keydown.home` | Header del accordion | Mueve foco al primer item |
| `keydown.end` | Header del accordion | Mueve foco al ultimo item |

### Caracteristicas

- Solo una sección abierta a la vez (modo accordion)
- Navegacion completa por teclado (ArrowUp, ArrowDown, Home, End, Enter, Space)
- Animacion CSS con max-height transition
- Icono chevron que rota 180 grados al abrir
- ViewChild y ViewChildren para referencias al DOM
- Accesibilidad: `aria-expanded`, `aria-controls`, `role="region"`
- preventDefault en Space para evitar scroll de pagina

---

## Resumen de Eventos por Componente

| Componente | Eventos | Descripción |
|------------|---------|-------------|
| Theme Switcher | `click`, `matchMedia:change` | Alterna tema, detecta cambios del sistema |
| Menu Mobile | `click`, `keydown.escape`, `document:click` | Abre/cierra menu, navega |
| Modal | `click`, `keydown.escape`, `keydown.enter`, `blur`, `stopPropagation` | Cierra en overlay/ESC, evita cierre en contenido |
| Tabs | `click`, `keydown.arrowright`, `keydown.arrowleft`, `keydown.home`, `keydown.end` | Cambia pestana con click y teclado |
| Tooltip | `mouseenter`, `mouseleave`, `focusin`, `focusout` | Muestra/oculta tooltip con mouse y foco |
| Dropdown | `click`, `document:click`, `document:keydown.escape` | Abre/cierra, detecta click/ESC externo |
| Accordion | `click`, `keydown.enter`, `keydown.space`, `keydown.arrowup`, `keydown.arrowdown`, `keydown.home`, `keydown.end` | Expande/colapsa con navegación por teclado |

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

Angular implementa un sistema de eventos basado en el patron de flujo de datos unidireccional. Los eventos fluyen desde el DOM hacia los componentes, donde se procesan y pueden modificar el estado de la aplicación. Este enfoque facilita el seguimiento del flujo de datos y la depuracion.

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

| Componente | Eventos | Descripción |
|------------|---------|-------------|
| Header | `click`, `document:click`, `document:keydown.escape` | Toggle menus, cierre externo y con ESC |
| Modal | `click`, `keydown.escape`, `keydown.enter`, `blur` | Apertura, cierre, accesibilidad |
| Menu | `click`, `keydown.enter`, `keydown.arrowdown`, `keydown.arrowup`, `keydown.escape`, `document:click` | Navegacion completa por teclado |
| Tooltip | `mouseenter`, `mouseleave`, `focusin`, `focusout` | Mostrar/ocultar con mouse y focus |
| Tabs | `click`, `keydown.arrowright`, `keydown.arrowleft`, `keydown.home`, `keydown.end` | Cambio de pestana con teclado |
| Accordion | `click`, `keydown.enter`, `keydown.space`, `keydown.arrowup`, `keydown.arrowdown`, `keydown.home`, `keydown.end` | Expandir/colapsar con teclado |
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
