# Documentación Técnica - La Referente

## 1. Arquitectura CSS

### 1.1 Metodología BEM (Block Element Modifier)

Utilizamos BEM para mantener un código CSS escalable y mantenible.

**Estructura:**
- **Block**: `.header`, `.footer`, `.login-form`
- **Element**: `.header__logo`, `.header__nav-link`, `.login-form__input`
- **Modifier**: `.header__nav-link--active`, `.button--disabled`

**Ejemplos en el código:**

```html
<!-- Header Component -->
<header class="header">
  <a routerLink="/" class="header__logo">
    <img src="/images/logo.png" alt="La Referente" class="header__logo-img" />
  </a>
  
  <nav class="header__nav">
    <ul class="header__nav-list">
      <li class="header__nav-item">
        <a routerLink="/noticias" class="header__nav-link header__nav-link--active">
          Noticias
        </a>
      </li>
    </ul>
  </nav>
</header>

<!-- Login Form Component -->
<form class="login-form">
  <div class="login-form__password-wrapper">
    <div class="login-form__password-header">
      <p class="login-form__password-label">Contraseña</p>
      <a href="/recuperar" class="login-form__forgot-password">¿Olvidaste tu contraseña?</a>
    </div>
  </div>
</form>
```

### 1.2 Sistema de Variables

**Variables SCSS (_variables.scss):**
```scss
// Breakpoints para media queries
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
```

**Variables CSS (_css-variables.scss):**

Variables base en SCSS:
```scss
// Colores light mode
$primary-light: #388e3c;
$bg-primary-light: #ffffff;
$text-primary-light: #222222;

// Colores dark mode
$primary-dark: #2a6b2d;
$bg-primary-dark: #222222;
$text-primary-dark: #ffffff;
```

Conversión a CSS Custom Properties:
```scss
:root,
:root.theme-light {
  --primary: #{$primary-light};
  --bg-color: #{$bg-primary-light};
  --text-color: #{$text-primary-light};
}

:root.theme-dark {
  --primary: #{$primary-dark};
  --bg-color: #{$bg-primary-dark};
  --text-color: #{$text-primary-dark};
}
```

Variables que NO cambian con el tema:
```scss
:root {
  // Tipografía
  --font-primary: 'Inter', sans-serif;
  --font-secondary: 'ABeeZee', sans-serif;
  --font-xs: 0.75rem;
  --font-m: 1rem;
  --font-xl: 1.5rem;
  
  // Espaciado
  --spacing-1: 0.25rem;
  --spacing-4: 1rem;
  --spacing-8: 2rem;
  
  // Sombras
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  // Bordes
  --radius-md: 4px;
  --radius-full: 9999px;
  
  // Transiciones
  --duration-fast: 150ms;
  --timing-ease-in-out: ease-in-out;
}
```

### 1.3 Arquitectura ITCSS

**Orden de importación en styles.scss:**
```scss
// 00-settings: Variables SCSS
@import './styles/00-settings/variables';

// 00-settings: Variables CSS (Custom Properties)
@import './styles/00-settings/css-variables';

// 01-tools: Mixins y funciones
@import './styles/01-tools/mixins';

// 02-generic: Reset
@import './styles/02-generic/reset';
```

---

## 2. HTML Semántico y Estructura

### 2.1 Elementos Semánticos Utilizados

#### **`<header>`**
Encabezado principal de la aplicación. Contiene el logo, navegación principal y utilidades.

**Ubicación:** `frontend/src/app/components/layout/header/header.html`

