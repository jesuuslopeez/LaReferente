import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
})
export class Toast {
  toast = signal<ToastMessage | null>(null);
  private timeoutId: any = null;

  constructor(private toastService: ToastService) {
    this.toastService.toast$.subscribe(msg => {
      this.dismiss();
      this.toast.set(msg);

      if (msg?.duration) {
        this.timeoutId = setTimeout(() => {
          this.toast.set(null);
        }, msg.duration);
      }
    });
  }

  dismiss(): void {
    this.toast.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
