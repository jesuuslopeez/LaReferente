import { Component, signal } from '@angular/core';

type TabId = 'detalles' | 'especificaciones' | 'opiniones';

/**
 * Componente Tabs con navegación entre pestañas
 * Demuestra: event binding, condicionales, clases dinámicas
 */
@Component({
  selector: 'app-tabs',
  imports: [],
  template: `
    <section class="tabs">
      <nav class="tabs-nav">
        <button
          (click)="selectTab('detalles')"
          [class.active]="activeTab() === 'detalles'"
          type="button"
        >
          Detalles
        </button>
        <button
          (click)="selectTab('especificaciones')"
          [class.active]="activeTab() === 'especificaciones'"
          type="button"
        >
          Especificaciones
        </button>
        <button
          (click)="selectTab('opiniones')"
          [class.active]="activeTab() === 'opiniones'"
          type="button"
        >
          Opiniones
        </button>
      </nav>

      <article class="tabs-content">
        @if (activeTab() === 'detalles') {
          <section>
            <h3>Detalles del Producto</h3>
            <p>Información detallada sobre el producto.</p>
          </section>
        }
        @if (activeTab() === 'especificaciones') {
          <section>
            <h3>Especificaciones Técnicas</h3>
            <ul>
              <li>Característica 1</li>
              <li>Característica 2</li>
              <li>Característica 3</li>
            </ul>
          </section>
        }
        @if (activeTab() === 'opiniones') {
          <section>
            <h3>Opiniones de Clientes</h3>
            <p>Aquí van las reseñas y comentarios.</p>
          </section>
        }
      </article>
    </section>
  `,
  styles: [`
    .tabs-nav {
      display: flex;
      gap: 10px;
      border-bottom: 2px solid #e0e0e0;
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
    .tabs-nav button.active {
      border-bottom-color: var(--primary, #3b82f6);
      color: var(--primary, #3b82f6);
      font-weight: 600;
    }
    .tabs-content {
      padding: 20px 0;
    }
  `]
})
export class TabsComponent {
  protected readonly activeTab = signal<TabId>('detalles');

  protected selectTab(tab: TabId): void {
    this.activeTab.set(tab);
  }
}
