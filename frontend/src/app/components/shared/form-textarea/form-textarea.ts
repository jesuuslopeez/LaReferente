import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-textarea',
  imports: [],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss',
})
export class FormTextarea {
  @Input() label: string = '';
  @Input() name: string = '';
  @Input() textareaId: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() rows: number = 4;
  @Input() maxLength?: number;
}
