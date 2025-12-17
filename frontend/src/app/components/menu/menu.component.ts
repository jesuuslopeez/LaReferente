import { Component, signal, ElementRef, HostListener } from '@angular/core';

/**
 * Componente de menú hamburguesa con toggle y cierre al hacer click fuera
 * Demuestra: event binding, @HostListener, cierre al click externo
 */
@Component({
  selector: 'app-menu',
  imports: [],
  template: `
    <nav>
      <button
        (click)="toggle()"
        [attr.aria-expanded]="isOpen()"
        aria-label="Toggle menu"
      >
        Menu
      </button>

      @if (isOpen()) {
        <ul>
          <li><a href="#" (click)="close()">Inicio</a></li>
          <li><a href="#" (click)="close()">Productos</a></li>
          <li><a href="#" (click)="close()">Servicios</a></li>
          <li><a href="#" (click)="close()">Contacto</a></li>
        </ul>
      }
    </nav>
  `,
  styles: [`
    nav { position: relative; }
    ul {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border: 1px solid #ccc;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li a {
      display: block;
      padding: 10px 20px;
      text-decoration: none;
      color: inherit;
    }
  `]
})
export class MenuComponent {
  protected readonly isOpen = signal(false);

  constructor(private elementRef: ElementRef) {}

  protected toggle(): void {
    this.isOpen.update(value => !value);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen()) {
      this.close();
    }
  }
}
