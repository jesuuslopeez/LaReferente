# Sección 1: Arquitectura CSS y comunicación visual

## 1.1 Principios de comunicación visual

### Jerarquía: Tamaños, pesos y espaciado para crear importancia visual

La jerarquía visual en "La Referente" se establece mediante un sistema tipográfico escalado y consistente:

**Sistema de tamaños tipográficos:**
```scss
--font-xs:  0.75rem;   // 12px - Textos secundarios, labels pequeños
--font-s:   0.875rem;  // 14px - Textos de cuerpo secundario
--font-m:   1rem;      // 16px - Texto base, párrafos principales
--font-l:   1.25rem;   // 20px - Subtítulos, destacados
--font-xl:  1.5rem;    // 24px - Títulos de sección
--font-2xl: 1.875rem;  // 30px - Títulos de página secundarios
--font-3xl: 2.25rem;   // 36px - Títulos principales
--font-4xl: 3rem;      // 48px - Headers destacados
--font-5xl: 3.75rem;   // 60px - Hero sections
```

**Pesos tipográficos para enfatizar:**
- `--font-light` (light): Textos decorativos o secundarios
- `--font-regular` (normal): Texto de lectura estándar
- `--font-medium` (medium): Textos con ligero énfasis
- `--font-semibold` (600): Subtítulos y elementos importantes
- `--font-bold` (bold): Títulos principales y CTAs

**Aplicación en el proyecto:**
- **H1**: `--font-3xl` + `--font-bold` → Títulos principales de página
- **H2**: `--font-xl` + `--font-semibold` → Títulos de sección
- **H3**: `--font-l` + `--font-medium` → Subtítulos
- **Body**: `--font-m` + `--font-regular` → Contenido principal
- **Small**: `--font-s` + `--font-regular` → Metadatos, fechas

**Espaciado para separar niveles:**
```scss
--spacing-1:  0.25rem;  // Espacios mínimos
--spacing-2:  0.5rem;   // Entre texto relacionado
--spacing-4:  1rem;     // Entre elementos de grupo
--spacing-8:  2rem;     // Entre secciones pequeñas
--spacing-12: 3rem;     // Entre secciones medias
--spacing-16: 4rem;     // Entre secciones principales
--spacing-24: 6rem;     // Entre bloques de contenido
```

> **Captura de pantalla:** ![Captura de pantalla estilos](../screenshots/styles_guide-cap.png)

---

### Contraste: Color, tamaño y peso para diferenciar elementos

El contraste en "La Referente" se logra mediante:

**1. Contraste de color:**

**Tema claro:**
- Primario: `#388E3C` (verde) → Cabecera, footer, botones principales, enlaces, acciones destacadas
- Secundario: `#039BE5` (azul) → Botones secundarios, información adicional
- Texto principal: `#222222` (gray900) sobre fondo blanco → Alto contraste
- Texto secundario: `#525252` (gray700) → Contraste moderado

**Tema oscuro:**
- Primario: `#2A6B2D` (verde oscuro) → Mantiene identidad visual
- Secundario: `#0274AC` (azul oscuro)
- Texto principal: `#ffffff` sobre `#222222` → Contraste invertido
- Fondo: `#222222` (gray900)

**2. Estados para feedback visual:**
```scss
--state-success: #2ECC71;  // Verde brillante para confirmaciones
--state-error:   #E74C3C;  // Rojo para errores y alertas
--state-warning: #F39C12;  // Naranja para advertencias
--state-info:    #34495E;  // Gris azulado para información
```

Cada estado incluye variantes de fondo y texto:
- `--state-success-bg`: `#EAFAF1` (fondo suave)
- `--state-success-text`: `#1D8348` (texto con contraste)

**3. Contraste de tamaño:**
- **Botones primarios**: Padding `--spacing-4` × `--spacing-6` (1rem × 1.5rem)
- **Botones secundarios**: Padding `--spacing-3` × `--spacing-5` (0.75rem × 1.25rem)
- **Botones terciarios**: Padding `--spacing-2` × `--spacing-4` (0.5rem × 1rem)

**4. Contraste de peso:**
- **CTAs**: `--font-semibold` o `--font-bold`
- **Texto informativo**: `--font-regular`
- **Metadatos**: `--font-light`

> **Captura de pantalla:** ![Captura de pantalla contrastes](../screenshots/noticias-contraste.png)

