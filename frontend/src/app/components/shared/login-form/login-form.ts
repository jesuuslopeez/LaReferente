import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormInput } from '../form-input/form-input';
import { FormModalButton } from '../form-modal-button/form-modal-button';
import { ToastService } from '../../../shared/services/toast';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, ReactiveFormsModule, FormInput, FormModalButton],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  @Output() switchToRegister = new EventEmitter<void>();

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

  protected onSwitchToRegister(): void {
    this.switchToRegister.emit();
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastService.error('Por favor completa todos los campos correctamente');
      return;
    }

    console.log('Login form submitted', this.loginForm.value);
    this.toastService.success('Inicio de sesión exitoso');
  }
}