```html
<header class="header">
  <section class="header__container">
    <!-- Logo -->
    <a routerLink="/" class="header__logo">
      <img src="/images/logo.png" alt="La Referente" class="header__logo-img" />
    </a>

    <!-- Navegación principal -->
    <nav class="header__nav">
      <ul class="header__nav-list">
        <li class="header__nav-item">
          <a routerLink="/noticias" routerLinkActive="header__nav-link--active" 
             class="header__nav-link">
            Noticias
          </a>
        </li>
        <li class="header__nav-item">
          <a routerLink="/competiciones" routerLinkActive="header__nav-link--active" 
             class="header__nav-link">
            Competiciones
          </a>
        </li>
      </ul>
    </nav>

    <!-- Buscador y utilidades -->
    <section class="header__utilities">
      <form class="header__search" role="search">
        <select class="header__search-dropdown">
          <option value="all">Todo</option>
          <option value="noticias">Noticias</option>
        </select>
        <input type="text" class="header__search-input" placeholder="Buscar" />
        <button class="header__search-btn" aria-label="Buscar">
          <!-- Icono -->
        </button>
      </form>
    </section>
  </section>
</header>
```


#### **`<nav>`**
Navegación principal de la aplicación.

**Cuándo usarlo:**
- Solo para la navegación principal del sitio
- NO para cualquier grupo de enlaces

```html
<nav class="header__nav">
  <ul class="header__nav-list">
    <li class="header__nav-item">
      <a routerLink="/noticias" class="header__nav-link">Noticias</a>
    </li>
  </ul>
</nav>
```

#### **`<main>`**
Contenido principal de cada página.

**Ubicación:** `frontend/src/app/components/layout/main/main.html`

```html
<main class="main">
  <div class="main__container">
    <ng-content></ng-content>
  </div>
</main>
```

#### **`<footer>`**
Pie de página con información legal y redes sociales.

**Ubicación:** `frontend/src/app/components/layout/footer/footer.html`

```html
<footer class="footer">
  <div class="footer__container">
    <!-- Sección principal del footer -->
    <div class="footer__main">
      <!-- Logo y descripción -->
      <div class="footer__brand">
        <img src="/images/logo.png" alt="La Referente" class="footer__logo" />
        <p class="footer__description">
          Tu fuente de información sobre fútbol español.
        </p>
      </div>

      <!-- Enlaces legales -->
      <div class="footer__section">
        <h3 class="footer__title">Legal</h3>
        <ul class="footer__list">
          <li class="footer__list-item">
            <a routerLink="/terminos" class="footer__link">Términos y condiciones</a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Copyright -->
    <div class="footer__bottom">
      <p class="footer__copyright">
        © 2024 La Referente. Todos los derechos reservados.
      </p>
    </div>
  </div>
</footer>
```

#### **`<section>`**
Agrupación temática de contenido.

**Cuándo usarlo:**
- Cuando el contenido tiene un tema específico
- Generalmente tiene un heading (h2, h3, etc.)

```html
<!-- Utilidades del header -->
<section class="header__utilities">
  <form class="header__search" role="search">
    <!-- ... -->
  </form>
  <button class="header__theme-btn"><!-- ... --></button>
</section>

<!-- Sección legal del footer -->
<div class="footer__section">
  <h3 class="footer__title">Legal</h3>
  <ul class="footer__list">
    <!-- ... -->
  </ul>
</div>
```

#### **`<article>`**
**Cuándo lo usaremos:**
- Para noticias individuales
- Para perfiles de jugadores
- Contenido que puede ser distribuido independientemente

**Ejemplo futuro:**
```html
<article class="noticia">
  <header class="noticia__header">
    <h2 class="noticia__titulo">Título de la noticia</h2>
    <time class="noticia__fecha" datetime="2024-12-15">15 de diciembre, 2024</time>
  </header>
  <div class="noticia__contenido">
    <p>Contenido de la noticia...</p>
  </div>
</article>
```

#### **`<aside>`**
**Cuándo lo usaremos:**
- Para contenido relacionado pero no esencial
- Barras laterales con información adicional
- Widgets de redes sociales

**Ejemplo futuro:**
```html
<aside class="sidebar">
  <h3 class="sidebar__titulo">Últimos resultados</h3>
  <ul class="sidebar__lista">
    <!-- ... -->
  </ul>
</aside>
```

