# Guía de Contribución

## Configuración del Entorno

### Requisitos

- Node.js 20+
- npm 10+
- Angular CLI 19+

### Instalación

```bash
# Clonar repositorio
git clone <url-repositorio>
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve
```

## Flujo de Trabajo

### 1. Crear Rama

```bash
# Desde develop
git checkout develop
git pull origin develop
git checkout -b feature/nombre-feature
```

### Convenciones de Nombres

- `feature/` - Nueva funcionalidad
- `fix/` - Corrección de bug
- `refactor/` - Refactorización sin cambio funcional
- `docs/` - Documentación
- `test/` - Tests

### 2. Desarrollo

- Seguir la arquitectura existente (standalone components)
- Usar Angular Signals para estado
- Seguir convenciones ITCSS + BEM para CSS
- Añadir tests para nueva funcionalidad

### 3. Commits

Usar conventional commits:

```
tipo(scope): descripción

feat(auth): add password reset functionality
fix(news): correct date formatting
docs(readme): update installation instructions
test(services): add team service tests
```

### 4. Tests

```bash
# Ejecutar tests
npm test

# Con coverage
npm test -- --code-coverage

# Watch mode
npm test -- --watch
```

**Requisitos mínimos:**
- Coverage > 50%
- Todos los tests deben pasar

### 5. Pull Request

1. Push a tu rama
2. Crear PR hacia `develop`
3. Completar template de PR
4. Esperar review

## Estructura del Proyecto

```
src/app/
├── core/           # Servicios, interceptores, modelos
├── pages/          # Componentes de página
├── components/     # Componentes reutilizables
├── shared/         # Servicios y componentes compartidos
├── guards/         # Guards de rutas
└── resolvers/      # Resolvers de datos
```

## Convenciones de Código

### TypeScript

- Usar tipos estrictos
- Evitar `any`
- Usar interfaces para DTOs
- Usar signals para estado reactivo

### CSS

- Seguir metodología BEM
- Usar CSS Custom Properties
- Evitar !important
- Responsive mobile-first

### Componentes

- Standalone components
- OnPush change detection cuando sea posible
- Inputs/Outputs con decoradores o signals

## Review Checklist

- [ ] El código sigue las convenciones
- [ ] Los tests pasan
- [ ] Coverage >= 50%
- [ ] Sin errores de TypeScript
- [ ] Sin warnings en consola
- [ ] Documentación actualizada si aplica
