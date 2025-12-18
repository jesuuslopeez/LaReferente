# Formularios Reactivos y Validadores

Este documento describe la implementacion de formularios reactivos en Angular, incluyendo validadores personalizados sincronos y asincronos, FormArray para listas dinamicas, y el sistema de feedback visual de validacion.

---

## 1. Formularios Reactivos Implementados

La aplicacion implementa tres formularios reactivos principales, cada uno con diferentes niveles de complejidad.

### 1.1 LoginForm

Formulario basico de autenticacion con validadores integrados.

**Ubicacion**: `components/shared/login-form/login-form.ts`

```typescript
export class LoginForm {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.loginForm.get('email') as FormControl;
  }

  get password() {
    return this.loginForm.get('password') as FormControl;
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.error('Por favor completa todos los campos correctamente');
      return;
    }
    this.toastService.success('Inicio de sesion exitoso');
  }
}
```

**Validadores utilizados**:

| Campo | Validadores | Descripcion |
|-------|-------------|-------------|
| email | `required`, `email` | Obligatorio, formato email valido |
| password | `required`, `minLength(6)` | Obligatorio, minimo 6 caracteres |

---

### 1.2 RegisterForm

Formulario avanzado con validadores personalizados sincronos, asincronos y validacion cross-field.

**Ubicacion**: `components/shared/register-form/register-form.ts`

```typescript
export class RegisterForm {
  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastService);

  registerForm: FormGroup;
  submitted = signal(false);

  constructor() {
    this.registerForm = this.fb.group(
      {
        email: [
          '',
          {
            validators: [Validators.required, Validators.email],
            asyncValidators: [uniqueEmail(this.validationService)],
            updateOn: 'blur',
          },
        ],
        nombre: ['', [Validators.required, Validators.minLength(2)]],
        password: ['', [Validators.required, passwordStrength()]],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      { validators: passwordMatch('password', 'confirmPassword') }
    );
  }
}
```

**Caracteristicas**:

- Validador asincrono `uniqueEmail` para verificar disponibilidad del email
- Validador personalizado `passwordStrength` para requisitos de contrasena
- Validador cross-field `passwordMatch` para confirmar contrasena
- Configuracion `updateOn: 'blur'` para optimizar validaciones asincronas

---

### 1.3 PhonesForm (FormArray)

Formulario con lista dinamica de telefonos utilizando FormArray.

**Ubicacion**: `pages/home/home.ts`

```typescript
export class Home {
  private fb = inject(FormBuilder);
  phonesForm: FormGroup;

  constructor() {
    this.phonesForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      phones: this.fb.array([this.newPhone()])
    });
  }

  get phones(): FormArray {
    return this.phonesForm.get('phones') as FormArray;
  }

  newPhone(): FormGroup {
    return this.fb.group({
      number: ['', [Validators.required, telefono()]]
    });
  }

  addPhone(): void {
    this.phones.push(this.newPhone());
  }

  removePhone(index: number): void {
    if (this.phones.length > 1) {
      this.phones.removeAt(index);
    }
  }

  onSubmitPhones(): void {
    if (this.phonesForm.invalid) {
      this.phonesForm.markAllAsTouched();
      this.toastService.error('Completa todos los campos correctamente');
      return;
    }
    this.toastService.success('Telefonos guardados exitosamente');
  }
}
```

**Template con FormArray** (`home.html`):

```html
<form [formGroup]="phonesForm" (ngSubmit)="onSubmitPhones()">
  <fieldset class="home__form-field">
    <label class="home__form-label">Nombre</label>
    <input
      formControlName="name"
      placeholder="Tu nombre"
      class="home__form-input"
      [class.home__form-input--error]="phonesForm.get('name')?.invalid && phonesForm.get('name')?.touched"
    />
    @if (phonesForm.get('name')?.invalid && phonesForm.get('name')?.touched) {
      <small class="home__form-error">Nombre requerido (minimo 2 caracteres)</small>
    }
  </fieldset>

  <fieldset formArrayName="phones" class="home__phones-list">
    <legend class="home__form-label">Telefonos</legend>
    @for (phone of phones.controls; track $index) {
      <article [formGroupName]="$index" class="home__phone-row">
        <input
          formControlName="number"
          placeholder="6XXXXXXXX o 7XXXXXXXX"
          class="home__form-input"
          [class.home__form-input--error]="phone.get('number')?.invalid && phone.get('number')?.touched"
        />
        <button
          type="button"
          (click)="removePhone($index)"
          class="home__phone-remove"
          [disabled]="phones.length === 1"
        >
          x
        </button>
        @if (phone.get('number')?.invalid && phone.get('number')?.touched) {
          <small class="home__form-error">Telefono invalido</small>
        }
      </article>
    }
    <button type="button" (click)="addPhone()" class="home__phone-add">
      + Anadir telefono
    </button>
  </fieldset>

  <button type="submit" [disabled]="phonesForm.invalid">
    Guardar telefonos
  </button>
</form>
```

