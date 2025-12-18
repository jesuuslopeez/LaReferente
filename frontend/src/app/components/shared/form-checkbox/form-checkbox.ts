import { Component, Input, AfterContentInit, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
  encapsulation: ViewEncapsulation.None,
})
export class FormCheckbox implements AfterContentInit {
  @Input() label: string = '';
  @Input() checkboxId: string = '';
  @Input() name: string = '';
  @Input() required: boolean = false;
  @Input() checked: boolean = false;
  @Input() helpText: string = '';
  @Input() control: FormControl | null = null;

  hasContent = false;

  ngAfterContentInit() {
    this.hasContent = true;
  }
}