### 2.2 Jerarquía de Headings

**Reglas aplicadas:**

1. **Un solo `<h1>` por página** - Título principal del contenido
2. **`<h2>` para secciones principales** - Dividen el contenido en bloques temáticos
3. **`<h3>` para subsecciones** - Subdividen las secciones h2
4. **NUNCA saltar niveles** - No pasar de h2 a h4

**Diagrama de jerarquía:**

```
Página: Inicio
│
└─ h1: "Bienvenido a La Referente"
   │
   ├─ h2: "Últimas Noticias"
   │  ├─ h3: "Noticia 1"
   │  ├─ h3: "Noticia 2"
   │  └─ h3: "Noticia 3"
   │
   ├─ h2: "Competiciones Destacadas"
   │  ├─ h3: "La Liga"
   │  │  └─ h4: "Próximos partidos"
   │  ├─ h3: "Copa del Rey"
   │  │  └─ h4: "Resultados recientes"
   │  └─ h3: "Champions League"
   │
   └─ h2: "Jugadores Destacados"
      ├─ h3: "Delanteros"
      ├─ h3: "Mediocampistas"
      └─ h3: "Defensas"
```


### 2.3 Estructura de Formularios

#### **Componente `form-input`**

**Ubicación:** `frontend/src/app/components/shared/form-input/form-input.html`

**Características:**
- Asociación correcta de `label` con `input` mediante `for` e `id`
- Indicador visual de campo requerido (`*`)
- Iconos descriptivos
- Mensajes de ayuda y error

**Código completo:**

```html
<div class="form-field">
  @if (label) {
    <label [for]="inputId" class="form-field__label">
      {{ label }}@if (required) {<span class="form-field__required">*</span>}
    </label>
  }

  <div class="form-field__input-wrapper">
    @if (icon) {
      <svg class="form-field__input-icon" xmlns="http://www.w3.org/2000/svg" 
           fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" 
              stroke-width="2" [attr.d]="icon" />
      </svg>
    }

    <input
      class="form-field__input"
      [type]="type"
      [id]="inputId"
      [name]="name"
      [placeholder]="placeholder"
      [required]="required"
    />
  </div>

  @if (helpText) {
    <small class="form-field__help-text">{{ helpText }}</small>
  }

  @if (errorMessage) {
    <span class="form-field__error-message">{{ errorMessage }}</span>
  }
</div>
```

**Explicación:**

1. **Asociación label-input:**
   ```html
   <label [for]="inputId">Correo electrónico</label>
   <input [id]="inputId" type="email" />
   ```
   - El atributo `for` del label debe coincidir con el `id` del input
   - Esto permite hacer clic en el label para enfocar el input
   - Mejora la accesibilidad

2. **Campo requerido:**
   ```html
   {{ label }}@if (required) {<span class="form-field__required">*</span>}
   ```
   - Indicador visual (`*`) en rojo
   - Atributo `required` en el input para validación HTML5

3. **Iconos descriptivos:**
   ```html
   <svg class="form-field__input-icon">
     <path [attr.d]="icon" />
   </svg>
   ```
   - Mejoran la identificación visual del campo
   - No son interactivos (`pointer-events: none`)

4. **Mensajes de ayuda y error:**
   ```html
   <small class="form-field__help-text">{{ helpText }}</small>
   <span class="form-field__error-message">{{ errorMessage }}</span>
   ```
   - Proporcionan contexto adicional
   - Los errores se muestran en rojo

#### **Uso del componente:**

```html
<app-form-input
  label="Correo electrónico"
  type="email"
  name="email"
  inputId="register-email"
  placeholder="Introduce tu correo electrónico"
  icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  [required]="true">
</app-form-input>
```

**Genera HTML accesible:**