---

### Alineación: Estrategia de alineación (izquierda, centro, grid)

"La Referente" utiliza un sistema de grid flexible y alineación consistente:

**Sistema de Grid (implementado con CSS Grid):**
```scss
.container {
  display: grid;
  grid-template-columns: repeat(12, 1fr); // Grid de 12 columnas
  gap: var(--spacing-6); // 1.5rem entre columnas
}

// Breakpoints para responsive
@media (max-width: $breakpoint-sm) {  // 640px
  grid-template-columns: repeat(4, 1fr);
}
@media (min-width: $breakpoint-md) {  // 768px
  grid-template-columns: repeat(8, 1fr);
}
@media (min-width: $breakpoint-lg) {  // 1024px
  grid-template-columns: repeat(12, 1fr);
}
```

**Estrategia de alineación:**

1. **Textos largos y contenido de lectura**: Alineación izquierda
   - Artículos, descripciones de productos
   - Facilita la lectura natural (patrón F)

2. **Títulos y elementos destacados**: Alineación centrada
   - Hero sections
   - Títulos de landing pages
   - Modales y alertas

3. **Navegación y menús**: Alineación horizontal distribuida
   ```scss
   .nav {
     display: flex;
     justify-content: space-between; // Distribuir elementos
     align-items: center; // Centrar verticalmente
   }
   ```

4. **Cards y elementos de grid**: Alineación en grid
   ```scss
   .product-grid {
     display: grid;
     grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
     gap: var(--spacing-6);
   }
   ```

5. **Formularios**: Alineación izquierda con labels encima
   - Labels y inputs alineados a la izquierda
   - Botones de acción alineados a la derecha

> **Captura de pantalla:** ![Captura de pantalla posicionamiento](../screenshots/alineaciones-posicionamientos.png)

---

### Proximidad: Agrupación de elementos relacionados con espaciado

La proximidad en "La Referente" sigue la ley de Gestalt: elementos relacionados están cerca, elementos no relacionados están separados.

**Sistema de proximidad por espaciado:**

```scss
// Elementos muy relacionados
.input-group {
  label + input { margin-top: var(--spacing-1); } // 4px
}

// Elementos relacionados
.card-content {
  h3 + p { margin-top: var(--spacing-2); } // 8px
  p + p { margin-top: var(--spacing-3); } // 12px
}

// Grupos de elementos
.section-block {
  margin-bottom: var(--spacing-8); // 32px
}

// Secciones principales 
section + section {
  margin-top: var(--spacing-16); // 64px
}

// Bloques de contenido 
.page-section {
  padding-block: var(--spacing-24); // 96px
}
```

**Reglas de proximidad aplicadas:**

1. **Label + Input**: `--spacing-1` (4px) → Unidad visual clara
2. **Título + Descripción**: `--spacing-2` (8px) → Relación directa
3. **Párrafos consecutivos**: `--spacing-3` (12px) → Continuidad de lectura
4. **Items de lista**: `--spacing-2` (8px) → Elementos del mismo grupo
5. **Cards en grid**: `--spacing-6` (24px) → Separación visual entre items
6. **Secciones de página**: `--spacing-16` (64px) → Cambio de contexto

**Ejemplo práctico - Card de jugador:**
```
┌─────────────────────────┐
│ [Foto]         [Dorsal] │ ← spacing-9 entre nombre y dorsal
│ Nombre                  │
│                         │ 
│                         │ 
│ EQUIPO         PAÍS     │ ← spacing-12 entre datos
│ POSICIÓN       EDAD     │ ← spacing-12 entre datos
│                         │ 
|-------------------------|
| Ver perfil | Ver equipo |
└─────────────────────────┘
```

> **Captura de pantalla:** ![Captura card jugador](../screenshots/muestra-card-jugador.png)

---

### Repetición: Coherencia mediante patrones visuales

La repetición en "La Referente" crea coherencia y profesionalismo mediante:

**1. Componentes reutilizables:**

**Botones** - Patrón repetido:
```scss
.btn {
  border-radius: var(--radius-2xl);     // mayormente utilizado
  font-weight: var(--font-semibold);   
  transition: all var(--duration-base) var(--timing-ease-in-out);

  &--primary {
    background: var(--primary);
    color: white;
    &:hover { background: var(--primary-hover); }
  }
}
```

