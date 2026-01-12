import { Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy } from '@angular/core';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Directiva Tooltip con delay configurable, posicionamiento dinamico y flecha
 * Demuestra: eventos mouse (mouseenter, mouseleave), eventos focus (focusin, focusout),
 * creacion dinamica de elementos con Renderer2, setTimeout/clearTimeout para delay
 *
 * Uso basico: <button appTooltip="Texto del tooltip">Hover me</button>
 * Con opciones: <button appTooltip="Texto" tooltipPosition="bottom" tooltipDelay="500">Hover</button>
 */
@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnDestroy {
  @Input() appTooltip = '';
  @Input() tooltipPosition: TooltipPosition = 'top';
  @Input() tooltipDelay = 300; // Delay en milisegundos

  private tooltipElement: HTMLElement | null = null;
  private arrowElement: HTMLElement | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  // Limpieza al destruir la directiva
  ngOnDestroy(): void {
    this.clearTimeouts();
    this.hideTooltip();
  }

  // Evento mouse: muestra tooltip al pasar el cursor (con delay)
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.clearTimeouts();
    this.showTimeout = setTimeout(() => {
      if (!this.tooltipElement) {
        this.showTooltip();
      }
    }, this.tooltipDelay);
  }

  // Evento mouse: oculta tooltip al salir el cursor
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.clearTimeouts();
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, 100);
  }

  // Evento focus: muestra tooltip cuando el elemento recibe foco (accesibilidad)
  @HostListener('focusin')
  onFocusIn(): void {
    this.clearTimeouts();
    this.showTimeout = setTimeout(() => {
      if (!this.tooltipElement) {
        this.showTooltip();
      }
    }, this.tooltipDelay);
  }

  // Evento focus: oculta tooltip cuando el elemento pierde el foco
  @HostListener('focusout')
  onFocusOut(): void {
    this.clearTimeouts();
    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, 100);
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  private showTooltip(): void {
    // Crear contenedor del tooltip
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.setProperty(this.tooltipElement, 'innerText', this.appTooltip);
    this.renderer.setAttribute(this.tooltipElement, 'role', 'tooltip');

    // Estilos base del tooltip
    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'backgroundColor', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '6px 12px');
    this.renderer.setStyle(this.tooltipElement, 'borderRadius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'fontSize', '13px');
    this.renderer.setStyle(this.tooltipElement, 'zIndex', '1000');
    this.renderer.setStyle(this.tooltipElement, 'whiteSpace', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
    this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s ease');

    // Crear flecha indicadora
    this.arrowElement = this.renderer.createElement('span');
    this.renderer.setStyle(this.arrowElement, 'position', 'absolute');
    this.renderer.setStyle(this.arrowElement, 'width', '0');
    this.renderer.setStyle(this.arrowElement, 'height', '0');

    // Aplicar posicionamiento segun la direccion
    this.applyPosition();

    // Asegurar que el elemento padre tiene position relative
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');

    // Anadir flecha al tooltip y tooltip al elemento
    this.renderer.appendChild(this.tooltipElement, this.arrowElement);
    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);

    // Animacion fade-in
    setTimeout(() => {
      if (this.tooltipElement) {
        this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
      }
    }, 10);
  }

  private applyPosition(): void {
    if (!this.tooltipElement || !this.arrowElement) return;

    const arrowSize = 6;

    switch (this.tooltipPosition) {
      case 'top':
        this.renderer.setStyle(this.tooltipElement, 'bottom', '100%');
        this.renderer.setStyle(this.tooltipElement, 'left', '50%');
        this.renderer.setStyle(this.tooltipElement, 'transform', 'translateX(-50%)');
        this.renderer.setStyle(this.tooltipElement, 'marginBottom', `${arrowSize + 2}px`);
        // Flecha apuntando hacia abajo
        this.renderer.setStyle(this.arrowElement, 'top', '100%');
        this.renderer.setStyle(this.arrowElement, 'left', '50%');
        this.renderer.setStyle(this.arrowElement, 'transform', 'translateX(-50%)');
        this.renderer.setStyle(this.arrowElement, 'borderLeft', `${arrowSize}px solid transparent`);
        this.renderer.setStyle(this.arrowElement, 'borderRight', `${arrowSize}px solid transparent`);
        this.renderer.setStyle(this.arrowElement, 'borderTop', `${arrowSize}px solid #333`);
        break;

      case 'bottom':
        this.renderer.setStyle(this.tooltipElement, 'top', '100%');
        this.renderer.setStyle(this.tooltipElement, 'left', '50%');
        this.renderer.setStyle(this.tooltipElement, 'transform', 'translateX(-50%)');
        this.renderer.setStyle(this.tooltipElement, 'marginTop', `${arrowSize + 2}px`);
        // Flecha apuntando hacia arriba
        this.renderer.setStyle(this.arrowElement, 'bottom', '100%');
        this.renderer.setStyle(this.arrowElement, 'left', '50%');
        this.renderer.setStyle(this.arrowElement, 'transform', 'translateX(-50%)');
        this.renderer.setStyle(this.arrowElement, 'borderLeft', `${arrowSize}px solid transparent`);
        this.renderer.setStyle(this.arrowElement, 'borderRight', `${arrowSize}px solid transparent`);
        this.renderer.setStyle(this.arrowElement, 'borderBottom', `${arrowSize}px solid #333`);
        break;

      case 'left':
        this.renderer.setStyle(this.tooltipElement, 'right', '100%');
        this.renderer.setStyle(this.tooltipElement, 'top', '50%');
        this.renderer.setStyle(this.tooltipElement, 'transform', 'translateY(-50%)');
        this.renderer.setStyle(this.tooltipElement, 'marginRight', `${arrowSize + 2}px`);
        // Flecha apuntando hacia la derecha
        this.renderer.setStyle(this.arrowElement, 'left', '100%');
        this.renderer.setStyle(this.arrowElement, 'top', '50%');
        this.renderer.setStyle(this.arrowElement, 'transform', 'translateY(-50%)');
        this.renderer.setStyle(this.arrowElement, 'borderTop', `${arrowSize}px solid transparent`);
        this.renderer.setStyle(this.arrowElement, 'borderBottom', `${arrowSize}px solid transparent`);
        this.renderer.setStyle(this.arrowElement, 'borderLeft', `${arrowSize}px solid #333`);
        break;

      case 'right':
        this.renderer.setStyle(this.tooltipElement, 'left', '100%');
        this.renderer.setStyle(this.tooltipElement, 'top', '50%');
        this.renderer.setStyle(this.tooltipElement, 'transform', 'translateY(-50%)');
        this.renderer.setStyle(this.tooltipElement, 'marginLeft', `${arrowSize + 2}px`);
        // Flecha apuntando hacia la izquierda
        this.renderer.setStyle(this.arrowElement, 'right', '100%');
        this.renderer.setStyle(this.arrowElement, 'top', '50%');
        this.renderer.setStyle(this.arrowElement, 'transform', 'translateY(-50%)');
        this.renderer.setStyle(this.arrowElement, 'borderTop', `${arrowSize}px solid transparent`);
        this.renderer.setStyle(this.arrowElement, 'borderBottom', `${arrowSize}px solid transparent`);
        this.renderer.setStyle(this.arrowElement, 'borderRight', `${arrowSize}px solid #333`);
        break;
    }
  }

  private hideTooltip(): void {
    if (this.tooltipElement) {
      // Animacion fade-out
      this.renderer.setStyle(this.tooltipElement, 'opacity', '0');
      setTimeout(() => {
        if (this.tooltipElement) {
          this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
          this.tooltipElement = null;
          this.arrowElement = null;
        }
      }, 200);
    }
  }
}
