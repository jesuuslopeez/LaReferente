# DWEC FASE 1: Manipulación del DOM y Eventos

**Fecha de entrega**: 18 de diciembre
**Criterios**: RA6.a, RA6.c, RA6.d, RA6.e, RA6.h

---

## 1. Arquitectura de Eventos

La arquitectura de eventos en esta aplicación Angular sigue el patrón unidireccional de datos, utilizando **signals** para estado reactivo y **event binding** nativo del DOM.

### Flujo de Eventos Principal

```
Usuario → Evento DOM (click/keydown/mouseenter)
       → Event Binding (eventName)="handler($event)"
       → Component Handler Method
       → Signal Update (signal.set/update)
       → View Re-render (automático)
```

### Características Principales

1. **Event Binding Directo**: Eventos del DOM capturados con `(eventName)="handler($event)"`
2. **Signals para Estado**: Uso de `signal<T>()` para estado reactivo y detección de cambios automática
3. **@HostListener**: Para eventos globales (document, window) y teclas especiales
4. **Renderer2**: Para manipulación segura del DOM sin acceso directo a `nativeElement`

### Componentes Implementados

| Componente | Eventos Principales | Técnicas Usadas |
|------------|-------------------|-----------------|
| **DomExampleComponent** | click | ViewChild, ElementRef, Renderer2 |
| **MenuComponent** | click, document:click | @HostListener, ElementRef, signal |
| **ModalComponent** | click, keydown.escape | @HostListener, stopPropagation |
| **TabsComponent** | click | Event binding, señales, clases dinámicas |
| **TooltipDirective** | mouseenter, mouseleave | @HostListener, Renderer2 |
| **ThemeService** | - | effect(), localStorage, matchMedia |

---

## 2. Diagrama de Flujo de Eventos

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERACCIÓN USUARIO                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              EVENTO DOM NATIVO                               │
│  (click, keydown, mouseenter, mouseleave, etc.)             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           TEMPLATE EVENT BINDING                             │
│       (click)="handler()" o @HostListener                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         MÉTODO DEL COMPONENTE                                │
│  - Acceso a $event si es necesario                          │
│  - preventDefault() / stopPropagation() según contexto       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│        ACTUALIZACIÓN DE ESTADO (Signals)                     │
│  signal.set(value) o signal.update(fn)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          DETECCIÓN DE CAMBIOS AUTOMÁTICA                     │
│  Angular actualiza la vista reactivamente                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Tabla de Compatibilidad de Navegadores

| Evento | Chrome | Firefox | Safari | Edge | Notas |
|--------|--------|---------|--------|------|-------|
| `click` | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Soporte universal |
| `mouseenter` | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Soporte universal |
| `mouseleave` | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Soporte universal |
| `keydown.escape` | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Modificador Angular |
| `document:click` | ✅ Todas | ✅ Todas | ✅ Todas | ✅ Todas | Event bubbling |
| `matchMedia()` | ✅ 9+ | ✅ 6+ | ✅ 5.1+ | ✅ 10+ | Para prefers-color-scheme |
| `localStorage` | ✅ 4+ | ✅ 3.5+ | ✅ 4+ | ✅ 8+ | Persistencia tema |

---

## 4. Implementaciones por Tarea

### Tarea 1: Manipulación del DOM

**Componente**: `DomExampleComponent` ([dom-example.component.ts](../../frontend/src/app/components/dom-example/dom-example.component.ts))

**Técnicas implementadas**:
- **@ViewChild**: Acceso a elementos mediante referencias de template (`#variable`)
- **ElementRef**: Contenedor de la referencia al elemento nativo
- **Renderer2**: API segura para manipular el DOM
- **AfterViewInit**: Hook de ciclo de vida para acceso al DOM

**Métodos de Renderer2 utilizados**:
- `setStyle()`: Modificar estilos CSS dinámicamente
- `setProperty()`: Cambiar propiedades del elemento
- `createElement()`: Crear elementos nuevos
- `appendChild()`: Insertar elementos en el DOM
- `removeChild()`: Eliminar elementos del DOM

**Ejemplo de código**:
```typescript
@ViewChild('targetParagraph', { static: false }) targetParagraph!: ElementRef;

cambiarEstilo() {
  this.renderer.setStyle(this.targetParagraph.nativeElement, 'color', 'red');
  this.renderer.setStyle(this.targetParagraph.nativeElement, 'fontSize', '20px');
}

crearElemento() {
  const nuevoParrafo = this.renderer.createElement('p');
  this.renderer.setProperty(nuevoParrafo, 'innerText', 'Elemento creado');
  this.renderer.appendChild(this.container.nativeElement, nuevoParrafo);
}
```

---

### Tarea 2: Sistema de Eventos

**Event Bindings implementados**:

1. **Eventos de Mouse**:
   - `(click)`: Botones, enlaces, toggle de menú
   - `(mouseenter)` / `(mouseleave)`: Tooltips

2. **Eventos de Teclado**:
   - `(keydown.escape)`: Cierre de modal con tecla ESC

3. **Eventos Globales**:
   - `@HostListener('document:click')`: Detección de clicks fuera del componente

**Prevención y Propagación**:
- `event.preventDefault()`: Evitar comportamiento por defecto (modal con ESC)
- `event.stopPropagation()`: Detener propagación (click en contenido del modal)

**Ejemplo de código**:
```typescript
@HostListener('document:keydown.escape', ['$event'])
onEscapePress(event: KeyboardEvent): void {
  if (this.isOpen()) {
    event.preventDefault();
    this.close();
  }
}

onBackdropClick(event: MouseEvent): void {
  // stopPropagation se usa en el template:
  // <article (click)="$event.stopPropagation()">
  this.close();
}
```

