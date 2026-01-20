# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.0] - 2024-01-20

### Añadido

#### FASE 1: Fundamentos
- Configuración inicial del proyecto Angular 19
- Estructura de carpetas según arquitectura standalone
- Configuración de rutas principales
- Componentes base: Header, Footer, Layout

#### FASE 2: Componentes y Servicios
- Servicios de datos: NewsService, TeamService, PlayerService, CompetitionService
- ApiService con patrón Facade
- Interceptores HTTP: auth, error, logging
- Modelos TypeScript para todas las entidades

#### FASE 3: Formularios
- Formularios reactivos para login/registro
- Validación síncrona y asíncrona
- Componente de login con doble modo (login/registro)
- Formularios de administración (CRUD)

#### FASE 4: Navegación Avanzada
- Sistema de rutas completo con lazy loading
- Guards: authGuard, editorGuard, formGuard
- Resolver para precarga de datos
- Navegación programática

#### FASE 5: Estado y Datos
- AuthService con signals
- LoadingService para estados de carga
- ToastService para notificaciones
- ThemeService para tema claro/oscuro

#### FASE 6: Componentes Avanzados
- Componente Accordion con navegación por teclado
- Componente Tabs accesible
- Componente Modal con ESC y backdrop click
- Directivas personalizadas

#### FASE 7: Testing y Optimización
- Tests unitarios de servicios (10 servicios)
- Tests de componentes (3 componentes)
- Tests de integración de flujos
- Coverage > 75%
- Documentación cross-browser
- Build de producción optimizado

### Tecnologías

- Angular 19 con standalone components
- TypeScript 5.5
- RxJS 7.8
- Karma + Jasmine para testing
- CSS con ITCSS + BEM

### Características Técnicas

- Zoneless Change Detection
- Server-Side Rendering ready
- Lazy loading de módulos
- Tree shaking en producción
- Initial bundle < 500KB
