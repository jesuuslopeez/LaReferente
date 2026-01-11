import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormInput } from '../form-input/form-input';
import { FormModalButton } from '../form-modal-button/form-modal-button';
import { ToastService } from '../../../shared/services/toast';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule, FormInput, FormModalButton],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  @Output() switchToRegister = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  loginForm: FormGroup;
  cargando = signal(false);

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

  protected onSwitchToRegister(): void {
    this.switchToRegister.emit();
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.error('Por favor completa todos los campos correctamente');
      return;
    }

    this.cargando.set(true);

    this.authService
      .login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
      .subscribe({
        next: () => {
          this.cargando.set(false);
          this.toastService.success('Inicio de sesion exitoso');
          this.loginSuccess.emit();
        },
        error: (err) => {
          this.cargando.set(false);
          this.toastService.error(err.error?.message || 'Credenciales incorrectas');
        },
      });
  }
}
