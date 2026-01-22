# Testing y verificación cross-browser

Este documento describe la estrategia de testing implementada y la verificación de compatibilidad entre navegadores.

---

## 1. Testing Unitario

### 1.1 Servicios Testeados

Se han creado tests unitarios para los siguientes servicios:

| Servicio | Archivo | Tests |
|----------|---------|-------|
| TeamService | `team.service.spec.ts` | CRUD completo, busqueda |
| PlayerService | `player.service.spec.ts` | CRUD completo, getByTeam |
| NewsService | `news.service.spec.ts` | CRUD, getPublished, getFeatured, incrementViews |
| AuthService | `auth.service.spec.ts` | Login, registro, logout, roles |
| CompetitionService | `competition.service.spec.ts` | CRUD completo |
| ToastService | `toast.spec.ts` | Todos los tipos de toast, duraciones |
| LoadingService | `loading.spec.ts` | Show/hide, concurrent requests |
| ThemeService | `theme.service.spec.ts` | Toggle, persistencia, system preference |
| ApiService | `api.service.spec.ts` | GET, POST, PUT, DELETE, error handling |
| ValidationService | `validation.spec.ts` | Email unique, username available |
| NewsStore | `news.store.spec.ts` | Estado, computed, CRUD local |

### 1.2 Componentes Testeados

| Componente | Archivo | Tests |
|------------|---------|-------|
| App | `app.spec.ts` | Creacion, layout components |
| PlayerCard | `player-card.spec.ts` | Display, posicion, flags |
| TeamCard | `team-card.spec.ts` | Display, logo, fundacion |
| CompetitionCard | `competition-card.spec.ts` | Display, tipo, fechas |
| Toast | `toast.spec.ts` | Display, auto-dismiss |
| Loading | `loading.spec.ts` | isLoading, message |
| Login | `login.spec.ts` | Login, registro, errores |
| Teams | `teams.spec.ts` | Filtros, busqueda, paginacion |
| Players | `players.spec.ts` | Filtros, busqueda, paginacion |
| Competitions | `competitions.spec.ts` | Filtros, busqueda, paginacion |

### 1.3 Guards Testeados

| Guard | Archivo | Tests |
|-------|---------|-------|
| authGuard | `auth.guard.spec.ts` | Proteccion de rutas, redirect |
| editorGuard | `editor.guard.spec.ts` | Roles ADMIN/EDITOR |

---

## 2. Testing de Integracion

Se han creado tests de integración para los flujos principales:

### 2.1 Flujo de Autenticacion (`auth-flow.spec.ts`)

- Login con credenciales validas
- Redireccion a login desde rutas protegidas
- Preservacion de returnUrl
- Logout y limpieza de sesion
- Persistencia de sesion en localStorage
- Verificación de roles (USER, EDITOR, ADMIN)

### 2.2 Flujo CRUD de Noticias (`news-crud-flow.spec.ts`)

- Crear noticia y actualizar store
- Actualizar noticia existente
- Eliminar noticia
- Recarga de datos desde servidor
- Operaciones optimistas (agregarLocal, actualizarLocal, eliminarLocal)
- Actualizacion de propiedades computed (total, destacadas, porCategoria)

### 2.3 Flujo de Busqueda y Filtrado (`search-filter-flow.spec.ts`)

- Busqueda con debounce de 300ms
- Filtros por categoria
- Combinacion de filtros
- Paginacion con filtros
- Reset de pagina al cambiar filtros
- Busqueda case-insensitive
- Busqueda en multiples campos

### 2.4 Flujo de Notificaciones (`toast-notification-flow.spec.ts`)

- Mostrar toasts de todos los tipos
- Auto-dismiss despues de duracion
- Dismiss manual
- Reemplazo de toasts
- Duraciones por tipo

---

## 3. Ejecutar Tests

### Todos los tests con coverage

```bash
cd frontend
npm test -- --code-coverage
```

### Tests en modo watch

```bash
npm test
```

### Tests con navegador headless (CI)

```bash
npm test -- --browsers=ChromeHeadless --watch=false
```

---

## 4. Verificación Cross-Browser

