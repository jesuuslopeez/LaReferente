import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

/**
 * Directiva Tooltip que muestra información al pasar el mouse o al recibir foco
 * Demuestra: eventos mouse (mouseenter, mouseleave), eventos focus (focusin, focusout),
 * creación dinámica de elementos con Renderer2
 *
 * Uso: <button appTooltip="Texto del tooltip">Hover me</button>
 */
@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input() appTooltip = '';
  private tooltipElement: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  // Evento mouse: muestra tooltip al pasar el cursor
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.tooltipElement) {
      this.showTooltip();
    }
  }

  // Evento mouse: oculta tooltip al salir el cursor
  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.tooltipElement) {
      this.hideTooltip();
    }
  }

  // Evento focus: muestra tooltip cuando el elemento recibe foco (accesibilidad)
  @HostListener('focusin')
  onFocusIn(): void {
    if (!this.tooltipElement) {
      this.showTooltip();
    }
  }

  // Evento focus: oculta tooltip cuando el elemento pierde el foco
  @HostListener('focusout')
  onFocusOut(): void {
    if (this.tooltipElement) {
      this.hideTooltip();
    }
  }

  private showTooltip(): void {
    this.tooltipElement = this.renderer.createElement('span');
    this.renderer.setProperty(this.tooltipElement, 'innerText', this.appTooltip);

    this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
    this.renderer.setStyle(this.tooltipElement, 'backgroundColor', '#333');
    this.renderer.setStyle(this.tooltipElement, 'color', 'white');
    this.renderer.setStyle(this.tooltipElement, 'padding', '5px 10px');
    this.renderer.setStyle(this.tooltipElement, 'borderRadius', '4px');
    this.renderer.setStyle(this.tooltipElement, 'fontSize', '14px');
    this.renderer.setStyle(this.tooltipElement, 'zIndex', '1000');
    this.renderer.setStyle(this.tooltipElement, 'whiteSpace', 'nowrap');
    this.renderer.setStyle(this.tooltipElement, 'bottom', '100%');
    this.renderer.setStyle(this.tooltipElement, 'left', '50%');
    this.renderer.setStyle(this.tooltipElement, 'transform', 'translateX(-50%)');
    this.renderer.setStyle(this.tooltipElement, 'marginBottom', '5px');

    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);
  }

  private hideTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
