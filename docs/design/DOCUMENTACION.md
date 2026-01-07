# Documentacion DIW

## Seccion 1: Arquitectura CSS y Comunicacion Visual

### 1.1 Principios de Comunicacion Visual

La interfaz del proyecto se ha disenado aplicando los cinco principios fundamentales de comunicacion visual, garantizando una experiencia de usuario coherente y profesional.

#### Jerarquia

La jerarquia visual establece el orden de importancia de los elementos mediante el uso de tamanos, pesos tipograficos y espaciados diferenciados.

En el proyecto se aplica de la siguiente manera:

- **Titulos principales (h1)**: Utilizan la fuente secundaria ABeeZee con peso bold y tamano `--font-4xl` (3rem), creando un punto focal claro en cada seccion.
- **Subtitulos (h2, h3)**: Mantienen la fuente secundaria pero con tamanos progresivamente menores (`--font-2xl`, `--font-xl`), estableciendo niveles de lectura claros.
- **Texto de contenido**: Emplea la fuente primaria Inter con peso regular y tamano base (`--font-base`), diferenciandose claramente de los titulos.
- **Texto secundario**: Utiliza el color `--text-secondary` y tamano `--font-sm` para informacion complementaria como ayudas de formulario o fechas.

**Ejemplo visual - Tarjeta de jugador:**

![Jerarquia en tarjeta de jugador](../screenshots/muestra-card-jugador.png)

En la tarjeta de jugador se observa la jerarquia: el nombre del jugador destaca con mayor tamano y peso, seguido del dorsal, y finalmente la informacion secundaria (club, pais, posicion, edad) con tipografia mas pequena.

```scss
// Ejemplo de jerarquia en tarjetas
.tarjeta__titulo {
  @include tipografia-titulo;
  font-size: var(--font-xl);
  color: var(--text-color);
}

.tarjeta__subtitulo {
  @include tipografia-titulo;
  font-size: var(--font-lg);
  color: var(--text-secondary);
}

.tarjeta__contenido {
  @include tipografia-texto;
  font-size: var(--font-base);
  color: var(--text-secondary);
}
```

#### Contraste

El contraste permite diferenciar elementos y guiar la atencion del usuario hacia las acciones principales.

- **Contraste de color**: El color primario verde (`--primary: #388e3c`) destaca sobre fondos blancos y grises, utilizandose para botones de accion principal, enlaces y elementos interactivos.
- **Contraste de peso**: Los elementos importantes utilizan `--font-semibold` o `--font-bold`, mientras que el texto regular emplea `--font-regular`.
- **Contraste de estados**: Los botones cambian de borde a relleno en hover, creando una diferenciacion clara entre estado normal e interactivo.

**Ejemplo visual - Seccion de noticias:**

![Contraste en seccion de noticias](../screenshots/noticias-contraste.png)

En la seccion de noticias se aprecia el contraste: los titulos en color oscuro destacan sobre el fondo claro, las imagenes crean contraste visual, y los botones verdes resaltan como elementos de accion.

```scss
// Contraste en botones primarios
.boton--primario {
  background-color: var(--white);
  border-color: var(--primary);
  color: var(--primary);

  &:hover:not(:disabled) {
    background-color: var(--primary);
    color: var(--white);
  }
}
```

#### Alineacion

La estrategia de alineacion del proyecto sigue un patron consistente:

- **Alineacion izquierda**: Se utiliza como estandar para textos, etiquetas de formulario y contenido general, facilitando la lectura natural.
- **Alineacion centrada**: Reservada para elementos de accion como botones en modales, titulos de secciones principales y mensajes de feedback.
- **Sistema grid**: Los layouts complejos utilizan CSS Grid y Flexbox con gaps consistentes basados en la escala de espaciado.

**Ejemplo visual - Alineaciones y posicionamientos:**

![Alineaciones y posicionamientos](../screenshots/alineaciones-posicionamientos.png)

En el diseno se observan las diferentes estrategias de alineacion: contenido alineado a la izquierda en las tarjetas, elementos centrados en las cabeceras, y uso de grid para distribuir las tarjetas de forma equilibrada.

```scss
// Alineacion en formularios
.formulario__grupo {
  @include flex-columna(var(--spacing-2));
}

// Alineacion centrada para acciones
.formulario__acciones {
  @include flex-centrar;
  gap: var(--spacing-4);
}
```

#### Proximidad

Los elementos relacionados se agrupan mediante espaciados consistentes, creando bloques visuales coherentes:

- **Espaciado interno de grupos**: `--spacing-2` (0.5rem) entre etiqueta y campo de formulario.
- **Espaciado entre grupos**: `--spacing-4` (1rem) entre diferentes campos de un formulario.
- **Espaciado de secciones**: `--spacing-6` (1.5rem) o superior para separar bloques de contenido independientes.

```scss
// Proximidad en grupos de formulario
.formulario {
  @include flex-columna(var(--spacing-4));  // Entre grupos
}

.formulario__grupo {
  @include flex-columna(var(--spacing-2));  // Dentro del grupo
}
```

#### Repeticion

La coherencia visual se logra mediante la repeticion de patrones en toda la interfaz:

- **Bordes redondeados**: Todos los elementos interactivos utilizan la escala de radios definida (`--radius-md` para inputs, `--radius-lg` para tarjetas, `--radius-full` para botones).
- **Transiciones**: Todas las animaciones utilizan `--duration-fast` (150ms) con `--timing-ease-in-out`.
- **Sombras**: Se aplica `--shadow-md` de forma consistente en tarjetas y elementos elevados.

**Ejemplo visual - Botones coherentes:**

![Botones coherentes](../screenshots/botones-coherentes.png)

En la imagen se observa como todos los botones mantienen el mismo patron visual: bordes redondeados consistentes, mismo espaciado interno, y transiciones uniformes. Esta repeticion crea coherencia en toda la interfaz.

```scss
// Patron repetido en elementos interactivos
.boton {
  border-radius: var(--radius-lg);
  transition: all var(--duration-fast) var(--timing-ease-in-out);
}

.tarjeta {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.formulario__campo {
  border-radius: var(--radius-full);
  transition: border-color var(--duration-fast) var(--timing-ease-in-out);
}
```

---

### 1.2 Metodologia CSS: BEM

El proyecto utiliza la metodologia BEM (Block Element Modifier) para la nomenclatura de clases CSS. Esta decision se fundamenta en las siguientes ventajas:

- **Legibilidad**: El nombre de la clase indica claramente a que componente pertenece y su funcion.
- **Especificidad controlada**: Evita conflictos de especificidad al usar clases unicas y descriptivas.
- **Mantenibilidad**: Facilita la localizacion y modificacion de estilos especificos.
- **Escalabilidad**: Permite anadir nuevos componentes sin riesgo de colisiones.

#### Estructura BEM

**Bloque**: Componente independiente que tiene significado propio.
```scss
.tarjeta { }
.boton { }
.formulario { }
```

**Elemento**: Parte de un bloque que no tiene significado independiente, se une con doble guion bajo.
```scss
.tarjeta__titulo { }
.tarjeta__contenido { }
.tarjeta__acciones { }
```