---

## 2. Validadores Personalizados Sincronos

Los validadores sincronos se ejecutan inmediatamente y retornan un objeto de errores o `null`.

### 2.1 Validadores de Formatos Espanoles

**Ubicacion**: `shared/validators/spanish-formats.validator.ts`

#### NIF (Numero de Identificacion Fiscal)

```typescript
export function nif(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const nif = control.value?.toUpperCase();
    if (!nif) return null;

    const nifRegex = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKE]$/;
    if (!nifRegex.test(nif)) return { invalidNif: true };

    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const position = parseInt(nif.substring(0, 8)) % 23;
    return letters[position] === nif[8] ? null : { invalidNif: true };
  };
}
```

**Algoritmo de validacion**:

1. Verifica formato: 8 digitos + 1 letra
2. Calcula posicion: numero % 23
3. Comprueba que la letra corresponda a la posicion en la tabla

#### Telefono

```typescript
export function telefono(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return /^(6|7)[0-9]{8}$/.test(control.value) ? null : { invalidTelefono: true };
  };
}
```

**Reglas**: Debe comenzar por 6 o 7, seguido de 8 digitos (formato espanol).

#### Codigo Postal

```typescript
export function codigoPostal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    return /^\d{5}$/.test(control.value) ? null : { invalidCP: true };
  };
}
```

**Reglas**: Exactamente 5 digitos.

---

### 2.2 Validador de Fortaleza de Contrasena

**Ubicacion**: `shared/validators/password-strength.validator.ts`

```typescript
export function passwordStrength(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const minLength = value.length >= 12;

    const errors: ValidationErrors = {};
    if (!hasUpper) errors['noUppercase'] = true;
    if (!hasLower) errors['noLowercase'] = true;
    if (!hasNumber) errors['noNumber'] = true;
    if (!hasSpecial) errors['noSpecial'] = true;
    if (!minLength) errors['minLength'] = true;

    return Object.keys(errors).length ? errors : null;
  };
}
```

**Requisitos evaluados**:

| Error | Requisito |
|-------|-----------|
| `noUppercase` | Al menos una mayuscula |
| `noLowercase` | Al menos una minuscula |
| `noNumber` | Al menos un numero |
| `noSpecial` | Al menos un caracter especial |
| `minLength` | Minimo 12 caracteres |

**Feedback en el formulario** (`register-form.ts`):

```typescript
getPasswordErrors(): string[] {
  const errors = this.password?.errors;
  if (!errors) return [];

  const messages: string[] = [];
  if (errors['noUppercase']) messages.push('Debe contener al menos una mayuscula');
  if (errors['noLowercase']) messages.push('Debe contener al menos una minuscula');
  if (errors['noNumber']) messages.push('Debe contener al menos un numero');
  if (errors['noSpecial']) messages.push('Debe contener al menos un caracter especial');
  if (errors['minLength']) messages.push('Debe tener al menos 12 caracteres');

  return messages;
}
```

---

### 2.3 Validadores Cross-Field

**Ubicacion**: `shared/validators/cross-field.validators.ts`

#### Password Match

```typescript
export function passwordMatch(controlName: string, matchControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const matchControl = group.get(matchControlName);

    if (!control || !matchControl) return null;
    if (matchControl.errors && !matchControl.errors['mismatch']) return null;

    return control.value === matchControl.value ? null : { mismatch: true };
  };
}
```

**Uso**: Se aplica a nivel de grupo, no de control individual.

```typescript
this.fb.group(
  { password: [...], confirmPassword: [...] },
  { validators: passwordMatch('password', 'confirmPassword') }
);
```

#### Total Minimo

```typescript
export function totalMinimo(min: number): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const price = group.get('price')?.value || 0;
    const quantity = group.get('quantity')?.value || 0;
    const total = price * quantity;

    return total >= min ? null : { totalMinimo: { min, actual: total } };
  };
}
```

#### Al Menos Uno Requerido

```typescript
export function atLeastOneRequired(...fields: string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const hasOne = fields.some(field => {
      const value = group.get(field)?.value;
      return value && value.toString().trim().length > 0;
    });
    return hasOne ? null : { atLeastOneRequired: { fields } };
  };
}
```

---

### 2.4 Validadores de Rango

**Ubicacion**: `shared/validators/busqueda.validators.ts`

#### Rango de Edad

