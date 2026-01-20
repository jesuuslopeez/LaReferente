import { Component, signal, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';

type TabId = 'detalles' | 'especificaciones' | 'opiniones';

// Array de tabs para navegacion
const TABS: TabId[] = ['detalles', 'especificaciones', 'opiniones'];

/**
 * Componente Tabs con navegacion entre pestanas
 * Demuestra: event binding, ViewChild, ViewChildren, navegacion por teclado (ArrowLeft, ArrowRight, Home, End)
 */
@Component({
  selector: 'app-tabs',
  imports: [],
  template: `
    <section class="tabs">
      <nav class="tabs-nav" role="tablist" #tabList>
        <button
          #tabButton
          (click)="selectTab('detalles')"
          (keydown.arrowright)="focusNextTab($event, 0)"
          (keydown.arrowleft)="focusPrevTab($event, 0)"
          (keydown.home)="focusFirstTab($event)"
          (keydown.end)="focusLastTab($event)"
          [class.active]="activeTab() === 'detalles'"
          [attr.aria-selected]="activeTab() === 'detalles'"
          [attr.tabindex]="activeTab() === 'detalles' ? 0 : -1"
          role="tab"
          aria-controls="panel-detalles"
          id="tab-detalles"
          type="button"
        >
          Detalles
        </button>
        <button
          #tabButton
          (click)="selectTab('especificaciones')"
          (keydown.arrowright)="focusNextTab($event, 1)"
          (keydown.arrowleft)="focusPrevTab($event, 1)"
          (keydown.home)="focusFirstTab($event)"
          (keydown.end)="focusLastTab($event)"
          [class.active]="activeTab() === 'especificaciones'"
          [attr.aria-selected]="activeTab() === 'especificaciones'"
          [attr.tabindex]="activeTab() === 'especificaciones' ? 0 : -1"
          role="tab"
          aria-controls="panel-especificaciones"
          id="tab-especificaciones"
          type="button"
        >
          Especificaciones
        </button>
        <button
          #tabButton
          (click)="selectTab('opiniones')"
          (keydown.arrowright)="focusNextTab($event, 2)"
          (keydown.arrowleft)="focusPrevTab($event, 2)"
          (keydown.home)="focusFirstTab($event)"
          (keydown.end)="focusLastTab($event)"
          [class.active]="activeTab() === 'opiniones'"
          [attr.aria-selected]="activeTab() === 'opiniones'"
          [attr.tabindex]="activeTab() === 'opiniones' ? 0 : -1"
          role="tab"
          aria-controls="panel-opiniones"
          id="tab-opiniones"
          type="button"
        >
          Opiniones
        </button>
      </nav>

      <article class="tabs-content">
        @if (activeTab() === 'detalles') {
          <section role="tabpanel" id="panel-detalles" aria-labelledby="tab-detalles">
            <h3>Detalles del Producto</h3>
            <p>Informacion detallada sobre el producto.</p>
          </section>
        }
        @if (activeTab() === 'especificaciones') {
          <section role="tabpanel" id="panel-especificaciones" aria-labelledby="tab-especificaciones">
            <h3>Especificaciones Tecnicas</h3>
            <ul>
              <li>Caracteristica 1</li>
              <li>Caracteristica 2</li>
              <li>Caracteristica 3</li>
            </ul>
          </section>
        }
        @if (activeTab() === 'opiniones') {
          <section role="tabpanel" id="panel-opiniones" aria-labelledby="tab-opiniones">
            <h3>Opiniones de Clientes</h3>
            <p>Aqui van las resenas y comentarios.</p>
          </section>
        }
      </article>
    </section>
  `,
  styles: [`
    .tabs-nav {
      display: flex;
      gap: 10px;
      border-bottom: 2px solid var(--border-color);
      margin-bottom: 20px;
    }
    .tabs-nav button {
      padding: 10px 20px;
      background: none;
      border: none;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
    }
    .tabs-nav button:focus {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }
    .tabs-nav button.active {
      border-bottom-color: var(--primary);
      color: var(--primary);
      font-weight: 600;
    }
    .tabs-content {
      padding: 20px 0;
    }
  `]
})
export class TabsComponent {
  protected readonly activeTab = signal<TabId>('detalles');

  // Referencias a los botones de tab mediante ViewChildren
  @ViewChildren('tabButton') tabButtons!: QueryList<ElementRef>;
  @ViewChild('tabList') tabList!: ElementRef;

  protected selectTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  // Navegacion por teclado: mover al siguiente tab (ArrowRight)
  protected focusNextTab(event: Event, currentIndex: number): void {
    event.preventDefault();
    const buttons = this.tabButtons?.toArray();
    if (buttons) {
      const nextIndex = (currentIndex + 1) % buttons.length;
      buttons[nextIndex].nativeElement.focus();
      this.activeTab.set(TABS[nextIndex]);
    }
  }

  // Navegacion por teclado: mover al tab anterior (ArrowLeft)
  protected focusPrevTab(event: Event, currentIndex: number): void {
    event.preventDefault();
    const buttons = this.tabButtons?.toArray();
    if (buttons) {
      const prevIndex = currentIndex === 0 ? buttons.length - 1 : currentIndex - 1;
      buttons[prevIndex].nativeElement.focus();
      this.activeTab.set(TABS[prevIndex]);
    }
  }

  // Navegacion por teclado: ir al primer tab (Home)
  protected focusFirstTab(event: Event): void {
    event.preventDefault();
    const buttons = this.tabButtons?.toArray();
    if (buttons && buttons[0]) {
      buttons[0].nativeElement.focus();
      this.activeTab.set(TABS[0]);
    }
  }

  // Navegacion por teclado: ir al ultimo tab (End)
  protected focusLastTab(event: Event): void {
    event.preventDefault();
    const buttons = this.tabButtons?.toArray();
    if (buttons && buttons.length > 0) {
      buttons[buttons.length - 1].nativeElement.focus();
      this.activeTab.set(TABS[buttons.length - 1]);
    }
  }
}