**Modificador**: Variacion del bloque o elemento, se une con doble guion.
```scss
.tarjeta--destacada { }
.boton--primario { }
.boton--grande { }
```

#### Ejemplos del Proyecto

```scss
// Bloque: tarjeta
.tarjeta {
  @include tarjeta-base;
  display: flex;
  flex-direction: column;
}

// Elementos de tarjeta
.tarjeta__cabecera {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--spacing-4);
}

.tarjeta__titulo {
  @include tipografia-titulo;
  font-size: var(--font-xl);
  color: var(--text-color);
}

.tarjeta__precio {
  @include tipografia-titulo;
  font-size: var(--font-2xl);
  color: var(--primary);
}

// Modificadores de tarjeta
.tarjeta--destacada {
  border: var(--border-medium) solid var(--primary);
}

.tarjeta--horizontal {
  flex-direction: row;
}
```

---

### 1.3 Organizacion de Archivos: ITCSS

El proyecto implementa la arquitectura ITCSS (Inverted Triangle CSS), que organiza los estilos en capas ordenadas de menor a mayor especificidad. Esta estructura evita problemas de cascada y facilita el mantenimiento.

**Diagrama de la arquitectura ITCSS:**

![Estructura ITCSS](../screenshots/estructura-itcss.png)

El triangulo invertido representa como la especificidad aumenta de arriba hacia abajo, comenzando con las variables globales y terminando con las utilidades de alta especificidad.

#### Estructura de Carpetas

```
src/styles/
├── 00-settings/
│   ├── _css-variables.scss
│   └── _variables.scss
├── 01-tools/
│   └── _mixins.scss
├── 02-generic/
│   └── _reset.scss
├── 03-elements/
│   ├── _buttons.scss
│   ├── _forms.scss
│   ├── _links.scss
│   ├── _lists.scss
│   └── _typography.scss
├── 04-layout/
│   └── _layout.scss
├── 05-components/
│   ├── _alerta.scss
│   ├── _boton.scss
│   ├── _formulario.scss
│   ├── _modal.scss
│   ├── _navegacion.scss
│   ├── _notificacion.scss
│   └── _tarjeta.scss
└── 06-utilities/
    └── _utilities.scss
```

#### Descripcion de Capas

| Capa | Contenido | Especificidad |
|------|-----------|---------------|
| 00-settings | Variables CSS y SCSS | Ninguna (solo definiciones) |
| 01-tools | Mixins y funciones | Ninguna (solo definiciones) |
| 02-generic | Reset y normalize | Muy baja (selectores de elemento) |
| 03-elements | Estilos base de HTML | Baja (selectores de elemento) |
| 04-layout | Estructuras de pagina | Media (clases de layout) |
| 05-components | Componentes UI | Media-alta (clases BEM) |
| 06-utilities | Clases de utilidad | Alta (clases especificas) |

Esta organizacion garantiza que los estilos mas genericos se carguen primero y los mas especificos despues, respetando el principio de cascada de CSS.

---

### 1.4 Sistema de Design Tokens

Los design tokens son variables que centralizan los valores de diseno, permitiendo cambios globales desde un unico punto y garantizando consistencia en toda la aplicacion.

#### Colores

**Colores Primarios y Secundarios**

Se eligio el verde como color primario (`#388e3c`) por su asociacion con naturaleza, crecimiento y acciones positivas, alineandose con la identidad del proyecto. El azul secundario (`#039be5`) proporciona contraste y se reserva para acciones alternativas.

```scss
// Tema claro
$primary-light: #388e3c;
$primary-hover-light: #328036;
$primary-active-light: #2d7230;

$secondary-light: #039be5;
$secondary-hover-light: #038cce;
$secondary-active-light: #027cb7;

// Tema oscuro
$primary-dark: #2a6b2d;
$primary-hover-dark: #225524;
$primary-active-dark: #19401b;
```

**Escala de Grises**

La escala de grises de 10 niveles permite crear jerarquias visuales sutiles y adaptarse a ambos temas (claro y oscuro).

```scss
$gray50: #f5f5f5;   // Fondos secundarios tema claro
$gray100: #e8e8e8;
$gray200: #cfcfcf;  // Bordes tema claro
$gray300: #b6b6b6;  // Texto secundario tema oscuro
$gray400: #9e9e9e;  // Placeholders
$gray500: #858585;
$gray600: #6b6b6b;  // Texto secundario tema claro
$gray700: #525252;  // Bordes tema oscuro
$gray800: #3b3b3b;  // Fondo secundario tema oscuro
$gray900: #222222;  // Texto primario tema claro / Fondo tema oscuro
```

**Colores Semanticos**

Los colores semanticos comunican estados y feedback al usuario de forma intuitiva.

```scss
$success: #2ecc71;      // Acciones exitosas
$success-bg: #eafaf1;   // Fondo de mensajes de exito
$success-text: #1d8348; // Texto sobre fondo de exito

$error: #c0392b;        // Errores y validaciones fallidas
$error-bg: #fdf2f0;
$error-text: #922b21;

$warning: #f39c12;      // Advertencias
$warning-bg: #fef5e7;
$warning-text: #9c640c;

$info: #34495e;         // Informacion neutral
$info-bg: #ebedef;
$info-text: #212f3c;
```

#### Tipografia

**Familias Tipograficas**

Se utilizan dos familias tipograficas con roles diferenciados:

- **Inter** (`--font-primary`): Fuente sans-serif optimizada para interfaces digitales. Se utiliza para todo el contenido: parrafos, etiquetas, botones, navegacion.
- **ABeeZee** (`--font-secondary`): Fuente con personalidad distintiva, reservada exclusivamente para titulos (h1-h6).

```scss
--font-primary: 'Inter', sans-serif;
--font-secondary: 'ABeeZee', sans-serif;
```

**Escala Tipografica**

La escala sigue una progresion armonica que facilita establecer jerarquias claras:

```scss
--font-xs: 0.75rem;    // 12px - Textos auxiliares, badges
--font-sm: 0.875rem;   // 14px - Ayudas, mensajes de error
--font-base: 1rem;     // 16px - Texto principal
--font-lg: 1.25rem;    // 20px - Subtitulos menores
--font-xl: 1.5rem;     // 24px - Titulos de tarjeta
--font-2xl: 1.875rem;  // 30px - Titulos de seccion
--font-3xl: 2.25rem;   // 36px - Titulos principales
--font-4xl: 3rem;      // 48px - Titulos hero
--font-5xl: 3.75rem;   // 60px - Titulos destacados
```

**Pesos y Alturas de Linea**

```scss
// Pesos
--font-light: 300;
--font-regular: 400;    // Texto de contenido
--font-medium: 500;     // Etiquetas, botones
--font-semibold: 600;   // Enfasis
--font-bold: 700;       // Titulos

// Alturas de linea
--font-tight: 1.25;     // Titulos
--font-normal: 1.5;     // Texto de contenido
--font-relaxed: 1.75;   // Texto extenso
```

#### Espaciado

La escala de espaciado utiliza incrementos de 0.25rem, proporcionando flexibilidad para ajustes finos mientras mantiene consistencia:

