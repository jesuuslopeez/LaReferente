import { Component, Input, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-form-checkbox',
  imports: [],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
})
export class FormCheckbox implements AfterContentInit {
  @Input() label: string = '';
  @Input() checkboxId: string = '';
  @Input() name: string = '';
  @Input() required: boolean = false;
  @Input() checked: boolean = false;
  @Input() helpText: string = '';

  hasContent = false;

  ngAfterContentInit() {
    this.hasContent = true;
  }
}
