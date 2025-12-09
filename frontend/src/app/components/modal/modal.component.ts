import { Component, signal, HostListener } from '@angular/core';

/**
 * Componente Modal con cierre mediante tecla ESC y click en backdrop
 * Demuestra: eventos de teclado, @HostListener, prevención de propagación
 */
@Component({
  selector: 'app-modal',
  imports: [],
  template: `
    <button (click)="open()">Abrir Modal</button>

    @if (isOpen()) {
      <section class="modal-backdrop" (click)="onBackdropClick()">
        <article class="modal-content" (click)="$event.stopPropagation()">
          <header>
            <h2>Modal de Ejemplo</h2>
            <button (click)="close()" aria-label="Cerrar modal">×</button>
          </header>
          <main>
            <p>Este es el contenido del modal.</p>
            <p>Presiona ESC o haz click fuera para cerrar.</p>
          </main>
          <footer>
            <button (click)="close()">Cerrar</button>
          </footer>
        </article>
      </section>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 8px;
      max-width: 500px;
      width: 90%;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    header button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
  `]
})
export class ModalComponent {
  protected readonly isOpen = signal(false);

  protected open(): void {
    this.isOpen.set(true);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected onBackdropClick(): void {
    // Solo cierra si el click fue en el backdrop, no en el contenido
    this.close();
  }

  // Cerrar modal con tecla ESC
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}