Todas las variantes (`primary`, `secondary`, `outline`) comparten:
- Border radius consistente
- Peso tipográfico
- Duración de transición
- Estados hover/active

**2. Cards** - Estructura repetida:
```scss
.card {
  background: var(--bg-color);
  border: var(--border-thin) solid var(--border-color);
  border-radius: var(--radius-lg);     
  box-shadow: var(--shadow-md);        
  padding: var(--spacing-6);            
}
```

**3. Espaciado vertical consistente:**
```scss
section {
  padding-block: var(--spacing-16); 

  h2 {
    margin-bottom: var(--spacing-6);
  }
}
```

**4. Radios de borde coherentes:**
```scss
--radius-sm:   2px;
--radius-md:   4px; 
--radius-lg:   8px;  
--radius-xl:   12px; 
--radius-2xl:  16px; 
--radius-full: 9999px; 
```

Cada tipo de elemento usa **siempre** el mismo radio.

**5. Sombras estandarizadas:**
```scss
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);      
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);    
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);  
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1); 
```

**6. Transiciones uniformes:**
```scss
--duration-fast: 150ms;  
--duration-base: 300ms;  
--duration-slow: 500ms;  

--timing-ease-in-out: ease-in-out;
```

**Patrón de repetición visual:**
- **Iconos**: Siempre mismo tamaño (24px estándar, 16px small, 32px large)
- **Avatares**: Siempre circulares con `border-radius: var(--radius-full)`
- **Badges**: Siempre `--radius-full` con padding `--spacing-1 --spacing-2`
- **Separadores**: Siempre `1px solid var(--border-color)`

> **Captura de pantalla:** ![Botones relacionados](../screenshots/botones-coherentes.png)
![Cards](../screenshots/alineaciones-posicionamientos.png)

---

## 1.2 Metodología CSS

"La Referente" utiliza **BEM** como metodología de nomenclatura CSS.

### ¿Por qué BEM?

- **Claridad**: Los nombres de clase son autodescriptivos
- **Modularidad**: Cada bloque es independiente y reutilizable
- **Evita conflictos**: Especificidad baja y controlada
- **Compatible con Angular**: Se integra con ViewEncapsulation
- **Aprendizaje previo**: Ya trabajado anteriormente con el profesor

### Estructura BEM

**1. Bloque**: Componente independiente
```scss
.card { }
.header { }
.player-card { }
```

**2. Elemento**: Parte de un bloque (doble guión bajo `__`)
```scss
.card__title { }
.card__image { }
.player-card__name { }
.player-card__photo { }
```

**3. Modificador**: Variante de un bloque (doble guión `--`)
```scss
.card--featured { }
.card--compact { }
.button--primary { }
.button--disabled { }
```

### Ejemplo de uso

```html
<!-- Card normal -->
<article class="player-card">
  <img class="player-card__photo" src="..." />
  <h3 class="player-card__name">Ángel Fernández Carmona</h3>
  <span class="player-card__position">Centrocampista</span>
</article>

<!-- Card destacada -->
<article class="player-card player-card--featured">
  <img class="player-card__photo" src="..." />
  <h3 class="player-card__name">Ángel Fernández Carmona</h3>
  <span class="player-card__position">Centrocampista</span>
</article>
```

```scss
.player-card {
  background: var(--bg-color);
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
}

.player-card__photo {
  width: 100%;
  border-radius: var(--radius-md);
}

.player-card__name {
  font-size: var(--font-l);
  font-weight: var(--font-semibold);
}

.player-card--featured {
  border: 2px solid var(--primary);
  box-shadow: var(--shadow-lg);
}
```

---

## 1.3 Organización de archivos

"La Referente" utiliza **ITCSS**, una metodología que organiza los estilos de **menor a mayor especificidad**.

### ¿Por qué ITCSS?

- **Evita conflictos de especificidad**: Los estilos se aplican en orden natural
- **Escalable**: Fácil añadir nuevos estilos sin romper los existentes
- **Predecible**: Sabes exactamente dónde buscar cada tipo de estilo
- **Compatible con preprocesadores**: Funciona perfectamente con SCSS

### Estructura de carpetas (ITCSS)

```
frontend/src/styles/
├── 00-settings/         # Variables y configuración
│   └── _variables.scss
├── 01-tools/            # Mixins y funciones
│   └── _mixins.scss
├── 02-generic/          # Reset y normalize
│   └── _reset.scss
├── 03-elements/         # Estilos base de HTML (sin clases)
│   └── _base.scss
├── 04-layout/           # Estructura de página (grid, contenedores)
│   └── _layout.scss
└── styles.scss          # Archivo principal que importa todo
```

