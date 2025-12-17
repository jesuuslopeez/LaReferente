# Formularios Reactivos - La Referente

## Introducción

Este documento describe la implementación completa del sistema de formularios reactivos en La Referente, aplicado al formulario de registro de usuarios del dropdown de cuenta.

## Formulario Implementado: RegisterForm

**Componente**: `RegisterForm`  
**Ubicación**: `src/app/components/shared/register-form/`  
**Acceso**: Dropdown de "Cuenta" en el header de la aplicación

### Características Implementadas

- ✅ **FormBuilder** con validadores síncronos y asíncronos
- ✅ **Validación de contraseña fuerte** (mayúsculas, minúsculas, números, especiales, 12+ caracteres)
- ✅ **Validación asíncrona de email único** con loading state
- ✅ **Validación cross-field** para confirmar contraseña
- ✅ **Feedback visual completo** (errores, loading, estados touched/dirty)
- ✅ **Botón submit deshabilitado** durante validación asíncrona o formulario inválido

### Estructura del Formulario

```typescript
registerForm: FormGroup = this.fb.group({
  email: ['', {
    validators: [Validators.required, Validators.email],
    asyncValidators: [uniqueEmail(this.validationService)],
    updateOn: 'blur'
  }],
  nombre: ['', [Validators.required, Validators.minLength(2)]],
  password: ['', [Validators.required, passwordStrength()]],
  confirmPassword: ['', Validators.required],
  terms: [false, Validators.requiredTrue]
}, {
  validators: passwordMatch('password', 'confirmPassword')
});
```

### Campos del Formulario

| Campo | Tipo | Validaciones | Descripción |
|-------|------|--------------|-------------|
| email | email | required, email, uniqueEmail() | Email único (validación asíncrona) |
| nombre | text | required, minLength(2) | Nombre del usuario |
| password | password | required, passwordStrength() | Contraseña fuerte |
| confirmPassword | password | required, passwordMatch() | Confirmación de contraseña |
| terms | checkbox | requiredTrue | Aceptar términos y condiciones |

## Catálogo de Validadores

### Validadores Síncronos Built-in

| Validador | Descripción | Uso | Error |
|-----------|-------------|-----|-------|
| `Validators.required` | Campo obligatorio | `['', Validators.required]` | `{required: true}` |
| `Validators.email` | Formato email válido | `['', Validators.email]` | `{email: true}` |
| `Validators.minLength(n)` | Longitud mínima | `['', Validators.minLength(2)]` | `{minlength: {...}}` |
| `Validators.requiredTrue` | Checkbox debe estar marcado | `[false, Validators.requiredTrue]` | `{required: true}` |

### Validadores Personalizados Síncronos

#### passwordStrength()

**Ubicación**: `src/app/shared/validators/password-strength.validator.ts`

