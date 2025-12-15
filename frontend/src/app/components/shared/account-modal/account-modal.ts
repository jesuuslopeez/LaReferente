import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-account-modal',
  imports: [],
  templateUrl: './account-modal.html',
  styleUrl: './account-modal.scss',
})
export class AccountModal {
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  protected onClose(): void {
    this.close.emit();
  }

  protected onOverlayClick(): void {
    this.close.emit();
  }

  protected onContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
