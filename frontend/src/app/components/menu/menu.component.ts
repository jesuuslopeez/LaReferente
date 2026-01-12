import { Component, signal, ElementRef, HostListener, ViewChild, Renderer2 } from '@angular/core';

/**
 * Componente de menú hamburguesa con toggle y cierre al hacer click fuera
 * Demuestra: event binding, @HostListener (document:click, document:keydown.escape),
 * navegación por teclado (keydown.arrowdown, keydown.arrowup), ViewChild
 */
@Component({
  selector: 'app-menu',
  imports: [],
  template: `
    <nav>
      <button
        #menuButton
        (click)="toggle()"
        (keydown.enter)="toggle()"
        (keydown.arrowdown)="openAndFocusFirst($event)"
        [attr.aria-expanded]="isOpen()"
        aria-label="Toggle menu"
      >
        Menu
      </button>

      @if (isOpen()) {
        <ul #menuList role="menu">
          <li role="none">
            <a
              href="#"
              role="menuitem"
              (click)="close()"
              (keydown.arrowdown)="focusNext($event, 0)"
              (keydown.arrowup)="focusPrev($event, 0)"
              (keydown.escape)="closeAndFocusButton()">Inicio</a>
          </li>
          <li role="none">
            <a
              href="#"
              role="menuitem"
              (click)="close()"
              (keydown.arrowdown)="focusNext($event, 1)"
              (keydown.arrowup)="focusPrev($event, 1)"
              (keydown.escape)="closeAndFocusButton()">Productos</a>
          </li>
          <li role="none">
            <a
              href="#"
              role="menuitem"
              (click)="close()"
              (keydown.arrowdown)="focusNext($event, 2)"
              (keydown.arrowup)="focusPrev($event, 2)"
              (keydown.escape)="closeAndFocusButton()">Servicios</a>
          </li>
          <li role="none">
            <a
              href="#"
              role="menuitem"
              (click)="close()"
              (keydown.arrowdown)="focusNext($event, 3)"
              (keydown.arrowup)="focusPrev($event, 3)"
              (keydown.escape)="closeAndFocusButton()">Contacto</a>
          </li>
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

  // Referencias al DOM mediante ViewChild
  @ViewChild('menuButton') menuButton!: ElementRef;
  @ViewChild('menuList') menuList!: ElementRef;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  protected toggle(): void {
    this.isOpen.update(value => !value);
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  // Abre el menu y da foco al primer elemento
  protected openAndFocusFirst(event: Event): void {
    event.preventDefault();
    this.isOpen.set(true);
    setTimeout(() => {
      const firstItem = this.menuList?.nativeElement?.querySelector('a');
      if (firstItem) {
        firstItem.focus();
      }
    });
  }

  // Cierra el menu y devuelve el foco al boton
  protected closeAndFocusButton(): void {
    this.close();
    if (this.menuButton?.nativeElement) {
      this.menuButton.nativeElement.focus();
    }
  }

  // Navegacion por teclado: mover al siguiente elemento
  protected focusNext(event: Event, currentIndex: number): void {
    event.preventDefault();
    const items = this.menuList?.nativeElement?.querySelectorAll('a');
    if (items && items[currentIndex + 1]) {
      items[currentIndex + 1].focus();
    }
  }

  // Navegacion por teclado: mover al elemento anterior
  protected focusPrev(event: Event, currentIndex: number): void {
    event.preventDefault();
    const items = this.menuList?.nativeElement?.querySelectorAll('a');
    if (items && items[currentIndex - 1]) {
      items[currentIndex - 1].focus();
    } else if (currentIndex === 0) {
      this.closeAndFocusButton();
    }
  }

  // Evento global: cierra el menu al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen()) {
      this.close();
    }
  }

  // Evento global: cierra el menu al presionar ESC
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.isOpen()) {
      this.closeAndFocusButton();
    }
  }
}