**Validaciones**:
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Al menos un carácter especial (!@#$%^&*(),.?":{}|<>)
- Mínimo 12 caracteres

**Errores posibles**:
- `noUppercase`: Falta mayúscula
- `noLowercase`: Falta minúscula
- `noNumber`: Falta número
- `noSpecial`: Falta carácter especial
- `minLength`: Menos de 12 caracteres

**Uso**:
```typescript
password: ['', [Validators.required, passwordStrength()]]
```

**Feedback en template**:
```typescript
getPasswordErrors(): string[] {
  const errors = this.password?.errors;
  if (!errors) return [];

  const messages: string[] = [];
  if (errors['noUppercase']) messages.push('Debe contener al menos una mayúscula');
  if (errors['noLowercase']) messages.push('Debe contener al menos una minúscula');
  if (errors['noNumber']) messages.push('Debe contener al menos un número');
  if (errors['noSpecial']) messages.push('Debe contener al menos un carácter especial');
  if (errors['minLength']) messages.push('Debe tener al menos 12 caracteres');

  return messages;
}
```

```html
@if (password?.touched && getPasswordErrors().length > 0) {
  <ul class="register-form__errors-list">
    @for (error of getPasswordErrors(); track error) {
      <li class="register-form__error">{{ error }}</li>
    }
  </ul>
}
```

### Validadores Cross-Field

#### passwordMatch(controlName, matchControlName)

**Ubicación**: `src/app/shared/validators/cross-field.validators.ts`

**Descripción**: Valida que dos campos de contraseña coincidan

**Error**: `{mismatch: true}`

**Uso a nivel de FormGroup**:
```typescript
this.registerForm = this.fb.group({
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required]
}, {
  validators: passwordMatch('password', 'confirmPassword')
});
```

**Feedback en template**:
```html
@if (registerForm.errors?.['mismatch'] && confirmPassword?.touched) {
  <small class="register-form__error">Las contraseñas no coinciden</small>
}
```

### Validadores Asíncronos

#### uniqueEmail(validationService)

**Ubicación**: `src/app/shared/validators/async.validators.ts`

**Descripción**: Verifica que el email no esté ya registrado (simulación con delay 800ms)

**Error**: `{emailTaken: true}`

**Emails ya registrados (simulación)**:
- `admin@lareferente.com`
- `user@test.com`
- `info@example.com`

**Uso**:
```typescript
email: ['', {
  validators: [Validators.required, Validators.email],
  asyncValidators: [uniqueEmail(this.validationService)],
  updateOn: 'blur'  // Solo valida al salir del campo
}]
```

**Estados del control**:
- `pending`: Validación en curso (mostrar loading)
- `valid`: Email disponible
- `invalid` con `emailTaken`: Email ya registrado

**Feedback en template**:
```html
@if (email?.pending) {
  <small class="register-form__hint register-form__hint--loading">
    Verificando email...
  </small>
}

@if (email?.errors?.['emailTaken'] && !email?.pending && email?.touched) {
  <small class="register-form__error">Este email ya está registrado</small>
}
```

## Servicio de Validación

**Ubicación**: `src/app/shared/services/validation.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class ValidationService {
  private usedEmails = ['admin@lareferente.com', 'user@test.com', 'info@example.com'];

  checkEmailUnique(email: string): Observable<boolean> {
    if (!email) return of(true);
    const isUnique = !this.usedEmails.includes(email.toLowerCase());
    return of(isUnique).pipe(delay(800)); // Simula latencia de red
  }
}
```

## Estados del Formulario

### Estados de un FormControl

| Estado | Descripción |
|--------|-------------|
| `touched` | El usuario ha entrado y salido del campo (blur) |
| `dirty` | El usuario ha modificado el valor |
| `valid` | El campo cumple todas las validaciones |
| `invalid` | El campo no cumple alguna validación |
| `pending` | Validaciones asíncronas en curso |

### Mostrar Errores

**Patrón recomendado**: Mostrar error si el campo es `invalid` **Y** (`touched` **O** `submitted`):

```html
@if (nombre?.errors?.['required'] && (nombre?.touched || submitted())) {
  <small class="register-form__error">El nombre es obligatorio</small>
}
```

### Estilos Condicionales

```html
<input
  formControlName="email"
  class="register-form__input"
  [class.register-form__input--error]="email?.invalid && (email?.touched || submitted())"
  [class.register-form__input--valid]="email?.valid && email?.touched"
/>
```

### Botón Submit

```html
<button
  type="submit"
  class="register-form__button"
  [disabled]="registerForm.invalid || registerForm.pending"
>
  {{ registerForm.pending ? 'Validando...' : 'Registrarse' }}
</button>
```

## Manejo del Submit

```typescript
protected onSubmit(event: Event): void {
  event.preventDefault();
  this.submitted.set(true);

  if (this.registerForm.invalid || this.registerForm.pending) {
    this.registerForm.markAllAsTouched();
    this.toastService.error('Por favor, corrige los errores del formulario');
    return;
  }

  this.toastService.success('Registro completado correctamente');
  console.log('Register form submitted:', this.registerForm.value);
  this.registerForm.reset();
  this.submitted.set(false);
}
```

## Estructura de Archivos

```
frontend/src/app/
├── components/shared/
│   └── register-form/
│       ├── register-form.ts
│       ├── register-form.html
│       └── register-form.scss
├── shared/
│   ├── validators/
│   │   ├── password-strength.validator.ts
│   │   ├── cross-field.validators.ts
│   │   └── async.validators.ts
│   └── services/
│       ├── validation.ts
│       └── toast.ts
```

## Estilos CSS

El formulario usa clases BEM sin `div` ni `!important`:

```scss
.register-form {
  &__field { }
  &__label { }
  &__required { }
  &__input {
    &--error { }
    &--valid { }
  }
  &__error { }
  &__hint {
    &--loading { }
  }
  &__button {
    &:disabled { }
  }
}
```

## Validadores Adicionales Disponibles

Aunque no se usan en el register-form, estos validadores están disponibles para otros formularios:

### Validadores de Formato Español

**Ubicación**: `src/app/shared/validators/spanish-formats.validator.ts`

- `nif()`: Valida NIF español (8 dígitos + letra)
- `telefono()`: Valida teléfono móvil español (6/7 + 8 dígitos)
- `codigoPostal()`: Valida código postal de 5 dígitos

### Validadores Cross-Field Adicionales

**Ubicación**: `src/app/shared/validators/cross-field.validators.ts`

- `totalMinimo(min)`: Valida que price × quantity >= mínimo
- `atLeastOneRequired(...fields)`: Al menos un campo debe tener valor

## Pruebas

Para probar el formulario:

1. Accede a `http://localhost:4200/`
2. Click en el dropdown de "Cuenta" en el header
3. Selecciona "Registrarse"

Prueba las validaciones:
- **Email**: Intenta con `admin@lareferente.com` (ya registrado)
- **Contraseña**: Debe cumplir todos los requisitos (12+ caracteres, mayúsculas, minúsculas, números, especiales)
- **Confirmar contraseña**: Debe coincidir exactamente
- **Términos**: Debe estar marcado

## Buenas Prácticas Implementadas

### 1. Separación de Responsabilidades

- **Validadores**: Archivos separados reutilizables
- **Servicios**: Lógica de validación asíncrona separada
- **Componentes**: Solo UI y delegación

### 2. Feedback Visual Claro

- Bordes rojos para campos con error
- Bordes verdes para campos válidos
- Loading indicators para validación asíncrona
- Mensajes de error específicos por cada validación

### 3. Experiencia de Usuario

- `updateOn: 'blur'` para validaciones asíncronas (evita validar en cada tecla)
- No mostrar errores hasta que el usuario toque el campo
- Botón deshabilitado durante validación
- Feedback inmediato tras submit

### 4. TypeScript y Type Safety

```typescript
interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
```

### 5. Signals para Estado Reactivo

```typescript
submitted = signal(false);
```

## Resumen de Entregables

- ✅ **Formulario reactivo completo**: RegisterForm con FormBuilder
- ✅ **Validadores personalizados síncronos**: passwordStrength (1)
- ✅ **Validadores cross-field**: passwordMatch (1)
- ✅ **Validadores asíncronos**: uniqueEmail (1)
- ✅ **Feedback visual completo**: Estados pending, valid, invalid, touched
- ✅ **Documentación completa**: Este documento con ejemplos
- ✅ **Código sin div ni !important**: Uso de `section` y estilos BEM

## Validadores Adicionales Creados

Para futuros formularios, también están disponibles:

**Síncronos (4 totales)**:
1. passwordStrength() ✅ Usado en RegisterForm
2. nif()
3. telefono()
4. codigoPostal()

**Cross-field (5 totales)**:
1. passwordMatch() ✅ Usado en RegisterForm
2. totalMinimo()
3. atLeastOneRequired()
4. rangoEdad()
5. rangoDorsal()

**Asíncronos (2 totales)**:
1. uniqueEmail() ✅ Usado en RegisterForm
2. usernameAvailable()