### 4.1 Navegadores Objetivo

La aplicaciónesta optimizada para los siguientes navegadores:

| Navegador | Version Minima | Estado |
|-----------|---------------|--------|
| Chrome | 90+ | Verificado |
| Firefox | 90+ | Verificado |
| Safari | 14+ | Compatible |
| Edge | 90+ | Verificado |

### 4.2 Configuracion de Compilacion

Angular esta configurado para compilar para navegadores modernos en `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022"
  }
}
```

### 4.3 Caracteristicas Verificadas

| Caracteristica | Chrome | Firefox | Safari | Edge |
|----------------|--------|---------|--------|------|
| CSS Grid | OK | OK | OK | OK |
| CSS Custom Properties | OK | OK | OK | OK |
| Flexbox | OK | OK | OK | OK |
| ES2022+ (signals) | OK | OK | OK | OK |
| LocalStorage | OK | OK | OK | OK |
| Fetch API | OK | OK | OK | OK |
| CSS backdrop-filter | OK | OK | OK | OK |
| IntersectionObserver | OK | OK | OK | OK |

### 4.4 Incompatibilidades Conocidas

**Ninguna incompatibilidad critica detectada.**

Notas:
- `backdrop-filter` requiere `-webkit-` prefix en Safari (aplicado en CSS)
- Signals de Angular 18+ requieren navegadores modernos (ES2022)

### 4.5 Polyfills

No se requieren polyfills adicionales. La aplicaciónusa APIs nativas soportadas por todos los navegadores objetivo.

La configuracion de Angular excluye polyfills de Zone.js gracias a `provideZonelessChangeDetection()`.

---

## 5. Metricas de Coverage

### Objetivo

- Statements: > 50%
- Branches: > 40%
- Functions: > 50%
- Lines: > 50%

### Configuracion en `karma.conf.js`

```javascript
coverageReporter: {
  check: {
    global: {
      statements: 50,
      branches: 40,
      functions: 50,
      lines: 50
    }
  }
}
```

### Ver Reporte de Coverage

Despues de ejecutar los tests, el reporte HTML se genera en:

```
frontend/coverage/frontend/index.html
```

---

## 6. Estructura de Tests

```
frontend/src/app/
├── app.spec.ts
├── core/
│   ├── services/
│   │   ├── api.service.spec.ts
│   │   ├── news.service.spec.ts
│   │   ├── player.service.spec.ts
│   │   └── team.service.spec.ts
│   └── stores/
│       └── news.store.spec.ts
├── services/
│   ├── auth.service.spec.ts
│   ├── competition.service.spec.ts
│   └── theme.service.spec.ts
├── shared/
│   ├── services/
│   │   ├── loading.spec.ts
│   │   ├── toast.spec.ts
│   │   └── validation.spec.ts
│   └── components/
│       ├── loading/loading.spec.ts
│       └── toast/toast.spec.ts
├── components/shared/
│   ├── player-card/player-card.spec.ts
│   ├── team-card/team-card.spec.ts
│   └── competition-card/competition-card.spec.ts
├── pages/
│   ├── login/login.spec.ts
│   ├── teams/teams.spec.ts
│   ├── players/players.spec.ts
│   └── competitions/competitions.spec.ts
├── guards/
│   ├── auth.guard.spec.ts
│   └── editor.guard.spec.ts
└── testing/integration/
    ├── auth-flow.spec.ts
    ├── news-crud-flow.spec.ts
    ├── search-filter-flow.spec.ts
    └── toast-notification-flow.spec.ts
```

---

## 7. Buenas Practicas Seguidas

1. **Aislamiento**: Cada test es independiente, usando `beforeEach` para setup
2. **Mocking**: HttpTestingController para simular respuestas HTTP
3. **Cleanup**: `afterEach` con `httpMock.verify()` y `localStorage.clear()`
4. **Async Testing**: `fakeAsync` y `tick` para tests con timers/observables
5. **Descriptive Names**: Nombres claros que describen el comportamiento esperado
6. **Arrange-Act-Assert**: Estructura consistente en cada test
7. **Test Host Components**: Para testear componentes con inputs
