# Gestion de Estado y Actualizacion Dinamica

En este documento explico como gestiono el estado de la aplicacion, las actualizaciones sin recargar la pagina y las optimizaciones de rendimiento que he aplicado.

---

## 1. Patron de Estado Elegido

Despues de evaluar varias opciones, he decidido usar **servicios con Signals** como patron principal de estado. Es lo que mejor encaja con Angular moderno y no añade complejidad innecesaria.

### Por que Signals y no NgRx

NgRx esta bien para aplicaciones muy grandes con muchos equipos, pero para este proyecto seria matar moscas a cañonazos. Tiene acciones, reducers, efectos... demasiado boilerplate para lo que necesito.

Los Signals me dan:
- Integracion nativa con Angular (no es una libreria externa)
- Sintaxis simple, sin tanto RxJS
- Deteccion de cambios eficiente
- Menos codigo que con BehaviorSubject

### Comparativa de opciones

| Opcion | Complejidad | Por que si/no |
|--------|-------------|---------------|
| BehaviorSubject | Baja | Lo usaba antes, funciona bien pero mas RxJS |
| **Signals (elegido)** | Media | Nativo de Angular, sintaxis limpia |
| NgRx | Alta | Demasiado para este proyecto |

---

## 2. Store de Dominio

He creado un store para las noticias que mantiene el estado en memoria y lo expone con signals:

```typescript
// core/stores/news.store.ts
@Injectable({ providedIn: 'root' })
export class NewsStore {
  private readonly newsService = inject(NewsService);

  // Estado privado
  private _noticias = signal<News[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Estado publico de solo lectura
  noticias = this._noticias.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // Computed para estadisticas
  total = computed(() => this._noticias().length);
  destacadas = computed(() => this._noticias().filter(n => n.destacada));
  totalDestacadas = computed(() => this.destacadas().length);

  constructor() {
    this.cargar();
  }

  cargar(): void {
    this._loading.set(true);
    this._error.set(null);

    this.newsService.getPublished().subscribe({
      next: (lista) => {
        this._noticias.set(lista);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(err.message || 'Error al cargar noticias');
        this._loading.set(false);
      },
    });
  }

  agregar(dto: CreateNewsDto): void {
    this.newsService.create(dto).subscribe({
      next: (nueva) => {
        this._noticias.update(lista => [...lista, nueva]);
      },
      error: (err) => {
        this._error.set(err.message || 'Error al crear noticia');
      },
    });
  }

  actualizar(id: number, dto: UpdateNewsDto): void {
    this.newsService.update(id, dto).subscribe({
      next: (actualizada) => {
        this._noticias.update(lista =>
          lista.map(n => (n.id === id ? actualizada : n))
        );
      },
    });
  }

  eliminar(id: number): void {
    this.newsService.delete(id).subscribe({
      next: () => {
        this._noticias.update(lista => lista.filter(n => n.id !== id));
      },
    });
  }
}
```

Lo bueno de esto es que:
- El estado esta encapsulado (las variables privadas con `_`)
- Los componentes solo ven `asReadonly()`, no pueden modificar el estado directamente
- Los `computed` calculan estadisticas automaticamente cuando cambia la lista
- Las actualizaciones son inmutables (siempre creo arrays nuevos con spread o filter/map)

### Uso en componentes

```typescript
// En el componente
store = inject(NewsStore);

// En el template
@if (store.loading()) {
  <p>Cargando...</p>
}

@for (noticia of store.noticias(); track noticia.id) {
  <article>{{ noticia.titulo }}</article>
}

<p>Total: {{ store.total() }}</p>
```

No necesito async pipe ni subscribirme a nada. Solo llamo a la signal como funcion y listo.

---

## 3. Actualizacion Dinamica sin Recargas

### Listas que se actualizan solas

Cuando añado, edito o elimino algo, la lista se actualiza automaticamente en todos los componentes que la usan. No hace falta recargar la pagina ni hacer refresh manual.

```typescript
// Despues de crear una noticia
this.newsStore.agregar(datosNoticia);
// La lista se actualiza sola en todos los sitios
```

### Contadores derivados

Los contadores se calculan automaticamente con `computed`:

```typescript
total = computed(() => this._noticias().length);
destacadas = computed(() => this._noticias().filter(n => n.destacada));
```

Cada vez que cambia `_noticias`, los computed se recalculan solos.

### Mantener el scroll

Para que no se pierda la posicion del scroll al navegar, he configurado el router:

```typescript
// app.config.ts
provideRouter(
  routes,
  withPreloading(PreloadAllModules),
  withInMemoryScrolling({
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })
)
```

Asi cuando vas atras en el navegador, vuelves a la misma posicion donde estabas.

---

## 4. Optimizaciones de Rendimiento

### Zoneless Change Detection