### Explicación por capas (de menor a mayor especificidad)

**00-settings** - Variables globales
- Variables CSS (custom properties)
- Colores, tipografía, espaciado
- Breakpoints SCSS
- **No genera CSS**, solo define valores

**01-tools** - Herramientas
- Mixins de SCSS
- Funciones reutilizables
- **No genera CSS**, solo herramientas

**02-generic** - Estilos genéricos
- Reset CSS
- Normalize
- Box-sizing universal
- **Baja especificidad**, afecta a todo

**03-elements** - Elementos HTML base
- Estilos para `h1`, `p`, `a`, `button` (sin clases)
- Tipografía base del body
- **Especificidad baja**, selectores de etiqueta

**04-layout** - Estructura de página
- Grid system
- Contenedores (.container)
- Secciones principales
- **Especificidad media**, layout general

### Archivo principal (styles.scss)

```scss
// 00-settings: Variables
@import './styles/00-settings/variables';

// 01-tools: Mixins y funciones
@import './styles/01-tools/mixins';

// 02-generic: Reset
@import './styles/02-generic/reset';

// 03-elements: Elementos HTML
@import './styles/03-elements/base';

// 04-layout: Grid y estructura
@import './styles/04-layout/layout';

```

### Reglas de uso

1. **Nunca saltar capas**: No poner variables en otro sitio
2. **Orden de imports**: Siempre de 00 a 04
4. **Utilities última**: Para sobreescribir cuando sea necesario

> **Captura de pantalla:** ![Estructura](../screenshots/estructura-itcss.png)


---

## 1.4 Sistema de Design Tokens

Los **Design Tokens** son las variables de diseño que definen los valores visuales del proyecto. En "La Referente" usamos **CSS Custom Properties**.

### ¿Por qué Design Tokens?

- **Consistencia**: Un único lugar para todos los valores de diseño
- **Mantenibilidad**: Cambiar un color afecta a todo el proyecto
- **Theming**: Fácil implementación de temas (claro/oscuro)
- **Escalabilidad**: Añadir nuevos valores sin duplicar código

### Categorías de tokens

**1. Colores**
```scss
  --primary: #388e3c;
  --primary-hover: #328036;
  --primary-active: #2d7230;

  --secondary: #039be5;
  --secondary-hover: #038cce;
  --secondary-active: #027cb7;

  --bg-color: #ffffff;
  --text-color: var(--gray900);
  --border-color: var(--gray200);
  --bg-hover: var(--gray50);

  --primary: #2a6b2d;
  --primary-hover: #225524;
  --primary-active: #19401b;

  --secondary: #0274ac;
  --secondary-hover: #025d89;
  --secondary-active: #014667;

  --bg-color: var(--gray900);
  --text-color: #ffffff;
  --border-color: var(--gray700);
  --bg-hover: var(--gray800);

  --gray50: #f5f5f5;
  --gray100: #e8e8e8;
  --gray200: #cfcfcf;
  --gray300: #b6b6b6;
  --gray400: #9e9e9e;
  --gray500: #858585;
  --gray600: #6b6b6b;
  --gray700: #525252;
  --gray800: #3b3b3b;
  --gray900: #222222;

  --state-success: #2ecc71;
  --state-success-bg: #eafaf1;
  --state-success-text: #1d8348;

  --state-error: #e74c3c;
  --state-error-bg: #fdf2f0;
  --state-error-text: #922b21;

  --state-warning: #f39c12;
  --state-warning-bg: #fef5e7;
  --state-warning-text: #9c640c;

  --state-info: #34495e;
  --state-info-bg: #ebedef;
  --state-info-text: #212f3c;
```

Elegí principalmente el color verde como principal ya que es un color muy representativo en el fútbol por el color del terreno de juego, y el azul, podría decir que lo elegí por el contraste que hace el cielo con el césped durante los partidos, pero simplemente me parecía buena combinación para los detalles.

