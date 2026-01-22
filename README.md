# La Referente

Aplicación web sobre fútbol español que permite explorar jugadores, equipos, competiciones y noticias de las principales ligas.

## URL de producción

**[https://lareferente.yiisus.com](https://lareferente.yiisus.com)**

## Descripción

La Referente es una plataforma web completa para seguir el fútbol español. Permite a los usuarios explorar jugadores, equipos, competiciones y mantenerse al día con las últimas noticias. Incluye un panel de administración para gestionar todo el contenido.

## Características principales

- **Exploración de jugadores**: Fichas detalladas con estadísticas, posición, equipo y biografía
- **Gestión de equipos**: Información completa de clubes con plantillas y logos
- **Competiciones**: Seguimiento de ligas, copas y torneos con clasificaciones
- **Noticias**: Sección de noticias deportivas con categorías y destacados
- **Panel de administración**: CRUD completo para gestionar jugadores, equipos, noticias y competiciones
- **Autenticación**: Sistema de login/registro con JWT
- **Tema claro/oscuro**: Persistencia de preferencia del usuario
- **Responsive**: Adaptado a mobile, tablet y desktop

## Tecnologías

### Frontend

- Angular 19
- TypeScript 5.6
- SCSS con arquitectura ITCSS + BEM
- RxJS para programación reactiva
- Signals para gestión de estado

### Backend

- Java 21
- Spring Boot 3.4
- Spring Security con JWT
- Spring Data JPA
- PostgreSQL 16
- Swagger/OpenAPI

### Infraestructura

- Docker y Docker Compose
- Nginx como reverse proxy
- VPS Ubuntu con despliegue automatizado

## Estructura del proyecto

```
LaReferente/
├── frontend/          # Aplicación Angular
├── backend/           # API REST Spring Boot
├── docs/              # Documentación técnica
│   ├── design/        # Documentación DIW
│   ├── dwec/          # Documentación DWEC
│   └── screenshots/   # Capturas de pantalla
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

## Requisitos previos

- Node.js 20+
- Java 21
- Docker y Docker Compose (opcional)
- PostgreSQL 16+ (si no usas Docker)

## Instalación local

### Con Docker (recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/jesuuslopeez/LaReferente.git
cd LaReferente

# Iniciar en modo desarrollo
docker compose -f docker-compose.dev.yml up
```

La aplicación estará disponible en:
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

### Sin Docker

#### Frontend

```bash
cd frontend
npm install
npm start
```

#### Backend

```bash
cd backend
./gradlew bootRun
```

Nota: Necesitas tener PostgreSQL corriendo en localhost:5432 con una base de datos llamada `lareferente`.

## Scripts disponibles

### Frontend

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm test` | Ejecuta tests unitarios |
| `npm test -- --code-coverage` | Tests con reporte de coverage |
| `npm run watch` | Compila en modo watch |

### Backend

| Comando | Descripción |
|---------|-------------|
| `./gradlew bootRun` | Inicia servidor de desarrollo |
| `./gradlew build` | Compila el proyecto |
| `./gradlew test` | Ejecuta tests |

## Testing

### Cobertura de tests

El proyecto incluye tests unitarios y de integración con un objetivo de coverage > 50%.

```bash
# Ejecutar tests con coverage
cd frontend
npm test -- --code-coverage
```

El reporte de coverage se genera en `frontend/coverage/frontend/index.html`.

### Tipos de tests

| Tipo | Descripción | Ubicación |
|------|-------------|-----------|
| Unitarios - servicios | Tests de servicios HTTP y estado | `*.service.spec.ts`, `*.store.spec.ts` |
| Unitarios - componentes | Tests de componentes UI | `*.spec.ts` en carpeta del componente |
| Unitarios - guards | Tests de guards de rutas | `guards/*.spec.ts` |
| Integración | Flujos completos (auth, CRUD, búsqueda) | `testing/integration/*.spec.ts` |

### Tests implementados

- **11 servicios** testeados (TeamService, PlayerService, NewsService, AuthService, etc.)
- **10+ componentes** testeados (Cards, Toast, Loading, Login, Pages)
- **2 guards** testeados (authGuard, editorGuard)
- **4 flujos de integración** (auth, CRUD noticias, búsqueda/filtrado, notificaciones)

## Documentación

### DIW (Diseño de interfaces web)

| Documento | Descripción |
|-----------|-------------|
| [Documentación CSS](docs/design/DOCUMENTACION.md) | Arquitectura ITCSS, metodología BEM, design tokens, mixins, sistema de componentes UI, Style Guide, responsive design, optimización multimedia, sistema de temas y despliegue |

### DWEC (Desarrollo web en entorno cliente)

| Documento | Descripción |
|-----------|-------------|
| [Componentes interactivos](docs/dwec/componentes-interactivos.md) | Theme switcher, menú mobile, modales, tabs, tooltips y dropdowns con eventos |
| [Arquitectura de servicios](docs/dwec/arquitectura-servicios.md) | Comunicación entre componentes, sistema de notificaciones, loading states y separación lógica-presentación |
| [Formularios y validadores](docs/dwec/formularios-validadores.md) | Formularios reactivos, validadores síncronos y asíncronos, FormArray y feedback visual |
| [Sistema de rutas](docs/dwec/sistema-rutas.md) | Rutas con parámetros, rutas hijas, lazy loading, guards y resolvers |
| [Servicios HTTP](docs/dwec/servicios-http.md) | ApiService CRUD, interceptores, modelos tipados y patrón RequestState |
| [Gestión de estado](docs/dwec/gestion-estado.md) | Stores con Signals, paginación, búsqueda con debounce y optimizaciones |
| [Testing y cross-browser](docs/dwec/testing-cross-browser.md) | Tests unitarios, integración, coverage y verificación cross-browser |

## Páginas implementadas

| Página | Ruta | Descripción |
|--------|------|-------------|
| Home | `/` | Página principal con noticias destacadas y resumen |
| Noticias | `/noticias` | Listado de noticias con filtros |
| Detalle noticia | `/noticias/:id` | Noticia completa |
| Jugadores | `/jugadores` | Grid de jugadores con búsqueda |
| Detalle jugador | `/jugadores/:id` | Ficha completa del jugador |
| Equipos | `/equipos` | Grid de equipos |
| Detalle equipo | `/equipos/:id` | Información del equipo y plantilla |
| Competiciones | `/competiciones` | Listado de competiciones |
| Detalle competición | `/competiciones/:id` | Clasificación y partidos |
| Calendario | `/calendario` | Próximos partidos |
| Login | `/login` | Autenticación de usuarios |
| Admin | `/admin/*` | Panel de administración (protegido) |
| Style Guide | `/style-guide` | Guía de estilos del proyecto |

## Autor

Jesús López - [@jesuuslopeez](https://github.com/jesuuslopeez)

## Licencia

Este proyecto es parte de un trabajo académico para los módulos DIW y DWEC del ciclo DAW.
