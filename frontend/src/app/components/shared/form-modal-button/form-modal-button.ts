import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-modal-button',
  imports: [],
  templateUrl: './form-modal-button.html',
  styleUrl: './form-modal-button.scss',
})
export class FormModalButton {
  @Input() text: string = '';
  @Input() type: 'submit' | 'button' = 'submit';
}