```scss
--spacing-1: 0.25rem;   // 4px
--spacing-2: 0.5rem;    // 8px - Gaps pequenos
--spacing-3: 0.75rem;   // 12px - Padding de inputs
--spacing-4: 1rem;      // 16px - Gap estandar
--spacing-6: 1.5rem;    // 24px - Padding de tarjetas
--spacing-8: 2rem;      // 32px - Separacion de secciones
// ... hasta --spacing-24: 6rem
```

#### Breakpoints

Los breakpoints se definen siguiendo un enfoque mobile-first:

```scss
$breakpoint-sm: 640px;   // Moviles grandes
$breakpoint-md: 768px;   // Tablets
$breakpoint-lg: 1024px;  // Laptops
$breakpoint-xl: 1280px;  // Escritorios
$breakpoint-2xl: 1400px; // Pantallas grandes
```

Estos valores se eligieron para cubrir los dispositivos mas comunes, alineandose con los breakpoints estandar de la industria.

---

### 1.5 Mixins y Funciones

Los mixins encapsulan patrones de estilos reutilizables, reduciendo la repeticion de codigo y garantizando consistencia.

#### Mixin 1: responsive

Gestiona las media queries de forma consistente utilizando los breakpoints definidos.

```scss
@mixin responsive($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// Uso
.tarjeta {
  width: 100%;

  @include responsive('md') {
    width: 50%;
  }

  @include responsive('lg') {
    width: 33.333%;
  }
}
```

#### Mixin 2: flex-centrar

Centra elementos tanto horizontal como verticalmente.

```scss
@mixin flex-centrar {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Uso
.modal__contenedor {
  @include flex-centrar;
  height: 100vh;
}
```

#### Mixin 3: flex-columna

Establece un layout de columna con gap opcional.

```scss
@mixin flex-columna($gap: 0) {
  display: flex;
  flex-direction: column;
  gap: $gap;
}

// Uso
.formulario {
  @include flex-columna(var(--spacing-4));
}
```

#### Mixin 4: flex-fila

Establece un layout de fila con gap opcional.

```scss
@mixin flex-fila($gap: 0) {
  display: flex;
  flex-direction: row;
  gap: $gap;
}

// Uso
.tarjeta__info-item {
  @include flex-fila(var(--spacing-2));
  align-items: center;
}
```

#### Mixin 5: tipografia-titulo

Aplica los estilos base para titulos.

```scss
@mixin tipografia-titulo {
  font-family: var(--font-secondary);
  font-weight: var(--font-bold);
  line-height: var(--font-tight);
}

// Uso
.tarjeta__titulo {
  @include tipografia-titulo;
  font-size: var(--font-xl);
}
```

#### Mixin 6: tipografia-texto

Aplica los estilos base para texto de contenido.

```scss
@mixin tipografia-texto {
  font-family: var(--font-primary);
  font-weight: var(--font-regular);
  line-height: var(--font-normal);
}

// Uso
.tarjeta__contenido {
  @include tipografia-texto;
  font-size: var(--font-base);
}
```

#### Mixin 7: boton-base

Establece los estilos fundamentales para botones.

```scss
@mixin boton-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  border: none;
  border-radius: var(--radius-lg);
  font-family: var(--font-primary);
  font-size: var(--font-base);
  cursor: pointer;
  transition: all var(--duration-fast) var(--timing-ease-in-out);

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

// Uso
.boton {
  @include boton-base;
}
```

#### Mixin 8: tarjeta-base

Estilos base para componentes tipo tarjeta.

```scss
@mixin tarjeta-base {
  background-color: var(--bg-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-6);
}

// Uso
.tarjeta {
  @include tarjeta-base;
}
```

#### Mixin 9: input-base

Estilos fundamentales para campos de entrada.

```scss
@mixin input-base {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: var(--border-medium) solid var(--border-color);
  border-radius: var(--radius-md);
  font-family: var(--font-primary);
  font-size: var(--font-base);
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: border-color var(--duration-fast) var(--timing-ease-in-out);

  &:focus {
    outline: none;
    border-color: var(--primary);
  }

  &::placeholder {
    color: var(--gray400);
  }
}

// Uso
.formulario__campo {
  @include input-base;
  border-radius: var(--radius-full);
}
```

#### Mixin 10: texto-truncado

Trunca texto largo con puntos suspensivos.

```scss
@mixin texto-truncado {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// Uso
.tarjeta__info-texto {
  @include texto-truncado;
}
```

#### Mixin 11: centrar-absoluto

Centra un elemento posicionado absolutamente.

```scss
@mixin centrar-absoluto {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// Uso
.modal__contenido {
  @include centrar-absoluto;
}
```

#### Mixin 12: transicion-suave

Aplica transiciones con duracion y timing consistentes.

```scss
@mixin transicion-suave($propiedades: all) {
  transition: $propiedades var(--duration-base) var(--timing-ease-in-out);
}

// Uso
.enlace {
  @include transicion-suave(color);
}
```

#### Mixin 13: oculto-accesible

Oculta visualmente un elemento manteniendolo accesible para lectores de pantalla.

```scss
@mixin oculto-accesible {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

// Uso
.formulario__etiqueta--oculta {
  @include oculto-accesible;
}
```

#### Mixin 14: overlay

Crea un fondo oscuro semitransparente para modales.

```scss
@mixin overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--overlay-bg);
  z-index: var(--z-modal);
}

// Uso
.modal__fondo {
  @include overlay;
}
```

#### Mixin 15: focus-visible

Aplica estilos de foco accesibles que solo aparecen con navegacion por teclado.

```scss
@mixin focus-visible {
  &:focus {
    outline: var(--border-medium) solid var(--primary);
    outline-offset: var(--border-medium);
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
}

// Uso
.boton {
  @include focus-visible;
}
```

---

### 1.6 ViewEncapsulation en Angular

Angular ofrece tres estrategias de encapsulacion de estilos. El proyecto utiliza un enfoque hibrido que combina las ventajas de cada una.

#### Estrategia Adoptada: Emulated (por defecto) + Estilos Globales

**ViewEncapsulation.Emulated** (configuracion por defecto de Angular):
- Angular anade atributos unicos a los elementos del componente.
- Los estilos definidos en el componente solo afectan a sus propios elementos.
- Evita conflictos entre componentes.

**Estilos Globales** (cargados en styles.scss):
- Los design tokens (variables CSS) son globales y accesibles desde cualquier componente.
- Los estilos de la capa 05-components estan disponibles globalmente.
- Los componentes Angular pueden utilizar las clases BEM definidas en los parciales globales.

#### Justificacion

Esta estrategia hibrida se eligio por las siguientes razones:

1. **Reutilizacion**: Los estilos de componentes como `.boton`, `.tarjeta` o `.formulario` estan definidos globalmente y pueden utilizarse en cualquier componente Angular sin duplicar codigo.

2. **Consistencia**: Al centralizar los estilos en parciales globales, se garantiza que todos los botones, tarjetas y formularios tengan el mismo aspecto en toda la aplicacion.

3. **Mantenibilidad**: Los cambios en un componente visual (por ejemplo, el radio de borde de los botones) se realizan en un unico archivo y se propagan automaticamente.

