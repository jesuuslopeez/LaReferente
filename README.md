# La Referente

Aplicacion web sobre futbol espanol que permite explorar jugadores, equipos, competiciones y noticias de las principales ligas.

## URL de Produccion

**[https://yiisus.com](https://yiisus.com)**

## Descripcion

La Referente es una plataforma web completa para seguir el futbol espanol. Permite a los usuarios explorar jugadores, equipos, competiciones y mantenerse al dia con las ultimas noticias. Incluye un panel de administracion para gestionar todo el contenido.

## Caracteristicas Principales

- **Exploracion de jugadores**: Fichas detalladas con estadisticas, posicion, equipo y biografia
- **Gestion de equipos**: Informacion completa de clubes con plantillas y logos
- **Competiciones**: Seguimiento de ligas, copas y torneos con clasificaciones
- **Noticias**: Seccion de noticias deportivas con categorias y destacados
- **Panel de administracion**: CRUD completo para gestionar jugadores, equipos, noticias y competiciones
- **Autenticacion**: Sistema de login/registro con JWT
- **Tema claro/oscuro**: Persistencia de preferencia del usuario
- **Responsive**: Adaptado a mobile, tablet y desktop

## Tecnologias

### Frontend

- Angular 19
- TypeScript 5.6
- SCSS con arquitectura ITCSS + BEM
- RxJS para programacion reactiva
- Signals para gestion de estado

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
├── frontend/          # Aplicacion Angular
├── backend/           # API REST Spring Boot
├── docs/              # Documentacion tecnica
│   ├── design/        # Documentacion DIW
│   ├── dwec/          # Documentacion DWEC
│   └── screenshots/   # Capturas de pantalla
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

## Requisitos previos

- Node.js 20+
- Java 21
- Docker y Docker Compose (opcional)
- PostgreSQL 16+ (si no usas Docker)

## Instalacion local

### Con Docker (recomendado)

```bash
# Clonar el repositorio
git clone https://github.com/jesuuslopeez/LaReferente.git
cd LaReferente

# Iniciar en modo desarrollo
docker compose -f docker-compose.dev.yml up
```

La aplicacion estara disponible en:
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

| Comando | Descripcion |
|---------|-------------|
| `npm start` | Inicia servidor de desarrollo |
| `npm run build` | Compila para produccion |
| `npm test` | Ejecuta tests unitarios |
| `npm run watch` | Compila en modo watch |

### Backend

| Comando | Descripcion |
|---------|-------------|
| `./gradlew bootRun` | Inicia servidor de desarrollo |
| `./gradlew build` | Compila el proyecto |
| `./gradlew test` | Ejecuta tests |

## Documentacion

### DIW (Diseno de Interfaces Web)

| Documento | Descripcion |
|-----------|-------------|
| [Documentacion CSS](docs/design/DOCUMENTACION.md) | Arquitectura ITCSS, metodologia BEM, design tokens, mixins, sistema de componentes UI, Style Guide, responsive design, optimizacion multimedia, sistema de temas y despliegue |

### DWEC (Desarrollo Web en Entorno Cliente)

| Documento | Descripcion |
|-----------|-------------|
| [Componentes Interactivos](docs/dwec/componentes-interactivos.md) | Theme switcher, menu mobile, modales, tabs, tooltips y dropdowns con eventos |
| [Arquitectura de Servicios](docs/dwec/arquitectura-servicios.md) | Comunicacion entre componentes, sistema de notificaciones, loading states y separacion logica-presentacion |
| [Formularios y Validadores](docs/dwec/formularios-validadores.md) | Formularios reactivos, validadores sincronos y asincronos, FormArray y feedback visual |
| [Sistema de Rutas](docs/dwec/sistema-rutas.md) | Rutas con parametros, rutas hijas, lazy loading, guards y resolvers |
| [Servicios HTTP](docs/dwec/servicios-http.md) | ApiService CRUD, interceptores, modelos tipados y patron RequestState |
| [Gestion de Estado](docs/dwec/gestion-estado.md) | Stores con Signals, paginacion, busqueda con debounce y optimizaciones |

## Paginas implementadas

| Pagina | Ruta | Descripcion |
|--------|------|-------------|
| Home | `/` | Pagina principal con noticias destacadas y resumen |
| Noticias | `/noticias` | Listado de noticias con filtros |
| Detalle noticia | `/noticias/:id` | Noticia completa |
| Jugadores | `/jugadores` | Grid de jugadores con busqueda |
| Detalle jugador | `/jugadores/:id` | Ficha completa del jugador |
| Equipos | `/equipos` | Grid de equipos |
| Detalle equipo | `/equipos/:id` | Informacion del equipo y plantilla |
| Competiciones | `/competiciones` | Listado de competiciones |
| Detalle competicion | `/competiciones/:id` | Clasificacion y partidos |
| Calendario | `/calendario` | Proximos partidos |
| Login | `/login` | Autenticacion de usuarios |
| Admin | `/admin/*` | Panel de administracion (protegido) |
| Style Guide | `/style-guide` | Guia de estilos del proyecto |

## Autor

Jesus Lopez - [@jesuuslopeez](https://github.com/jesuuslopeez)

## Licencia

Este proyecto es parte de un trabajo academico para los modulos DIW y DWEC del ciclo DAW.
