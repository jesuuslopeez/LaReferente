import { Component, input, output, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  readonly type = input<AlertType>('info');
  readonly message = input.required<string>();
  readonly closable = input<boolean>(true);

  readonly close = output<void>();

  protected readonly visible = signal(true);

  protected onClose(): void {
    this.visible.set(false);
    this.close.emit();
  }
}
