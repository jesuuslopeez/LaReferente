import { Component, signal, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

/**
 * Componente Accordion con navegacion por teclado completa
 * Demuestra: ViewChild, ViewChildren, eventos de teclado (ArrowUp, ArrowDown, Home, End),
 * animacion CSS con max-height, accesibilidad (aria-expanded, aria-controls)
 */
@Component({
  selector: 'app-accordion',
  imports: [],
  template: `
    <section class="accordion" #accordionContainer>
      @for (item of items; track item.id; let i = $index) {
        <article class="accordion__item">
          <button
            #accordionButton
            class="accordion__header"
            [class.accordion__header--open]="openItemId() === item.id"
            [attr.aria-expanded]="openItemId() === item.id"
            [attr.aria-controls]="'panel-' + item.id"
            [id]="'header-' + item.id"
            (click)="toggle(item.id)"
            (keydown.arrowdown)="focusNextItem($event, i)"
            (keydown.arrowup)="focusPrevItem($event, i)"
            (keydown.home)="focusFirstItem($event)"
            (keydown.end)="focusLastItem($event)"
            (keydown.enter)="toggle(item.id)"
            (keydown.space)="onSpacePress($event, item.id)"
            type="button"
          >
            <span class="accordion__title">{{ item.title }}</span>
            <span class="accordion__icon" [class.accordion__icon--open]="openItemId() === item.id">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          <section
            class="accordion__panel"
            [class.accordion__panel--open]="openItemId() === item.id"
            [id]="'panel-' + item.id"
            [attr.aria-labelledby]="'header-' + item.id"
            role="region"
          >
            <p class="accordion__content">{{ item.content }}</p>
          </section>
        </article>
      }
    </section>
  `,
  styles: [`
    .accordion {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }
    .accordion__item {
      border-bottom: 1px solid var(--border-color);
    }
    .accordion__item:last-child {
      border-bottom: none;
    }
    .accordion__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 16px 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      font-weight: 500;
      text-align: left;
      transition: background-color 0.2s;
    }
    .accordion__header:hover {
      background-color: var(--bg-hover);
    }
    .accordion__header:focus {
      outline: 2px solid var(--primary);
      outline-offset: -2px;
    }
    .accordion__header--open {
      background-color: var(--bg-secondary);
    }
    .accordion__icon {
      transition: transform 0.3s ease;
    }
    .accordion__icon--open {
      transform: rotate(180deg);
    }
    .accordion__panel {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }
    .accordion__panel--open {
      max-height: 500px;
    }
    .accordion__content {
      padding: 16px 20px;
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.6;
    }
  `]
})
export class AccordionComponent {
  // Estado del item abierto (null si todos cerrados)
  protected readonly openItemId = signal<string | null>(null);

  // Referencias al DOM para navegacion por teclado
  @ViewChildren('accordionButton') accordionButtons!: QueryList<ElementRef>;
  @ViewChild('accordionContainer') accordionContainer!: ElementRef;

  // Datos de ejemplo del accordion
  protected readonly items: AccordionItem[] = [
    {
      id: 'item-1',
      title: 'Como funciona el accordion',
      content: 'El accordion permite mostrar y ocultar secciones de contenido. Solo una seccion puede estar abierta a la vez, lo que ayuda a organizar la informacion de forma compacta.'
    },
    {
      id: 'item-2',
      title: 'Navegacion por teclado',
      content: 'Puedes navegar usando las flechas arriba y abajo. La tecla Home te lleva al primer item y End al ultimo. Enter o Space abren/cierran la seccion actual.'
    },
    {
      id: 'item-3',
      title: 'Accesibilidad',
      content: 'El componente implementa los atributos ARIA necesarios: aria-expanded indica si la seccion esta abierta, aria-controls conecta el boton con su panel correspondiente.'
    },
    {
      id: 'item-4',
      title: 'Animaciones CSS',
      content: 'Las animaciones se realizan con CSS transitions usando max-height para un efecto suave de expansion y contraccion. El icono tambien rota 180 grados al abrir.'
    }
  ];

  // Alternar apertura/cierre de un item
  protected toggle(itemId: string): void {
    if (this.openItemId() === itemId) {
      this.openItemId.set(null);
    } else {
      this.openItemId.set(itemId);
    }
  }

  // Evento Space: prevenir scroll y toggle
  protected onSpacePress(event: Event, itemId: string): void {
    event.preventDefault();
    this.toggle(itemId);
  }

  // Navegacion: ir al siguiente item (ArrowDown)
  protected focusNextItem(event: Event, currentIndex: number): void {
    event.preventDefault();
    const buttons = this.accordionButtons?.toArray();
    if (buttons && buttons[currentIndex + 1]) {
      buttons[currentIndex + 1].nativeElement.focus();
    }
  }

  // Navegacion: ir al item anterior (ArrowUp)
  protected focusPrevItem(event: Event, currentIndex: number): void {
    event.preventDefault();
    const buttons = this.accordionButtons?.toArray();
    if (buttons && buttons[currentIndex - 1]) {
      buttons[currentIndex - 1].nativeElement.focus();
    }
  }

  // Navegacion: ir al primer item (Home)
  protected focusFirstItem(event: Event): void {
    event.preventDefault();
    const buttons = this.accordionButtons?.toArray();
    if (buttons && buttons[0]) {
      buttons[0].nativeElement.focus();
    }
  }

  // Navegacion: ir al ultimo item (End)
  protected focusLastItem(event: Event): void {
    event.preventDefault();
    const buttons = this.accordionButtons?.toArray();
    if (buttons && buttons.length > 0) {
      buttons[buttons.length - 1].nativeElement.focus();
    }
  }
}