---

### Tarea 3: Componentes Interactivos

#### 1. Menu Hamburguesa (`MenuComponent`)

**Archivo**: [menu.component.ts](../../frontend/src/app/components/menu/menu.component.ts)

**Funcionalidades**:
- Toggle de apertura/cierre con signal
- Cierre automático al hacer click fuera del menú
- @HostListener para detectar clicks en el documento

**Código clave**:
```typescript
protected readonly isOpen = signal(false);

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const clickedInside = this.elementRef.nativeElement.contains(event.target);
  if (!clickedInside && this.isOpen()) {
    this.close();
  }
}
```

#### 2. Modal (`ModalComponent`)

**Archivo**: [modal.component.ts](../../frontend/src/app/components/modal/modal.component.ts)

**Funcionalidades**:
- Apertura/cierre con signal
- Cierre con tecla ESC
- Cierre al hacer click en el backdrop (fondo oscuro)
- Prevención de cierre al hacer click en el contenido

**Código clave**:
```typescript
@HostListener('document:keydown.escape', ['$event'])
onEscapePress(event: KeyboardEvent): void {
  if (this.isOpen()) {
    event.preventDefault();
    this.close();
  }
}
```

#### 3. Tabs (`TabsComponent`)

**Archivo**: [tabs.component.ts](../../frontend/src/app/components/tabs/tabs.component.ts)

**Funcionalidades**:
- Navegación entre pestañas
- Clases CSS dinámicas para pestaña activa
- Renderizado condicional del contenido

**Código clave**:
```typescript
protected readonly activeTab = signal<TabId>('detalles');

protected selectTab(tab: TabId): void {
  this.activeTab.set(tab);
}

// En el template:
// [class.active]="activeTab() === 'detalles'"
// @if (activeTab() === 'detalles') { ... }
```

#### 4. Tooltip (`TooltipDirective`)

**Archivo**: [tooltip.directive.ts](../../frontend/src/app/directives/tooltip.directive.ts)

**Funcionalidades**:
- Directiva de atributo para mostrar tooltips
- Eventos mouseenter/mouseleave
- Creación y eliminación dinámica de elementos con Renderer2

**Uso**:
```html
<button appTooltip="Este es un tooltip">Hover me</button>
```

**Código clave**:
```typescript
@HostListener('mouseenter')
onMouseEnter(): void {
  this.showTooltip();
}

@HostListener('mouseleave')
onMouseLeave(): void {
  this.hideTooltip();
}

private showTooltip(): void {
  this.tooltipElement = this.renderer.createElement('span');
  this.renderer.setProperty(this.tooltipElement, 'innerText', this.appTooltip);
  // ... aplicar estilos con Renderer2
  this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);
}
```

---

### Tarea 4: Theme Switcher

**Servicio**: `ThemeService` ([theme.service.ts](../../frontend/src/app/services/theme.service.ts))

**Funcionalidades**:
- Detección de preferencia del sistema con `matchMedia('prefers-color-scheme: dark')`
- Persistencia en localStorage
- Aplicación automática del tema al cargar
- Toggle entre tema claro y oscuro

**Flujo de funcionamiento**:

1. **Inicialización**:
   ```typescript
   private getInitialTheme(): Theme {
     const savedTheme = localStorage.getItem(this.THEME_KEY);
     if (savedTheme === 'light' || savedTheme === 'dark') {
       return savedTheme;
     }
     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
     return prefersDark ? 'dark' : 'light';
   }
   ```

2. **Aplicación del tema**:
   ```typescript
   effect(() => {
     const theme = this.themeSignal();
     this.applyTheme(theme);
     this.saveTheme(theme);
   });

   private applyTheme(theme: Theme): void {
     const root = document.documentElement;
     root.classList.remove('theme-light', 'theme-dark');
     root.classList.add(`theme-${theme}`);
   }
   ```

3. **CSS** ([styles.scss](../../frontend/src/styles.scss)):
   ```scss
   :root.theme-light {
     --bg-color: #ffffff;
     --text-color: #000000;
     --border-color: #e0e0e0;
   }

   :root.theme-dark {
     --bg-color: #1a1a1a;
     --text-color: #ffffff;
     --border-color: #404040;
   }
   ```

---

## 5. Criterios de Aceptación

✅ **RA6.a**: Manipulación del DOM con ViewChild, ElementRef y Renderer2
✅ **RA6.c**: Event binding y manejo de eventos (click, teclado, mouse)
✅ **RA6.d**: Prevención de comportamiento por defecto con preventDefault()
✅ **RA6.e**: Control de propagación de eventos con stopPropagation()
✅ **RA6.h**: Componentes interactivos funcionales

---

## 6. Entregables

✅ **Componentes interactivos funcionando con eventos**
✅ **Theme switcher completamente funcional**
✅ **Menú mobile con apertura/cierre**
✅ **Mínimo 2 componentes adicionales interactivos**: Modal, Tabs, Tooltip (3 componentes)
✅ **Documentación de eventos en README** (este documento)

---

## 7. Estructura de Archivos

```
frontend/src/app/
├── components/
│   ├── dom-example/
│   │   └── dom-example.component.ts
│   ├── menu/
│   │   └── menu.component.ts
│   ├── modal/
│   │   └── modal.component.ts
│   └── tabs/
│       └── tabs.component.ts
├── directives/
│   └── tooltip.directive.ts
├── services/
│   └── theme.service.ts
└── app.ts (integración)
```

---

## 8. Cómo Ejecutar

```bash
cd frontend
npm install
npm start
```

La aplicación estará disponible en `http://localhost:4200`
