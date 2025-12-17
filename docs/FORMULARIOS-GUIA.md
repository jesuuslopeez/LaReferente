# Guía de Formularios Reactivos - La Referente

## Catálogo de Validadores

### Validadores Síncronos Integrados

| Validador | Nivel | Descripción | Error |
|-----------|-------|-------------|-------|
| `Validators.required` | Campo | Valor obligatorio | `{required: true}` |
| `Validators.email` | Campo | Formato email | `{email: true}` |
| `Validators.minLength(n)` | Campo | Longitud mínima | `{minlength: {...}}` |
| `Validators.min(n)` | Campo | Valor numérico mínimo | `{min: {...}}` |
| `Validators.pattern(regex)` | Campo | Patrón regex | `{pattern: {...}}` |

### Validadores Personalizados

| Validador | Nivel | Descripción | Error |
|-----------|-------|-------------|-------|
| `passwordStrength()` | Campo | Valida mayúsculas, minúsculas, números, caracteres especiales (mín 12 caracteres) | `{noUppercase, noLowercase, noNumber, noSpecial, minLength}` |
| `nif()` | Campo | NIF español válido con letra correcta | `{invalidNif: true}` |
| `telefono()` | Campo | Móvil español (6/7 + 8 dígitos) | `{invalidTelefono: true}` |
| `codigoPostal()` | Campo | Código postal 5 dígitos | `{invalidCP: true}` |
| `passwordMatch(f1, f2)` | FormGroup | Contraseñas coinciden | `{mismatch: true}` |
| `totalMinimo(min)` | FormGroup | Validar precio * cantidad >= min | `{totalMinimo: {...}}` |
| `atLeastOneRequired(...fields)` | FormGroup | Al menos un campo requerido | `{atLeastOneRequired: {...}}` |

### Validadores Asíncronos

| Validador | Debounce | Descripción | Error |
|-----------|----------|-------------|-------|
| `uniqueEmail(service)` | 500ms | Email único en BD | `{emailTaken: true}` |
| `usernameAvailable(service)` | 400ms | Username disponible | `{usernameTaken: true}` |

---

## Guía FormArray

### Definición

```typescript
constructor(private fb: FormBuilder) {
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
```

### Template

```html
<form [formGroup]="phonesForm" (ngSubmit)="onSubmit()">
  <input formControlName="name">
  
  <div formArrayName="phones">
    @for (phone of phones.controls; track $index) {
      <div [formGroupName]="$index">
        <input formControlName="number">
        <button type="button" (click)="removePhone($index)">×</button>
      </div>
    }
    <button type="button" (click)="addPhone()">+ Añadir</button>
  </div>
  
  <button type="submit" [disabled]="phonesForm.invalid">Guardar</button>
</form>
```

---

## Validación Asíncrona

### Servicio

```typescript
@Injectable({ providedIn: 'root' })
export class ValidationService {
  private usedEmails = ['admin@lareferente.com'];

  checkEmailUnique(email: string): Observable<boolean> {
    const isUnique = !this.usedEmails.includes(email.toLowerCase());
    return of(isUnique).pipe(delay(800));
  }
}
```

### Validador

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

### Uso

```typescript
this.registerForm = this.fb.group({
  email: ['', {
    validators: [Validators.required, Validators.email],
    asyncValidators: [uniqueEmail(this.validationService)],
    updateOn: 'blur'
  }]
});
```

### Template

```html
<input formControlName="email">

@if (email.pending) {
  <div class="loading">Validando...</div>
}

@if (email.errors?.['emailTaken'] && !email.pending && email.touched) {
  <div class="error">Email ya registrado</div>
}

<button [disabled]="form.invalid || form.pending">
  {{ form.pending ? 'Validando...' : 'Enviar' }}
</button>
```

---

## Feedback Visual CSS

```scss
// Campo inválido
input.ng-touched.ng-invalid {
  border-color: var(--error) !important;
}

// Campo válido
input.ng-touched.ng-valid {
  border-color: var(--success) !important;
}

// Validación asíncrona
input.ng-pending {
  border-style: dashed !important;
  border-color: var(--info) !important;
}
```

---

## Formularios Implementados

### 1. RegisterForm
- **Ubicación**: `src/app/components/shared/register-form/`
- **Campos**: email, nombre, password, confirmPassword, terms
- **Validadores**: passwordStrength, passwordMatch, uniqueEmail

### 2. LoginForm
- **Ubicación**: `src/app/components/shared/login-form/`
- **Campos**: email, password
- **Validadores**: required, email, minLength

### 3. Ejemplo FormArray
- **Ubicación**: `src/app/pages/home/` (sección de ejemplo)
- **Campos**: name, phones (FormArray)
- **Validadores**: required, minLength, telefono

---

## Ubicaciones

- **Validadores**: `src/app/shared/validators/`
- **Servicios**: `src/app/shared/services/`
- **Componentes**: `src/app/components/shared/`