4. **Flexibilidad**: Los componentes Angular pueden anadir estilos especificos adicionales cuando sea necesario, aprovechando la encapsulacion Emulated.

#### Ejemplo de Implementacion

```typescript
// header.component.ts
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
  // ViewEncapsulation.Emulated por defecto
})
export class HeaderComponent { }
```

```scss
// header.component.scss
// Estilos especificos del componente (encapsulados)
:host {
  display: block;
  position: sticky;
  top: 0;
  z-index: var(--z-header);
}

.header {
  // Puede usar variables globales
  background-color: var(--bg-color);
  border-bottom: var(--border-thin) solid var(--border-color);
}
```

```html
<!-- header.component.html -->
<!-- Puede usar clases globales como .boton -->
<header class="header">
  <nav class="header__nav">
    <button class="boton boton--primario boton--pequeno">
      Iniciar sesion
    </button>
  </nav>
</header>
```

---

## Seccion 2: HTML Semantico y Estructura

### 2.1 Elementos Semanticos Utilizados

El proyecto utiliza elementos semanticos de HTML5 para estructurar el contenido de forma significativa, mejorando la accesibilidad y el SEO de la aplicacion.

#### header

El elemento `<header>` contiene la cabecera principal de la aplicacion, incluyendo el logotipo, la navegacion principal y las utilidades de usuario.

```html
<header class="header">
  <section class="header__container">
    <a routerLink="/" class="header__logo">
      <img src="/images/logo.png" alt="La Referente" class="header__logo-img" />
    </a>

    <nav class="header__nav">
      <ul class="header__nav-list">
        <li class="header__nav-item">
          <a routerLink="/noticias" class="header__nav-link">Noticias</a>
        </li>
        <li class="header__nav-item">
          <a routerLink="/competiciones" class="header__nav-link">Competiciones</a>
        </li>
      </ul>
    </nav>

    <section class="header__utilities">
      <!-- Buscador, tema, cuenta -->
    </section>
  </section>
</header>
```

#### nav

El elemento `<nav>` agrupa los enlaces de navegacion principal, facilitando a los lectores de pantalla identificar la zona de navegacion.

```html
<nav class="header__nav">
  <ul class="header__nav-list">
    <li class="header__nav-item">
      <a routerLink="/noticias" routerLinkActive="header__nav-link--active" class="header__nav-link">
        Noticias
      </a>
    </li>
    <li class="header__nav-item">
      <a routerLink="/competiciones" routerLinkActive="header__nav-link--active" class="header__nav-link">
        Competiciones
      </a>
    </li>
    <li class="header__nav-item">
      <a routerLink="/equipos" routerLinkActive="header__nav-link--active" class="header__nav-link">
        Equipos
      </a>
    </li>
  </ul>
</nav>
```

#### main

El elemento `<main>` contiene el contenido principal de cada pagina. En el proyecto se implementa como un componente de layout reutilizable.

```html
<main class="main">
  <section class="main__container">
    <ng-content></ng-content>
  </section>
</main>
```

#### section

El elemento `<section>` agrupa contenido tematico relacionado. Se utiliza para dividir las paginas en bloques logicos.

```html
<section class="home__featured">
  <h2 class="home__section-title">Jugadores Destacados</h2>
  <section class="home__cards">
    <app-card playerName="Lamine Yamal" />
    <app-card playerName="Pedri González" />
  </section>
</section>

<section class="home__competitions">
  <h2 class="home__section-title">Competiciones</h2>
  <section class="home__competition-cards">
    <app-competition-card name="LaLiga EA Sports" />
    <app-competition-card name="Copa del Rey" />
  </section>
</section>
```

#### article

El elemento `<article>` representa contenido independiente y autocontenido. Se utiliza para elementos que tendrian sentido por si solos, como las filas de un formulario dinamico.

```html
<fieldset formArrayName="phones" class="home__phones-list">
  <legend class="home__form-label">Telefonos</legend>
  @for (phone of phones.controls; track $index) {
    <article [formGroupName]="$index" class="home__phone-row">
      <input formControlName="number" placeholder="6XXXXXXXX o 7XXXXXXXX" class="home__form-input" />
      <button type="button" (click)="removePhone($index)" class="home__phone-remove">
        x
      </button>
    </article>
  }
</fieldset>
```

#### footer

El elemento `<footer>` contiene el pie de pagina con informacion legal, enlaces de redes sociales y copyright.

```html
<footer class="footer">
  <section class="footer__container">
    <section class="footer__main">
      <section class="footer__brand">
        <img src="/images/logo.png" alt="La Referente" class="footer__logo" />
        <p class="footer__description">Tu fuente de informacion sobre futbol espanol.</p>
      </section>

      <section class="footer__section">
        <h3 class="footer__title">Legal</h3>
        <ul class="footer__list">
          <li class="footer__list-item">
            <a routerLink="/terminos" class="footer__link">Terminos y condiciones</a>
          </li>
          <li class="footer__list-item">
            <a routerLink="/privacidad" class="footer__link">Politica de privacidad</a>
          </li>
        </ul>
      </section>

      <section class="footer__section">
        <h3 class="footer__title">Siguenos</h3>
        <ul class="footer__social-list">
          <li class="footer__social-item">
            <a href="https://twitter.com/lareferente" class="footer__social-link" aria-label="Twitter">
              <!-- Icono SVG -->
            </a>
          </li>
        </ul>
      </section>
    </section>

    <section class="footer__bottom">
      <p class="footer__copyright">La Referente. Todos los derechos reservados.</p>
    </section>
  </section>
</footer>
```

---

### 2.2 Jerarquia de Headings

La estructura de encabezados sigue una jerarquia logica y accesible, respetando las siguientes reglas:

- Solo existe un `<h1>` por pagina, representando el titulo principal.
- Los `<h2>` definen las secciones principales de cada pagina.
- Los `<h3>` subdividen las secciones cuando es necesario.
- Nunca se saltan niveles (por ejemplo, de h1 a h3 directamente).

#### Diagrama de Jerarquia

```
Pagina Home
│
├── h1: "Bienvenido a La Referente"
│
├── h2: "Prueba los Servicios"
│
├── h2: "Ejemplo FormArray - Lista Dinamica de Telefonos"
│
├── h2: "Jugadores Destacados"
│
└── h2: "Competiciones"


Pagina Footer (como referencia de h3)
│
├── h3: "Legal"
│
└── h3: "Siguenos"
```

#### Ejemplo en Codigo

```html
<!-- Pagina Home -->
<section class="home">
  <header class="home__header">
    <h1 class="home__title">Bienvenido a La Referente</h1>
    <p class="home__description">Tu fuente de informacion sobre futbol espanol</p>
  </header>

  <section class="home__demo">
    <h2 class="home__section-title">Prueba los Servicios</h2>
    <p class="home__section-desc">Interactua con los servicios de notificaciones</p>
  </section>

  <section class="home__featured">
    <h2 class="home__section-title">Jugadores Destacados</h2>
    <!-- Contenido -->
  </section>

  <section class="home__competitions">
    <h2 class="home__section-title">Competiciones</h2>
    <!-- Contenido -->
  </section>
</section>
```

#### Estilos de Headings