```typescript
export function rangoEdad(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const edadMin = group.get('edadMin')?.value;
    const edadMax = group.get('edadMax')?.value;

    if (!edadMin || !edadMax) return null;

    return edadMin <= edadMax ? null : { rangoInvalido: true };
  };
}
```

#### Rango de Dorsal

```typescript
export function rangoDorsal(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const dorsalMin = group.get('dorsalMin')?.value;
    const dorsalMax = group.get('dorsalMax')?.value;

    if (dorsalMin === null || dorsalMax === null) return null;

    return dorsalMin <= dorsalMax ? null : { dorsalRangoInvalido: true };
  };
}
```

---

## 3. Validadores Asincronos

Los validadores asincronos realizan operaciones que requieren tiempo (llamadas a servidor) y retornan un Observable.

**Ubicacion**: `shared/validators/async.validators.ts`

### 3.1 Email Unico

```typescript
export function uniqueEmail(validationService: ValidationService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return timer(0).pipe(map(() => null));

    return timer(500).pipe(
      switchMap(() => validationService.checkEmailUnique(control.value)),
      map(isUnique => (isUnique ? null : { emailTaken: true }))
    );
  };
}
```

**Caracteristicas**:

- Debounce de 500ms con `timer()` para evitar llamadas excesivas
- Usa `switchMap` para cancelar peticiones anteriores
- Retorna `{ emailTaken: true }` si el email esta en uso

### 3.2 Username Disponible

```typescript
export function usernameAvailable(validationService: ValidationService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const username = control.value;
    if (!username || username.length < 3) return timer(0).pipe(map(() => null));

    return timer(400).pipe(
      switchMap(() => validationService.checkUsernameAvailable(username)),
      map(isAvailable => (isAvailable ? null : { usernameTaken: true }))
    );
  };
}
```

**Optimizacion**: No valida si el username tiene menos de 3 caracteres.

---

### 3.3 Servicio de Validacion

**Ubicacion**: `shared/services/validation.ts`

```typescript
@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private usedEmails = ['admin@lareferente.com', 'user@test.com', 'info@example.com'];
  private usedUsernames = ['admin', 'root', 'user', 'test'];

  checkEmailUnique(email: string): Observable<boolean> {
    if (!email) return of(true);
    const isUnique = !this.usedEmails.includes(email.toLowerCase());
    return of(isUnique).pipe(delay(800));
  }

  checkUsernameAvailable(username: string): Observable<boolean> {
    if (!username || username.length < 3) return of(true);
    const isAvailable = !this.usedUsernames.includes(username.toLowerCase());
    return of(isAvailable).pipe(delay(600));
  }
}
```

**Nota**: En produccion, estos metodos realizarian llamadas HTTP reales al backend.

---

## 4. FormArray: Listas Dinamicas

FormArray permite gestionar colecciones de controles de forma dinamica.

### 4.1 Estructura

```typescript
// Inicializacion
this.phonesForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2)]],
  phones: this.fb.array([this.newPhone()])  // Array inicial con un elemento
});

// Acceso al FormArray
get phones(): FormArray {
  return this.phonesForm.get('phones') as FormArray;
}

// Crear nuevo elemento
newPhone(): FormGroup {
  return this.fb.group({
    number: ['', [Validators.required, telefono()]]
  });
}
```

### 4.2 Operaciones

**Agregar elemento**:

```typescript
addPhone(): void {
  this.phones.push(this.newPhone());
}
```

**Eliminar elemento**:

```typescript
removePhone(index: number): void {
  if (this.phones.length > 1) {
    this.phones.removeAt(index);
  }
}
```

### 4.3 Template con FormArray

```html
<fieldset formArrayName="phones">
  @for (phone of phones.controls; track $index) {
    <article [formGroupName]="$index">
      <input formControlName="number" />
      <button type="button" (click)="removePhone($index)" [disabled]="phones.length === 1">
        x
      </button>
    </article>
  }
  <button type="button" (click)="addPhone()">+ Anadir</button>
</fieldset>
```

**Directivas clave**:

| Directiva | Proposito |
|-----------|-----------|
| `formArrayName` | Vincula el fieldset al FormArray |
| `formGroupName` | Vincula cada elemento usando su indice |
| `formControlName` | Vincula inputs dentro del grupo |

---

## 5. Feedback Visual de Validacion

### 5.1 Componente FormInput

**Ubicacion**: `components/shared/form-input/`

```typescript
@Component({
  selector: 'app-form-input',
  imports: [ReactiveFormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FormInput {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() inputId: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() icon: string = '';
  @Input() control: FormControl | null = null;
}
```

**Template**:

```html
<section class="form-field">
  @if (label) {
    <label [for]="inputId" class="form-field__label">
      {{ label }}@if (required) {<span class="form-field__required">*</span>}
    </label>
  }

  <section class="form-field__input-wrapper">
    @if (icon) {
      <svg class="form-field__input-icon">...</svg>
    }

    @if (control) {
      <input
        class="form-field__input"
        [type]="type"
        [id]="inputId"
        [placeholder]="placeholder"
        [required]="required"
        [formControl]="control"
      />
    }
  </section>

  @if (helpText) {
    <small class="form-field__help-text">{{ helpText }}</small>
  }

  @if (errorMessage) {
    <span class="form-field__error-message">{{ errorMessage }}</span>
  }
</section>
```

### 5.2 Estilos de Validacion

```scss
.form-field {
  &__required {
    color: var(--error);
  }

  &__error-message {
    font-size: var(--font-xs);
    font-family: var(--font-primary);
    color: var(--error);
    padding-left: var(--spacing-4);
  }

  &__input {
    &:focus {
      outline: none;
      box-shadow: 0 0 0 var(--border-medium) var(--primary);
    }
  }
}
```

### 5.3 Estados de Validacion en Templates

**Estado de carga (async validator)**:

```html
@if (email?.pending) {
  <small class="register-form__hint register-form__hint--loading">
    Verificando email...
  </small>
}
```

**Error de validacion asincrona**:

```html
@if (email?.errors?.['emailTaken'] && !email?.pending && email?.touched) {
  <small class="register-form__error">Este email ya esta registrado</small>
}
```

**Lista de errores de contrasena**:

```html
@if (password?.touched && getPasswordErrors().length > 0) {
  <ul class="register-form__errors-list">
    @for (error of getPasswordErrors(); track error) {
      <li class="register-form__error">{{ error }}</li>
    }
  </ul>
}
```

**Error cross-field**:

```html
@if (registerForm.errors?.['mismatch'] && confirmPassword?.touched) {
  <small class="register-form__error">Las contrasenas no coinciden</small>
}
```

**Clases dinamicas de error**:

```html
<input
  [class.home__form-input--error]="phonesForm.get('name')?.invalid && phonesForm.get('name')?.touched"
/>
```

---

## 6. Resumen de Validadores

### Validadores Sincronos

| Validador | Archivo | Uso |
|-----------|---------|-----|
| `nif()` | `spanish-formats.validator.ts` | Valida NIF espanol |
| `telefono()` | `spanish-formats.validator.ts` | Valida telefono espanol |
| `codigoPostal()` | `spanish-formats.validator.ts` | Valida codigo postal |
| `passwordStrength()` | `password-strength.validator.ts` | Valida fortaleza de contrasena |
| `passwordMatch()` | `cross-field.validators.ts` | Valida coincidencia de contrasenas |
| `totalMinimo()` | `cross-field.validators.ts` | Valida total minimo precio x cantidad |
| `atLeastOneRequired()` | `cross-field.validators.ts` | Valida al menos un campo con valor |
| `rangoEdad()` | `busqueda.validators.ts` | Valida rango edad min <= max |
| `rangoDorsal()` | `busqueda.validators.ts` | Valida rango dorsal min <= max |

### Validadores Asincronos

| Validador | Archivo | Uso |
|-----------|---------|-----|
| `uniqueEmail()` | `async.validators.ts` | Verifica email disponible |
| `usernameAvailable()` | `async.validators.ts` | Verifica username disponible |

---

## 7. Flujo de Validacion

```
Usuario escribe en input
         |
         v
+-------------------+
| Validadores sync  |  <-- Ejecutan inmediatamente
+-------------------+
         |
         v
+-------------------+
| Validadores async |  <-- Ejecutan si sync pasan (con debounce)
+-------------------+
         |
         v
+------------------------+
| control.status cambia  |  <-- VALID, INVALID, PENDING
+------------------------+
         |
         v
+-------------------+
| Template reacciona|  <-- Muestra/oculta errores
+-------------------+
```

---

## Tecnologias y Conceptos Utilizados

- **ReactiveFormsModule**: Modulo de Angular para formularios reactivos
- **FormBuilder**: Servicio para crear FormGroups de forma simplificada
- **FormGroup**: Agrupa controles relacionados
- **FormArray**: Coleccion dinamica de controles
- **FormControl**: Control individual de formulario
- **ValidatorFn**: Tipo para validadores sincronos
- **AsyncValidatorFn**: Tipo para validadores asincronos
- **RxJS Operators**: `timer`, `switchMap`, `map`, `delay` para validaciones async
- **Angular Signals**: Estado reactivo (`submitted`, estados locales)
- **Clases dinamicas**: `[class.error]` para feedback visual
