import { Component, EventEmitter, Output } from '@angular/core';
import { FormInput } from '../form-input/form-input';
import { FormModalButton } from '../form-modal-button/form-modal-button';
import { FormCheckbox } from '../form-checkbox/form-checkbox';

@Component({
  selector: 'app-register-form',
  imports: [FormInput, FormModalButton, FormCheckbox],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  @Output() switchToLogin = new EventEmitter<void>();

  protected onSwitchToLogin(): void {
    this.switchToLogin.emit();
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    console.log('Register form submitted');
  }
}
