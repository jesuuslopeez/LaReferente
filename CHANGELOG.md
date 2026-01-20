# Changelog

Todos los cambios notables en este proyecto seran documentados en este archivo.

El formato esta basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto sigue [Versionado Semantico](https://semver.org/lang/es/).

## [1.0.0] - 2025-01-20

### Agregado

#### Frontend
- **Componentes de UI**: Cards para jugadores, equipos, competiciones y noticias
- **Sistema de autenticacion**: Login, registro, guards de rutas
- **Panel de administracion**: CRUD completo para todas las entidades
- **Gestion de estado**: Store con Signals para noticias
- **Sistema de notificaciones**: Toast service con tipos success/error/info/warning
- **Tema claro/oscuro**: ThemeService con persistencia en localStorage
- **Busqueda y filtrado**: Con debounce de 300ms y filtros combinados
- **Paginacion**: En listados de equipos, jugadores y competiciones
- **Responsive design**: Adaptado a mobile, tablet y desktop
- **Testing**: Tests unitarios y de integracion (coverage > 50%)

#### Backend
- **API REST**: Endpoints CRUD para todas las entidades
- **Autenticacion JWT**: Login, registro, roles (USER, EDITOR, ADMIN)
- **Base de datos**: PostgreSQL con Spring Data JPA
- **Documentacion API**: Swagger/OpenAPI

#### Infraestructura
- **Docker**: Contenedores para desarrollo y produccion
- **Docker Compose**: Orquestacion de servicios
- **Nginx**: Reverse proxy para produccion

### Arquitectura

#### CSS
- Arquitectura ITCSS con metodologia BEM
- CSS Custom Properties para temas
- Unidades relativas (rem) en lugar de px

#### Angular
- Angular 20 con Signals
- Zoneless Change Detection
- Lazy loading de modulos
- Interceptores HTTP (auth, error, logging)

## [0.5.0] - 2025-01-15

### Agregado

- Sistema de rutas con parametros y guards
- Formularios reactivos con validacion
- Servicios HTTP con manejo de errores
- Componentes interactivos (tabs, accordion, tooltip)

## [0.4.0] - 2025-01-10

### Agregado

- Integracion con API backend
- CRUD de noticias funcional
- Sistema de autenticacion basico
- Interceptores HTTP

## [0.3.0] - 2025-01-05

### Agregado

- Paginas de detalle (jugador, equipo, competicion, noticia)
- Componentes compartidos (cards, loading, toast)
- Servicios de dominio

## [0.2.0] - 2024-12-20

### Agregado

- Estructura de paginas principales
- Sistema de navegacion
- Layout base (header, main, footer)
- Estilos globales con ITCSS

## [0.1.0] - 2024-12-15

### Agregado

- Inicializacion del proyecto Angular
- Configuracion de desarrollo con Docker
- Estructura base del backend Spring Boot
- Configuracion de base de datos PostgreSQL