En lugar de usar OnPush en cada componente, he activado la deteccion de cambios sin zona a nivel global:

```typescript
// app.config.ts
provideZonelessChangeDetection()
```

Esto es mejor que OnPush porque:
- No necesito marcarlo en cada componente
- Angular detecta cambios automaticamente cuando uso Signals
- Menos overhead porque no hay NgZone

### TrackBy en bucles

Todos los `@for` llevan `track` para que Angular no recree todo el DOM cuando cambia algo en la lista:

```html
@for (comp of competicionesPaginadas; track comp.slug) {
  <app-competition-card [name]="comp.nombre" />
}
```

Esto mejora el rendimiento porque Angular solo actualiza los elementos que cambian, no todos.

### Cleanup de suscripciones

Para evitar memory leaks, uso `takeUntilDestroyed` en las suscripciones:

```typescript
export class MiComponente {
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.miObservable$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(datos => {
        // hacer algo
      });
  }
}
```

Cuando el componente se destruye, la suscripcion se cancela automaticamente. Antes hacia esto con `ngOnDestroy` y un Subject, pero asi es mas limpio.

---

## 5. Paginacion

He implementado paginacion en la lista de competiciones:

```typescript
// Estado
paginaActual = signal(1);
itemsPorPagina = 6;

// Competiciones de la pagina actual
get competicionesPaginadas(): Competicion[] {
  const inicio = (this.paginaActual() - 1) * this.itemsPorPagina;
  const fin = inicio + this.itemsPorPagina;
  return this.competicionesFiltradas.slice(inicio, fin);
}

// Total de paginas
get totalPaginas(): number {
  return Math.ceil(this.competicionesFiltradas.length / this.itemsPorPagina);
}

irAPagina(pagina: number): void {
  if (pagina >= 1 && pagina <= this.totalPaginas) {
    this.paginaActual.set(pagina);
  }
}
```

En el template muestro los botones de pagina dinamicamente y deshabilito los que no corresponde:

```html
@if (totalPaginas > 1) {
  <nav class="competitions__pagination">
    <button
      [disabled]="paginaActual() === 1"
      (click)="paginaAnterior()">
      Anterior
    </button>

    @for (pagina of paginas; track pagina) {
      <button
        [class.active]="paginaActual() === pagina"
        (click)="irAPagina(pagina)">
        {{ pagina }}
      </button>
    }

    <button
      [disabled]="paginaActual() === totalPaginas"
      (click)="paginaSiguiente()">
      Siguiente
    </button>
  </nav>
}
```

---

## 6. Busqueda con Debounce

Para la busqueda he usado un FormControl con debounce para no hacer busquedas en cada tecla:

```typescript
busquedaControl = new FormControl('');
busqueda = signal('');

constructor() {
  this.busquedaControl.valueChanges
    .pipe(
      debounceTime(300),        // Espera 300ms despues de que el usuario deje de escribir
      distinctUntilChanged(),   // Solo si el valor cambio
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe((valor) => {
      this.busqueda.set(valor || '');
      this.paginaActual.set(1); // Volver a la primera pagina
    });
}
```

El filtrado lo hago local porque tengo pocos datos:

```typescript
get competicionesFiltradas(): Competicion[] {
  const texto = this.busqueda().toLowerCase().trim();
  let resultado = this.competiciones();

  if (texto) {
    resultado = resultado.filter((c) =>
      c.nombre.toLowerCase().includes(texto)
    );
  }

  return resultado;
}
```

Si tuviera miles de registros, haria la busqueda contra el backend con `switchMap`.

---

## 7. Servicios con BehaviorSubject

Aunque prefiero Signals para estado nuevo, mantengo algunos servicios con BehaviorSubject que ya tenia:

```typescript
// ToastService
private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
public toast$ = this.toastSubject.asObservable();

// LoadingService
private loadingSubject = new BehaviorSubject<boolean>(false);
public loading$ = this.loadingSubject.asObservable();
```

Funcionan bien para comunicacion entre componentes que no estan relacionados. El toast por ejemplo lo puede mostrar cualquier componente y el componente de toast se entera porque esta suscrito.

---

## Resumen

| Que | Como |
|-----|------|
| Estado de dominio | Stores con Signals |
| Comunicacion entre componentes | BehaviorSubject |
| Deteccion de cambios | Zoneless (global) |
| Optimizacion de listas | trackBy en @for |
| Cleanup de suscripciones | takeUntilDestroyed |
| Paginacion | Local con slice |
| Busqueda | debounceTime + filtrado local |
| Scroll | scrollPositionRestoration enabled |

La idea general es mantener el estado centralizado en stores, que los componentes lean de ahi y que las actualizaciones sean inmutables. Asi Angular sabe cuando algo cambio y actualiza solo lo necesario.
