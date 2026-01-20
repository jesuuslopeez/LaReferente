# Guia de Contribucion

Gracias por tu interes en contribuir a La Referente. Esta guia te ayudara a entender como colaborar con el proyecto.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Configuracion del Entorno](#configuracion-del-entorno)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estandares de Codigo](#estandares-de-codigo)
- [Testing](#testing)
- [Commits](#commits)
- [Pull Requests](#pull-requests)

---

## Requisitos Previos

- Node.js 20+
- Java 21
- Docker y Docker Compose
- Git

## Configuracion del Entorno

### 1. Clonar el repositorio

```bash
git clone https://github.com/jesuuslopeez/LaReferente.git
cd LaReferente
```

### 2. Iniciar con Docker (recomendado)

```bash
docker compose -f docker-compose.dev.yml up
```

### 3. O iniciar manualmente

```bash
# Frontend
cd frontend
npm install
npm start

# Backend (en otra terminal)
cd backend
./gradlew bootRun
```

---

## Flujo de Trabajo

### 1. Crear una rama

```bash
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-del-bug
```

### 2. Desarrollar y testear

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
./gradlew test
```

### 3. Commit y push

```bash
git add .
git commit -m "tipo: descripcion breve"
git push origin feature/nombre-descriptivo
```

### 4. Crear Pull Request

Abre un PR hacia la rama `develop` con una descripcion clara de los cambios.

---

## Estandares de Codigo

### Frontend (Angular/TypeScript)

#### Estructura de archivos

```
componente/
├── componente.ts       # Logica del componente
├── componente.html     # Template
├── componente.scss     # Estilos
└── componente.spec.ts  # Tests
```

#### Nomenclatura

- **Componentes**: PascalCase (`PlayerCard`, `TeamDetail`)
- **Servicios**: camelCase con sufijo Service (`teamService`, `authService`)
- **Variables/funciones**: camelCase (`nombreCompleto`, `getById`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)

#### CSS/SCSS

- Usar metodologia BEM para clases
- Usar CSS Custom Properties para colores y espaciados
- Usar `rem` en lugar de `px` (excepto media queries)
- No hardcodear colores (usar variables)

```scss
// Bien
.player-card {
  padding: var(--spacing-4);
  color: var(--text-primary);

  &__name {
    font-size: var(--font-lg);
  }
}

// Mal
.playerCard {
  padding: 16px;
  color: #333;
}
```

#### TypeScript

- Usar tipos explicitos, no `any`
- Preferir `signals` sobre `BehaviorSubject` para nuevo estado
- Usar `inject()` en lugar de constructor injection

```typescript
// Bien
private readonly teamService = inject(TeamService);
equipos = signal<Team[]>([]);

// Mal
constructor(private teamService: TeamService) {}
equipos: any;
```

### Backend (Java/Spring)

- Seguir convenciones de Spring Boot
- Usar DTOs para entrada/salida de API
- Documentar endpoints con OpenAPI

---

## Testing

### Frontend

#### Tests unitarios

```bash
cd frontend
npm test
```

#### Tests con coverage

```bash
npm test -- --code-coverage
```

#### Requisitos de coverage

- Statements: > 50%
- Functions: > 50%
- Lines: > 50%

#### Estructura de tests

```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentName],
      providers: [/* mocks */]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('feature', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Backend

```bash
cd backend
./gradlew test
```

---

## Commits

### Formato

```
tipo(scope): descripcion breve

[cuerpo opcional]

[footer opcional]
```

### Tipos permitidos

| Tipo | Descripcion |
|------|-------------|
| `feat` | Nueva funcionalidad |
| `fix` | Correccion de bug |
| `docs` | Documentacion |
| `style` | Formateo, sin cambios de codigo |
| `refactor` | Refactorizacion sin cambio de funcionalidad |
| `test` | Agregar o modificar tests |
| `chore` | Tareas de mantenimiento |

### Ejemplos

```bash
feat(auth): agregar validacion de email unico
fix(player-card): corregir imagen fallback
docs(readme): actualizar instrucciones de instalacion
test(team-service): agregar tests de busqueda
refactor(news-store): migrar de BehaviorSubject a Signals
```

---

## Pull Requests

### Checklist antes de crear PR

- [ ] El codigo compila sin errores
- [ ] Los tests pasan localmente
- [ ] Se han agregado tests para nueva funcionalidad
- [ ] Se sigue la guia de estilo
- [ ] La rama esta actualizada con `develop`

### Formato del PR

```markdown
## Descripcion

Descripcion breve de los cambios.

## Tipo de cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentacion

## Checklist

- [ ] He probado los cambios localmente
- [ ] He agregado tests que cubren los cambios
- [ ] La documentacion ha sido actualizada
```

### Proceso de revision

1. Crear PR hacia `develop`
2. Esperar revision de codigo
3. Atender comentarios si los hay
4. Merge cuando este aprobado

---

## Estructura del Proyecto

```
LaReferente/
├── frontend/                 # Aplicacion Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Componentes reutilizables
│   │   │   ├── core/         # Servicios, modelos, stores
│   │   │   ├── pages/        # Componentes de pagina
│   │   │   ├── shared/       # Utilidades compartidas
│   │   │   └── testing/      # Tests de integracion
│   │   └── styles/           # Estilos globales (ITCSS)
│   └── package.json
├── backend/                  # API Spring Boot
│   ├── src/
│   │   ├── main/java/
│   │   └── test/java/
│   └── build.gradle
├── docs/                     # Documentacion
│   ├── design/               # DIW
│   └── dwec/                 # DWEC
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

---

## Contacto

Si tienes preguntas, abre un issue o contacta al mantenedor:

- GitHub: [@jesuuslopeez](https://github.com/jesuuslopeez)
