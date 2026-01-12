import { Component, Output, EventEmitter, Input, HostListener, ElementRef, AfterViewInit, OnDestroy, ViewChild, Renderer2, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-account-modal',
  imports: [],
  templateUrl: './account-modal.html',
  styleUrl: './account-modal.scss',
})
export class AccountModal implements AfterViewInit, OnDestroy {
  @Input() title: string = '';
  @Output() close = new EventEmitter<void>();

  @ViewChild('modalContent') modalContent!: ElementRef;
  @ViewChild('closeButton') closeButton!: ElementRef;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private previousActiveElement: HTMLElement | null = null;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    // Guardar elemento con foco antes de abrir el modal
    this.previousActiveElement = document.activeElement as HTMLElement;

    // Bloquear scroll del body
    this.renderer.setStyle(document.body, 'overflow', 'hidden');

    // Dar foco al boton de cerrar
    setTimeout(() => {
      this.closeButton?.nativeElement?.focus();
    });
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;

    // Restaurar scroll del body
    this.renderer.removeStyle(document.body, 'overflow');

    // Devolver foco al elemento anterior
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }

  // Cerrar modal con tecla ESC
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.close.emit();
  }

  // Focus trap: mantener foco dentro del modal
  @HostListener('document:keydown.tab', ['$event'])
  onTabPress(event: Event): void {
    const keyEvent = event as KeyboardEvent;
    if (!this.modalContent?.nativeElement) return;

    const focusableElements = this.modalContent.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Si se presiona Shift+Tab en el primer elemento, ir al ultimo
    if (keyEvent.shiftKey && document.activeElement === firstElement) {
      keyEvent.preventDefault();
      lastElement.focus();
    }
    // Si se presiona Tab en el ultimo elemento, ir al primero
    else if (!keyEvent.shiftKey && document.activeElement === lastElement) {
      keyEvent.preventDefault();
      firstElement.focus();
    }
  }

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