Cada nivel de encabezado tiene estilos diferenciados para reforzar la jerarquia visual:

```scss
// h1 - Titulo principal de pagina
.home__title {
  font-family: var(--font-secondary);
  font-size: var(--font-4xl);
  font-weight: var(--font-bold);
  line-height: var(--font-tight);
}

// h2 - Secciones principales
.home__section-title {
  font-family: var(--font-secondary);
  font-size: var(--font-2xl);
  font-weight: var(--font-bold);
  line-height: var(--font-tight);
}

// h3 - Subsecciones
.footer__title {
  font-family: var(--font-secondary);
  font-size: var(--font-lg);
  font-weight: var(--font-bold);
  line-height: var(--font-tight);
}
```

---

### 2.3 Estructura de Formularios

Los formularios del proyecto siguen una estructura semantica que garantiza accesibilidad y usabilidad.

#### Asociacion de Labels con Inputs

Todos los campos de formulario tienen su etiqueta `<label>` correctamente asociada mediante los atributos `for` e `id`. Esta asociacion permite que los usuarios puedan hacer clic en la etiqueta para enfocar el campo, y que los lectores de pantalla anuncien correctamente la relacion.

```html
<!-- Componente form-input -->
<section class="form-field">
  @if (label) {
    <label [for]="inputId" class="form-field__label">
      {{ label }}
      @if (required) {
        <span class="form-field__required">*</span>
      }
    </label>
  }

  <section class="form-field__input-wrapper">
    @if (icon) {
      <svg class="form-field__input-icon">
        <path [attr.d]="icon" />
      </svg>
    }

    <input
      class="form-field__input"
      [type]="type"
      [id]="inputId"
      [name]="name"
      [placeholder]="placeholder"
      [required]="required"
      [formControl]="control"
    />
  </section>

  @if (helpText) {
    <small class="form-field__help-text">{{ helpText }}</small>
  }

  @if (errorMessage) {
    <span class="form-field__error-message">{{ errorMessage }}</span>
  }
</section>
```

#### Uso de Fieldset y Legend

Los elementos `<fieldset>` y `<legend>` agrupan campos relacionados, proporcionando contexto semantico. Esto es especialmente util en formularios con multiples campos como el FormArray de telefonos.

```html
<form [formGroup]="phonesForm" (ngSubmit)="onSubmitPhones()" class="home__phones-form">
  <fieldset class="home__form-field">
    <label class="home__form-label">Nombre</label>
    <input
      formControlName="name"
      placeholder="Tu nombre"
      class="home__form-input"
    />
  </fieldset>

  <fieldset formArrayName="phones" class="home__phones-list">
    <legend class="home__form-label">Telefonos</legend>
    @for (phone of phones.controls; track $index) {
      <article [formGroupName]="$index" class="home__phone-row">
        <input
          formControlName="number"
          placeholder="6XXXXXXXX o 7XXXXXXXX"
          class="home__form-input"
        />
        <button type="button" (click)="removePhone($index)" class="home__phone-remove">
          x
        </button>
      </article>
    }
    <button type="button" (click)="addPhone()" class="home__phone-add">
      + Anadir telefono
    </button>
  </fieldset>

  <button type="submit" class="home__form-submit" [disabled]="phonesForm.invalid">
    Guardar telefonos
  </button>
</form>
```

#### Componente form-checkbox

El componente de checkbox mantiene la asociacion label-input y proporciona feedback visual del estado.

```html
<section class="form-checkbox">
  <section class="form-checkbox__wrapper">
    <input
      type="checkbox"
      [id]="checkboxId"
      [name]="name"
      [checked]="checked"
      [required]="required"
      [formControl]="control"
      class="form-checkbox__input"
    />
    <label [for]="checkboxId" class="form-checkbox__label-box">
      <span class="form-checkbox__box">
        <svg class="form-checkbox__icon" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </span>
    </label>
    <span class="form-checkbox__text">
      <ng-content>{{ label }}</ng-content>
      @if (required) {
        <span class="form-checkbox__required">*</span>
      }
    </span>
  </section>
  @if (helpText) {
    <p class="form-checkbox__help">{{ helpText }}</p>
  }
</section>
```

#### Uso en el Formulario de Registro

El formulario de registro utiliza los componentes reutilizables manteniendo la estructura semantica:

```html
<form class="register-form" [formGroup]="registerForm" (ngSubmit)="onSubmit($event)">
  <section class="register-form__field">
    <app-form-input
      label="Correo electronico"
      type="email"
      inputId="register-email"
      placeholder="Introduce tu correo electronico"
      [required]="true"
      [control]="email"
    />
  </section>

  <app-form-input
    label="Nombre"
    type="text"
    inputId="register-nombre"
    placeholder="Introduce tu nombre"
    [required]="true"
    [control]="nombre"
  />

  <section class="register-form__field">
    <app-form-input
      label="Contrasena"
      type="password"
      inputId="register-password"
      placeholder="Minimo 12 caracteres"
      [required]="true"
      [control]="password"
    />
  </section>

  <section class="register-form__terms-wrapper">
    <app-form-checkbox
      checkboxId="register-terms"
      [required]="true"
      [control]="terms"
    >
      Acepto los <a href="/terminos" class="register-form__terms-link">terminos y condiciones</a>
    </app-form-checkbox>
  </section>

  <app-form-modal-button
    text="Registrarse"
    type="submit"
    [disabled]="registerForm.invalid || registerForm.pending"
  />
</form>
```

#### Atributo role="search"

Los formularios de busqueda utilizan el atributo `role="search"` para indicar su proposito a las tecnologias de asistencia.

```html
<form class="header__search" role="search">
  <select class="header__search-dropdown">
    <option value="all">Todo</option>
    <option value="noticias">Noticias</option>
    <option value="equipos">Equipos</option>
  </select>
  <input type="text" class="header__search-input" placeholder="Buscar" />
  <button type="submit" class="header__search-btn" aria-label="Buscar">
    <!-- Icono SVG -->
  </button>
</form>
```

---

## Seccion 3: Sistema de Componentes UI

### 3.1 Componentes Implementados

El proyecto cuenta con un sistema de componentes reutilizables desarrollados en Angular. A continuacion se documenta cada componente con sus propiedades, variantes y ejemplos de uso.

---

#### Button

**Proposito**: Componente de boton reutilizable para acciones del usuario.

**Variantes disponibles**:
- `primary`: Boton principal con borde verde, fondo blanco que se invierte en hover.
- `secondary`: Boton secundario con borde azul.
- `ghost`: Boton sin borde ni fondo, solo texto.
- `danger`: Boton de accion peligrosa con borde rojo.

**Tamanos disponibles**:
- `sm`: Pequeno (padding reducido, fuente pequena).
- `md`: Mediano (tamano por defecto).
- `lg`: Grande (padding amplio, fuente mayor).

**Estados que maneja**:
- Normal: Estado por defecto.
- Hover: Cambio de colores al pasar el raton.
- Focus: Outline visible para navegacion por teclado.
- Active: Reduccion de escala al hacer clic.
- Disabled: Opacidad reducida, cursor no permitido.

**Ejemplo de uso**:

