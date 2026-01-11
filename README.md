# La Referente

Aplicacion web sobre futbol espanol que permite explorar jugadores, competiciones y estadisticas de las principales ligas.

## Tecnologias

### Frontend

- Angular 20
- TypeScript 5.9
- SCSS con arquitectura ITCSS + BEM
- RxJS para programacion reactiva
- Angular SSR (Server-Side Rendering)

### Backend

- Java 21
- Spring Boot 4
- Spring Security con JWT
- Spring Data JPA
- PostgreSQL
- Swagger/OpenAPI

### Infraestructura

- Docker y Docker Compose
- Nginx como reverse proxy

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

## Instalacion

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
./gradlew bootRun
```

### Docker (desarrollo)

```bash
docker-compose -f docker-compose.dev.yml up
```

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

Documentacion sobre arquitectura CSS, componentes visuales y principios de diseno.

| Documento | Descripcion |
|-----------|-------------|
| [Documentacion CSS](docs/design/DOCUMENTACION.md) | Arquitectura ITCSS, metodologia BEM, design tokens, mixins, sistema de componentes UI y Style Guide |

### DWEC (Desarrollo Web en Entorno Cliente)

Documentacion sobre la implementacion Angular, servicios y formularios.

| Documento | Descripcion |
|-----------|-------------|
| [Componentes Interactivos](docs/dwec/componentes-interactivos.md) | Theme switcher, menu mobile, modales, tabs, tooltips y dropdowns con eventos |
| [Arquitectura de Servicios](docs/dwec/arquitectura-servicios.md) | Comunicacion entre componentes, sistema de notificaciones, loading states y separacion logica-presentacion |
| [Formularios y Validadores](docs/dwec/formularios-validadores.md) | Formularios reactivos, validadores sincronos y asincronos, FormArray y feedback visual |
| [Sistema de Rutas](docs/dwec/sistema-rutas.md) | Rutas con parametros, rutas hijas, lazy loading, guards y resolvers |
| [Servicios HTTP](docs/dwec/servicios-http.md) | ApiService CRUD, interceptores, modelos tipados y patron RequestState |
| [Gestion de Estado](docs/dwec/gestion-estado.md) | Stores con Signals, paginacion, busqueda con debounce y optimizaciones |

## Caracteristicas principales

### Frontend

- Sistema de temas claro/oscuro con persistencia
- Formularios reactivos con validacion completa
- Componentes reutilizables siguiendo Atomic Design
- Sistema de notificaciones toast
- Estados de carga globales
- Responsive design

### Backend

- Autenticacion JWT
- API RESTful documentada con Swagger
- Endpoints monitorizados con Actuator
