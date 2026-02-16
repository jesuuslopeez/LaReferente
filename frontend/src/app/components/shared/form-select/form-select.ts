import { Component, Input } from '@angular/core';

export interface SelectOption {
  value: string | number;
  label: string;
}

@Component({
  selector: 'app-form-select',
  imports: [],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
})
export class FormSelect {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() selectId: string = '';
  @Input() required: boolean = false;
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() errorMessage: string = '';
}
