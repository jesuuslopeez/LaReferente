import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { passwordStrength } from '../../../shared/validators/password-strength.validator';
import { passwordMatch } from '../../../shared/validators/cross-field.validators';
import { uniqueEmail } from '../../../shared/validators/async.validators';
import { ValidationService } from '../../../shared/services/validation';
import { ToastService } from '../../../shared/services/toast';
import { FormInput } from '../form-input/form-input';
import { FormCheckbox } from '../form-checkbox/form-checkbox';
import { FormModalButton } from '../form-modal-button/form-modal-button';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register-form',
  imports: [CommonModule, ReactiveFormsModule, FormInput, FormCheckbox, FormModalButton],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  @Output() switchToLogin = new EventEmitter<void>();
  @Output() registerSuccess = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private validationService = inject(ValidationService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  registerForm: FormGroup;
  submitted = signal(false);
  cargando = signal(false);

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
        apellidos: ['', [Validators.required, Validators.minLength(2)]],
        password: ['', [Validators.required, passwordStrength()]],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      { validators: passwordMatch('password', 'confirmPassword') }
    );
  }

  get email() {
    return this.registerForm.get('email') as FormControl;
  }
  get nombre() {
    return this.registerForm.get('nombre') as FormControl;
  }
  get apellidos() {
    return this.registerForm.get('apellidos') as FormControl;
  }
  get password() {
    return this.registerForm.get('password') as FormControl;
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword') as FormControl;
  }
  get terms() {
    return this.registerForm.get('terms') as FormControl;
  }

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

  protected onSwitchToLogin(): void {
    this.switchToLogin.emit();
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);

    if (this.registerForm.invalid || this.registerForm.pending) {
      this.registerForm.markAllAsTouched();
      this.toastService.error('Por favor, corrige los errores del formulario');
      return;
    }

    this.cargando.set(true);

    this.authService
      .registro({
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        nombre: this.registerForm.value.nombre,
        apellidos: this.registerForm.value.apellidos,
      })
      .subscribe({
        next: () => {
          this.cargando.set(false);
          this.toastService.success('Registro completado correctamente');
          this.registerForm.reset();
          this.submitted.set(false);
          this.registerSuccess.emit();
        },
        error: (err) => {
          this.cargando.set(false);
          this.toastService.error(err.error?.message || 'Error al registrarse');
        },
      });
  }
}