**2. Tipografía**
```scss
// Tamaños
  --font-primary: 'Inter', sans-serif;
  --font-secondary: 'ABeeZee', sans-serif;

  --font-xs: 0.75rem;
  --font-s: 0.875rem;
  --font-m: 1rem;
  --font-l: 1.25rem;
  --font-xl: 1.5rem;
  --font-2xl: 1.875rem;
  --font-3xl: 2.25rem;
  --font-4xl: 3rem;
  --font-5xl: 3.75rem;

  --font-light: light;
  --font-regular: normal;
  --font-medium: medium;
  --font-semibold: 600;
  --font-bold: bold;

  --font-tight: 1.25;
  --font-normal: 1.5;
  --font-relaxed: 1.75;
```

He elegido estas tipografías ya que son sencillas, bonitas y fácilmente legibles. Y los tamaños he utilizado una amplia gama de los más comúnes

**3. Espaciado**
```scss
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-7: 1.75rem;
  --spacing-8: 2rem;
  --spacing-9: 2.25rem;
  --spacing-10: 2.5rem;
  --spacing-11: 2.75rem;
  --spacing-12: 3rem;
  --spacing-13: 3.25rem;
  --spacing-14: 3.5rem;
  --spacing-15: 3.75rem;
  --spacing-16: 4rem;
  --spacing-17: 4.25rem;
  --spacing-18: 4.5rem;
  --spacing-19: 4.75rem;
  --spacing-20: 5rem;
  --spacing-21: 5.25rem;
  --spacing-22: 5.5rem;
  --spacing-23: 5.75rem;
  --spacing-24: 6rem;
```

He elegido estos espaciados ya que componen un gran abanico de posibilidades para cualquier cosa del proyecto.

**4. Bordes y radios**
```scss
// Grosores
  --border-thin: 1px;
  --border-medium: 2px;
  --border-thick: 4px;

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;
```

He usado estos grosores y radios principalmente por que eran los que se solicitaban y funcionan en base 8.

**5. Sombras**
```scss
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

He puesto unas sombras que creo que puedan encajar bien con mi diseño, ya que no desentonan pero se notan sutílmente

**6. Transiciones**
```scss
--duration-fast: 150ms;
--duration-base: 300ms;
--duration-slow: 500ms;
--timing-ease-in-out: ease-in-out;
```

He utilizado unas transiciones y tiempos bastante estándar para que sea lo mejor a la vista dek usuario

### Theming con tokens

```scss
// Tema claro (default)
:root,
:root.theme-light {
  --bg-color: #ffffff;
  --text-color: var(--gray900);
  --primary: #388e3c;
}

// Tema oscuro
:root.theme-dark {
  --bg-color: var(--gray900);
  --text-color: #ffffff;
  --primary: #2a6b2d;
}
```

Al cambiar la clase en `:root`, todos los componentes se actualizan automáticamente.

---

## 1.5 Mixins y funciones

Los **mixins** son funciones reutilizables de SCSS que generan bloques de código CSS. Facilitan el desarrollo y evitan repetición.

### Mixins disponibles

**1. flex-center**

Centra elementos usando Flexbox (horizontal y verticalmente).

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

---

**2. text-truncate**

Recorta texto largo con puntos suspensivos (...).

```scss
@mixin text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

**3. media-up**

Media query para responsive (min-width). Aplica estilos desde un breakpoint hacia arriba.

```scss
@mixin media-up($breakpoint) {
  @media (min-width: $breakpoint) {
    @content;
  }
}
```

### Ventajas de usar mixins

- **Reutilización**: Escribir una vez, usar muchas veces
- **Mantenibilidad**: Cambiar en un lugar, afecta a todo
- **Legibilidad**: Código más limpio y expresivo
- **Parámetros**: Mixins flexibles con valores dinámicos

---

## 1.6 ViewEncapsulation en Angular

### ¿Qué estrategia usaremos?

**Emulated**. Los estilos se encapsulan por componente usando atributos únicos generados automáticamente.

```typescript
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated 
})
```

### ¿Por qué Emulated?

- **Modularidad**: Cada componente tiene sus estilos sin colisiones
- **Compatibilidad con BEM**: Funciona bien con la metodología que usamos
- **Estilos globales disponibles**: Las variables CSS siguen siendo accesibles
- **Mantenibilidad**: Cambios en un componente no rompen otros
- **Shadow DOM simulado**: Funciona en todos los navegadores sin necesitar Shadow DOM real

### Cuándo usar None

Solo en componentes que requieren estilos verdaderamente globales. En general, se evita para mantener la encapsulación.

---