```html
<div class="form-field">
  <label for="register-email" class="form-field__label">
    Correo electrónico<span class="form-field__required">*</span>
  </label>
  
  <div class="form-field__input-wrapper">
    <svg class="form-field__input-icon"><!-- Icono --></svg>
    <input
      class="form-field__input"
      type="email"
      id="register-email"
      name="email"
      placeholder="Introduce tu correo electrónico"
      required
    />
  </div>
</div>
```

#### **`<fieldset>` y `<legend>`**

**Cuándo los usaremos:**

Los usaremos cuando tengamos formularios más complejos con grupos de campos relacionados.

**Ejemplo futuro - Formulario de filtros:**

```html
<form class="filtros-form">
  <fieldset class="filtros-form__group">
    <legend class="filtros-form__legend">Filtrar por competición</legend>
    
    <label class="filtros-form__label">
      <input type="checkbox" name="competicion" value="la-liga">
      La Liga
    </label>
    
    <label class="filtros-form__label">
      <input type="checkbox" name="competicion" value="copa-rey">
      Copa del Rey
    </label>
    
    <label class="filtros-form__label">
      <input type="checkbox" name="competicion" value="champions">
      Champions League
    </label>
  </fieldset>

  <fieldset class="filtros-form__group">
    <legend class="filtros-form__legend">Filtrar por fecha</legend>
    
    <label class="filtros-form__label">
      Desde:
      <input type="date" name="fecha-desde">
    </label>
    
    <label class="filtros-form__label">
      Hasta:
      <input type="date" name="fecha-hasta">
    </label>
  </fieldset>
</form>
```

**Beneficios:**
- Agrupa campos relacionados semánticamente
- Mejora la accesibilidad (lectores de pantalla)
- Permite estilizar grupos completos

#### **Formularios actuales:**

**Login Form:**
```html
<form class="login-form" (submit)="onSubmit($event)">
  <app-form-input
    label="Correo electrónico"
    type="email"
    name="email"
    inputId="login-email"
    [required]="true">
  </app-form-input>

  <!-- Input de contraseña personalizado para layout especial -->
  <div class="login-form__password-wrapper">
    <div class="login-form__password-header">
      <p class="login-form__password-label">
        Contraseña<span class="login-form__required">*</span>
      </p>
      <a href="/recuperar-contrasena" class="login-form__forgot-password">
        ¿Olvidaste tu contraseña?
      </a>
    </div>
    <div class="login-form__input-wrapper">
      <svg class="login-form__input-icon"><!-- Icono --></svg>
      <input
        type="password"
        id="login-password"
        name="password"
        class="login-form__input"
        placeholder="Introduce tu contraseña"
        required
      />
    </div>
  </div>

  <app-form-modal-button text="Iniciar sesión" type="submit" />
</form>
```

**Register Form:**
```html
<form class="register-form" (submit)="onSubmit($event)">
  <app-form-input
    label="Correo electrónico"
    type="email"
    name="email"
    inputId="register-email"
    [required]="true">
  </app-form-input>

  <app-form-input
    label="Nombre"
    type="text"
    name="nombre"
    inputId="register-nombre"
    [required]="true">
  </app-form-input>

  <app-form-input
    label="Contraseña"
    type="password"
    name="password"
    inputId="register-password"
    [required]="true">
  </app-form-input>

  <!-- Checkbox de términos -->
  <div class="register-form__terms-checkbox">
    <input type="checkbox" id="terms" name="terms" 
           class="register-form__terms-input" required />
    <label for="terms" class="register-form__terms-label">
      Acepto los <a href="/terminos" class="register-form__terms-link">
        términos y condiciones
      </a>
    </label>
  </div>

  <app-form-modal-button text="Registrarse" type="submit" />
</form>
```

**Características de accesibilidad:**
- Todos los inputs tienen `label` asociados
- Campos requeridos marcados visualmente (`*`) y con atributo `required`
- Placeholders descriptivos
- Nombres semánticos (`name` attribute)
- IDs únicos para cada campo