```html
<app-button
  text="Guardar cambios"
  variant="primary"
  size="md"
  (click)="onSave()"
/>

<app-button
  text="Cancelar"
  variant="ghost"
  size="sm"
  (click)="onCancel()"
/>

<app-button
  text="Eliminar"
  variant="danger"
  size="md"
  [disabled]="!canDelete"
/>
```

---

#### Alert

**Proposito**: Componente para mostrar mensajes de retroalimentacion al usuario.

**Variantes disponibles**:
- `success`: Fondo verde claro, texto verde oscuro.
- `error`: Fondo rojo claro, texto rojo oscuro.
- `warning`: Fondo amarillo claro, texto naranja oscuro.
- `info`: Fondo gris claro, texto gris oscuro.

**Estados que maneja**:
- Visible: Muestra la alerta.
- Cerrado: Oculta la alerta al hacer clic en el boton de cierre.
- Closable: Propiedad que controla si se muestra el boton de cierre.

**Ejemplo de uso**:

```html
<app-alert
  type="success"
  message="Los cambios se han guardado correctamente."
/>

<app-alert
  type="error"
  message="Ha ocurrido un error. Intentalo de nuevo."
  [closable]="true"
  (close)="onAlertClose()"
/>

<app-alert
  type="warning"
  message="Esta accion no se puede deshacer."
/>

<app-alert
  type="info"
  message="Se han actualizado las condiciones del servicio."
/>
```

---

#### Card (Player Card)

**Proposito**: Tarjeta para mostrar informacion de jugadores de futbol.

**Propiedades requeridas**:
- `playerName`: Nombre del jugador.
- `playerImage`: URL de la imagen del jugador.
- `dorsalNumber`: Numero de dorsal.
- `clubName`: Nombre del club.
- `clubLogo`: URL del escudo del club.
- `country`: Pais de origen.
- `age`: Edad del jugador.
- `position`: Posicion en el campo.

**Estados que maneja**:
- Normal: Muestra toda la informacion del jugador.
- Hover en botones: Los botones de accion cambian de estilo.

**Ejemplo de uso**:

```html
<app-card
  playerName="Lamine Yamal"
  playerImage="https://ejemplo.com/yamal.png"
  [dorsalNumber]="10"
  clubName="FC Barcelona"
  clubLogo="https://ejemplo.com/barcelona.png"
  country="Espana"
  [age]="18"
  position="Extremo"
/>
```

---

#### CompetitionCard

**Proposito**: Tarjeta para mostrar informacion de competiciones deportivas.

**Propiedades requeridas**:
- `logo`: URL del logotipo de la competicion.
- `name`: Nombre de la competicion.
- `totalTeams`: Numero total de equipos.
- `startDate`: Fecha de inicio (formato texto).
- `endDate`: Fecha de finalizacion.

**Propiedades opcionales**:
- `groups`: Numero de grupos (si la competicion es multigrupo).

**Estados que maneja**:
- Normal: Muestra la informacion de la competicion.
- Multigrupo: Si tiene grupos, muestra informacion adicional.

**Ejemplo de uso**:

```html
<app-competition-card
  logo="https://ejemplo.com/laliga.png"
  name="LaLiga EA Sports"
  [totalTeams]="20"
  startDate="Agosto 2024"
  endDate="Mayo 2025"
/>

<app-competition-card
  logo="https://ejemplo.com/copa.png"
  name="Copa del Rey"
  [totalTeams]="116"
  [groups]="4"
  startDate="Octubre 2024"
  endDate="Abril 2025"
/>
```

---

#### FormInput

**Proposito**: Campo de entrada reutilizable para formularios.

**Propiedades disponibles**:
- `label`: Etiqueta del campo.
- `type`: Tipo de input (text, email, password, etc.).
- `inputId`: ID unico para asociar con label.
- `name`: Nombre del campo.
- `placeholder`: Texto de placeholder.
- `required`: Indica si el campo es obligatorio.
- `icon`: Path SVG del icono (opcional).
- `helpText`: Texto de ayuda.
- `errorMessage`: Mensaje de error.
- `control`: FormControl para formularios reactivos.

**Estados que maneja**:
- Normal: Campo vacio o con valor.
- Focus: Borde resaltado.
- Con icono: Muestra icono a la izquierda.
- Error: Muestra mensaje de error.
- Requerido: Muestra asterisco junto a la etiqueta.

**Ejemplo de uso**:

```html
<app-form-input
  label="Correo electronico"
  type="email"
  inputId="email"
  placeholder="correo@ejemplo.com"
  icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14..."
  [required]="true"
  [control]="emailControl"
/>
```

---

#### FormTextarea

**Proposito**: Area de texto para entradas multilinea.

**Propiedades disponibles**:
- `label`: Etiqueta del campo.
- `textareaId`: ID unico.
- `name`: Nombre del campo.
- `placeholder`: Texto de placeholder.
- `required`: Indica si es obligatorio.
- `rows`: Numero de filas visibles.
- `maxLength`: Longitud maxima de caracteres.
- `helpText`: Texto de ayuda.
- `errorMessage`: Mensaje de error.

**Estados que maneja**:
- Normal: Area de texto estandar.
- Focus: Borde resaltado.
- Con limite: Muestra contador de caracteres.

**Ejemplo de uso**:

```html
<app-form-textarea
  label="Descripcion"
  textareaId="description"
  name="description"
  placeholder="Escribe tu comentario..."
  [rows]="4"
  [maxLength]="500"
/>
```

---

#### FormSelect

**Proposito**: Selector desplegable para opciones predefinidas.

**Propiedades disponibles**:
- `label`: Etiqueta del selector.
- `selectId`: ID unico.
- `name`: Nombre del campo.
- `options`: Array de opciones (value, label).
- `placeholder`: Texto por defecto.
- `required`: Indica si es obligatorio.

**Estados que maneja**:
- Normal: Selector cerrado.
- Focus: Icono rotado, borde resaltado.
- Con seleccion: Muestra la opcion seleccionada.

**Ejemplo de uso**:

```typescript
// En el componente
positionOptions = [
  { value: 'portero', label: 'Portero' },
  { value: 'defensa', label: 'Defensa' },
  { value: 'centrocampista', label: 'Centrocampista' },
  { value: 'delantero', label: 'Delantero' }
];
```

```html
<app-form-select
  label="Posicion"
  selectId="position"
  name="position"
  [options]="positionOptions"
  placeholder="Selecciona una posicion"
  [required]="true"
/>
```

---

#### FormCheckbox

**Proposito**: Casilla de verificacion con diseno personalizado.

**Propiedades disponibles**:
- `label`: Etiqueta del checkbox.
- `checkboxId`: ID unico.
- `name`: Nombre del campo.
- `required`: Indica si es obligatorio.
- `checked`: Estado inicial marcado.
- `helpText`: Texto de ayuda adicional.
- `control`: FormControl para formularios reactivos.

**Estados que maneja**:
- Normal: Checkbox sin marcar.
- Checked: Checkbox marcado con icono de verificacion.
- Focus: Outline visible.
- Disabled: Opacidad reducida.

**Ejemplo de uso**:

```html
<app-form-checkbox
  checkboxId="terms"
  [required]="true"
  [control]="termsControl"
>
  Acepto los <a href="/terminos">terminos y condiciones</a>
</app-form-checkbox>

<app-form-checkbox
  checkboxId="newsletter"
  label="Suscribirme al boletin"
  helpText="Recibiras un correo mensual"
/>
```

---

#### AccountModal

**Proposito**: Modal para formularios de autenticacion (login, registro).

**Propiedades disponibles**:
- `title`: Titulo del modal.

**Eventos emitidos**:
- `close`: Se emite al cerrar el modal.

**Estados que maneja**:
- Abierto: Muestra el modal con overlay.
- Click en overlay: Cierra el modal.
- Click en contenido: Detiene la propagacion (no cierra).

**Ejemplo de uso**:

```html
@if (showLoginModal()) {
  <app-account-modal title="Iniciar sesion" (close)="closeLoginModal()">
    <app-login-form (switchToRegister)="switchToRegister()" />
  </app-account-modal>
}
```

---

#### FormModalButton

**Proposito**: Boton especifico para modales de formulario.

**Propiedades disponibles**:
- `text`: Texto del boton.
- `type`: Tipo de boton (submit, button).
- `disabled`: Estado deshabilitado.

**Ejemplo de uso**:

```html
<app-form-modal-button
  text="Registrarse"
  type="submit"
  [disabled]="registerForm.invalid"
/>
```

---

### 3.2 Nomenclatura y Metodologia

La nomenclatura de clases CSS sigue la metodologia BEM (Block Element Modifier), aplicada de forma consistente en todos los componentes.

#### Estructura BEM en Componentes

**Block (Bloque)**: Representa el componente como entidad independiente.

```scss
.button { }
.alert { }
.card { }
.form-field { }
.form-checkbox { }
```

**Element (Elemento)**: Representa una parte del bloque que no tiene sentido por si sola. Se une al bloque con doble guion bajo (`__`).

```scss
.card__header { }
.card__player { }
.card__player-image { }
.card__info { }
.card__info-item { }
.card__actions { }

.alert__message { }
.alert__close { }

.form-field__label { }
.form-field__input { }
.form-field__input-wrapper { }
.form-field__help-text { }
.form-field__error-message { }
```

**Modifier (Modificador)**: Representa una variacion del bloque o elemento. Se une con doble guion (`--`).

```scss
// Modificadores de variante
.button--primary { }
.button--secondary { }
.button--ghost { }
.button--danger { }

// Modificadores de tamano
.button--sm { }
.button--md { }
.button--lg { }

// Modificadores de tipo
.alert--success { }
.alert--error { }
.alert--warning { }
.alert--info { }

// Modificadores de estado
.card__button--primary { }
.card__button--secondary { }
```

#### Modificadores vs Clases de Estado

**Modificadores** se utilizan para variaciones estructurales o visuales que se definen al crear el componente:

```html
<!-- El modificador define la variante del boton -->
<button class="button button--primary button--lg">Guardar</button>

<!-- El modificador define el tipo de alerta -->
<aside class="alert alert--success">Operacion exitosa</aside>
```

**Clases de estado** se utilizan para cambios dinamicos que dependen de la interaccion o datos:

```scss
// Estados aplicados dinamicamente
.form-field__input--error { }
.form-field__input--valid { }
.header__nav-link--active { }
.header__hamburger--open { }
```

```html
<!-- Clase de estado aplicada condicionalmente -->
<input
  class="form-field__input"
  [class.form-field__input--error]="control.invalid && control.touched"
/>

<!-- Clase de estado para navegacion activa -->
<a
  routerLink="/noticias"
  routerLinkActive="header__nav-link--active"
  class="header__nav-link"
>
  Noticias
</a>
```

#### Ejemplo Completo: Componente Button

```scss
// Bloque
.button {
  font-family: var(--font-primary);
  font-weight: var(--font-medium);
  cursor: pointer;
  transition: all var(--duration-fast) var(--timing-ease-in-out);
  border: var(--border-medium) solid transparent;

  // Estado focus (pseudoclase, no modificador)
  &:focus {
    outline: var(--border-medium) solid var(--primary);
    outline-offset: var(--border-medium);
  }

  // Estado disabled
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  // Modificadores de tamano
  &--sm {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: var(--font-sm);
    border-radius: var(--radius-xl);
  }

  &--md {
    padding: var(--spacing-3) var(--spacing-6);
    font-size: var(--font-base);
    border-radius: var(--radius-2xl);
  }

  &--lg {
    padding: var(--spacing-4) var(--spacing-8);
    font-size: var(--font-lg);
    border-radius: var(--radius-2xl);
  }

  // Modificadores de variante
  &--primary {
    background-color: var(--white);
    border-color: var(--primary);
    color: var(--primary);

    &:hover:not(:disabled) {
      background-color: var(--primary);
      color: var(--white);
    }
  }

  &--secondary {
    background-color: var(--white);
    border-color: var(--secondary);
    color: var(--secondary);

    &:hover:not(:disabled) {
      background-color: var(--secondary);
      color: var(--white);
    }
  }

  &--danger {
    background-color: transparent;
    border-color: var(--error);
    color: var(--error);

    &:hover:not(:disabled) {
      background-color: var(--error);
      color: var(--white);
    }
  }
}
```

---

### 3.3 Style Guide

El proyecto incluye una pagina de Style Guide accesible en la ruta `/style-guide`. Esta pagina sirve como documentacion visual y referencia para todos los componentes del sistema de diseno.

#### Proposito del Style Guide

1. **Documentacion visual**: Muestra todos los componentes con sus variantes y estados, permitiendo ver de un vistazo el aspecto de cada uno.

2. **Testing visual**: Permite verificar que los componentes se renderizan correctamente tras cambios en los estilos globales o en los propios componentes.

3. **Referencia para desarrollo**: Los desarrolladores pueden consultar la guia para ver como utilizar cada componente y que propiedades acepta.

4. **Consistencia**: Garantiza que todos los miembros del equipo utilicen los componentes de forma uniforme.

#### Estructura del Style Guide

```html
<section class="style-guide">
  <header class="style-guide__header">
    <h1 class="style-guide__title">Style Guide</h1>
    <p class="style-guide__subtitle">Guia de componentes y estilos de La Referente</p>
  </header>

  <!-- Seccion de Botones -->
  <section id="buttons" class="style-guide__section">
    <h2 class="style-guide__section-title">Botones</h2>
    <p class="style-guide__section-desc">Todos los tamanos, variantes y estados.</p>

    <article class="style-guide__component">
      <h3 class="style-guide__component-title">Primary Buttons</h3>
      <section class="style-guide__showcase">
        <section class="style-guide__item">
          <app-button text="Small" variant="primary" size="sm" />
          <span class="style-guide__label">Small</span>
        </section>
        <section class="style-guide__item">
          <app-button text="Medium" variant="primary" size="md" />
          <span class="style-guide__label">Medium</span>
        </section>
        <section class="style-guide__item">
          <app-button text="Large" variant="primary" size="lg" />
          <span class="style-guide__label">Large</span>
        </section>
        <section class="style-guide__item">
          <app-button text="Disabled" variant="primary" [disabled]="true" />
          <span class="style-guide__label">Disabled</span>
        </section>
      </section>
    </article>
  </section>

  <!-- Seccion de Formularios -->
  <section id="forms" class="style-guide__section">
    <h2 class="style-guide__section-title">Formularios</h2>
    <!-- Inputs, selects, textareas, checkboxes -->
  </section>

  <!-- Seccion de Tarjetas -->
  <section id="cards" class="style-guide__section">
    <h2 class="style-guide__section-title">Tarjetas</h2>
    <!-- Player cards, competition cards -->
  </section>

  <!-- Seccion de Feedback -->
  <section id="feedback" class="style-guide__section">
    <h2 class="style-guide__section-title">Feedback</h2>
    <!-- Alerts -->
  </section>
</section>
```

