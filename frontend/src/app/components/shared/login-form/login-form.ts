import { Component, EventEmitter, Output } from '@angular/core';
import { FormInput } from '../form-input/form-input';
import { FormModalButton } from '../form-modal-button/form-modal-button';

@Component({
  selector: 'app-login-form',
  imports: [FormInput, FormModalButton],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  @Output() switchToRegister = new EventEmitter<void>();

  protected onSwitchToRegister(): void {
    this.switchToRegister.emit();
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    console.log('Login form submitted');
  }
}
