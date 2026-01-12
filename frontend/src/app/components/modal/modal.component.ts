import { Component, signal, HostListener, ViewChild, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

/**
 * Componente Modal con cierre mediante tecla ESC y click en backdrop
 * Demuestra: eventos de teclado (keydown.escape), @HostListener, prevención de propagación,
 * ViewChild para referencias al DOM, Renderer2 para manipulación segura
 */
@Component({
  selector: 'app-modal',
  imports: [],
  template: `
    <button (click)="open()" (keydown.enter)="open()">Abrir Modal</button>

    @if (isOpen()) {
      <section class="modal-backdrop" (click)="onBackdropClick()">
        <article
          #modalContent
          class="modal-content"
          (click)="$event.stopPropagation()"
          (keydown.escape)="close()"
          tabindex="-1"
          role="dialog"
          aria-modal="true">
          <header>
            <h2>Modal de Ejemplo</h2>
            <button
              #closeButton
              (click)="close()"
              (keydown.enter)="close()"
              aria-label="Cerrar modal">×</button>
          </header>
          <main>
            <p>Este es el contenido del modal.</p>
            <p>Presiona ESC o haz click fuera para cerrar.</p>
          </main>
          <footer>
            <button (click)="close()" (blur)="onButtonBlur()">Cerrar</button>
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

  // Referencias al DOM mediante ViewChild
  @ViewChild('modalContent') modalContent!: ElementRef;
  @ViewChild('closeButton') closeButton!: ElementRef;

  constructor(private renderer: Renderer2) {}

  protected open(): void {
    this.isOpen.set(true);
    // Usar setTimeout para esperar a que el modal se renderice
    setTimeout(() => {
      if (this.modalContent?.nativeElement) {
        // Dar foco al modal para accesibilidad
        this.renderer.selectRootElement(this.modalContent.nativeElement).focus();
      }
    });
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected onBackdropClick(): void {
    this.close();
  }

  // Evento blur: detecta cuando se pierde el foco del boton
  protected onButtonBlur(): void {
    console.log('Boton perdio el foco');
  }

  // Evento global de teclado: cierra modal con ESC
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}