#### Secciones del Style Guide

| Seccion | Componentes incluidos |
|---------|----------------------|
| Botones | Primary, Secondary, Ghost, Danger (cada uno en sm, md, lg y disabled) |
| Formularios | FormInput, FormTextarea, FormSelect, FormCheckbox |
| Tarjetas | Card (jugador), CompetitionCard |
| Feedback | Alert (success, error, warning, info) |

**Captura del Style Guide:**

![Style Guide](../screenshots/styles_guide-cap.png)

La captura muestra la pagina de Style Guide con los diferentes componentes organizados por secciones, permitiendo visualizar todas las variantes y estados de cada elemento.

#### Acceso al Style Guide

Para acceder al Style Guide, navegar a la ruta `/style-guide` en la aplicacion o hacer clic en el boton "Ver Guia de Componentes" en la pagina principal.

---

## Seccion 4: Responsive Design y Container Queries

### 4.1 Breakpoints

El sistema de breakpoints define los puntos de ruptura donde el diseno se adapta a diferentes tamanos de pantalla.

| Breakpoint | Valor | Dispositivos objetivo |
|------------|-------|----------------------|
| `sm` | 640px | Moviles grandes |
| `md` | 768px | Tablets en vertical |
| `lg` | 1024px | Tablets horizontales, laptops |
| `xl` | 1280px | Escritorios |
| `2xl` | 1400px | Pantallas grandes |

Estos valores se eligieron porque cubren los dispositivos mas comunes del mercado. El breakpoint de 768px coincide con el iPad en vertical, 1024px con tablets en horizontal y laptops pequenos, y 1280px es la resolucion tipica de monitores de escritorio.

```scss
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1400px;

$breakpoints: (
  'sm': $breakpoint-sm,
  'md': $breakpoint-md,
  'lg': $breakpoint-lg,
  'xl': $breakpoint-xl,
  '2xl': $breakpoint-2xl
);
```

---

### 4.2 Estrategia Mobile-First

Se ha utilizado Mobile-First porque obliga a priorizar el contenido esencial y los estilos se van ampliando progresivamente en lugar de ir recortando. El codigo queda mas limpio y los moviles cargan menos CSS.

El mixin `responsive` encapsula las media queries:

```scss
@mixin responsive($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}
```

Ejemplo en la pagina de competiciones:

```scss
.competitions__grid {
  // Base: 1 columna en movil
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);

  // 2 columnas desde 640px
  @include responsive('sm') {
    grid-template-columns: repeat(2, 1fr);
  }

  // 3 columnas desde 1024px
  @include responsive('lg') {
    grid-template-columns: repeat(3, 1fr);
  }

  // 4 columnas desde 1280px
  @include responsive('xl') {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

### 4.3 Container Queries

Container Queries permite que los componentes respondan al tamano de su contenedor en lugar del viewport. Esto los hace reutilizables en cualquier contexto sin tener que crear variantes con clases.

#### Card (Tarjeta de jugador)

```scss
:host {
  display: block;
  container-type: inline-size;
  container-name: card;
}

.card {
  // Estilos base para contenedores estrechos
  &__info {
    grid-template-columns: 1fr;
  }
}

// Cuando el contenedor tiene al menos 300px
@container card (min-width: 300px) {
  .card {
    &__info {
      grid-template-columns: 1fr 1fr;
    }

    &__player-image {
      width: 130px;
      height: 130px;
    }
  }
}
```

#### CompetitionCard (Tarjeta de competicion)

```scss
:host {
  display: block;
  container-type: inline-size;
  container-name: competition-card;
}

.competition-card {
  &__header {
    flex-direction: column;
    align-items: center;
  }
}

// Layout horizontal cuando hay espacio
@container competition-card (min-width: 240px) {
  .competition-card {
    &__header {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }

    &__title {
      text-align: left;
    }
  }
}
```

---

### 4.4 Tabla de Adaptaciones

| Seccion | Mobile (< 640px) | Tablet (768px) | Desktop (>= 1024px) |
|---------|------------------|----------------|---------------------|
| Header | Hamburguesa visible, nav oculto | Hamburguesa visible | Nav horizontal, buscador visible |
| Grid de cards | 1 columna | 2 columnas | 3-4 columnas |
| Competition cards | Layout vertical, 1 columna | 2 columnas, badges en fila | 3-4 columnas, header horizontal |
| Filtros | Scroll horizontal | Scroll horizontal | Wrap en multiples lineas |
| Paginacion | Botones pequenos, gap reducido | Botones medianos | Botones grandes |
| Titulos | font-2xl | font-3xl | font-4xl |

---

### 4.5 Paginas Responsive

| Pagina | Ruta | Descripcion |
|--------|------|-------------|
| Home | `/` | Pagina principal con cards de jugadores, competiciones y formularios de demo |
| Style Guide | `/style-guide` | Catalogo de componentes con todas las variantes |
| Competiciones | `/competiciones` | Listado de competiciones con filtros por categoria y paginacion |

#### Competiciones (`/competiciones`)

Pagina que muestra las competiciones de futbol con:

- Buscador y filtros por categoria (Todas, Senior, Juvenil, Cadete, etc.)
- Grid responsive que pasa de 1 a 4 columnas segun el viewport
- Tarjetas con Container Queries que adaptan su layout interno
- Paginacion responsive

```scss
.competitions {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-4);

  @include responsive('md') {
    padding: var(--spacing-6);
  }

  &__toolbar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);

    @include responsive('lg') {
      flex-direction: row;
      align-items: center;
    }
  }
}
```

---

### 4.6 Capturas Comparativas

#### Home

**Mobile (375px):**

![Home 375px](../screenshots/home-375px.png)

**Tablet (768px):**

![Home 768px](../screenshots/home-768px.png)

**Desktop (1280px):**

![Home 1280px](../screenshots/home-1280px.png)

#### Competiciones

**Mobile (375px):**

![Competiciones 375px](../screenshots/competitions-375px.png)

**Tablet (768px):**

![Competiciones 768px](../screenshots/competitions-768px.png)

**Desktop (1280px):**

![Competiciones 1280px](../screenshots/competitions-1280px.png)

#### Style Guide

**Mobile (375px):**

![Style Guide 375px](../screenshots/styleguide-375px.png)

**Tablet (768px):**

![Style Guide 768px](../screenshots/styleguide-768px.png)

**Desktop (1280px):**

![Style Guide 1280px](../screenshots/styleguide-1280px.png)

---

