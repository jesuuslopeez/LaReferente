import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';

/**
 * Componente demostrativo de Tarea 1: Manipulacion del DOM
 * Demuestra el uso de ViewChild, ElementRef, Renderer2 y limpieza en ngOnDestroy
 */
@Component({
  selector: 'app-dom-example',
  imports: [],
  template: `
    <section>
      <h3>Tarea 1: Manipulacion del DOM</h3>
      <p #targetParagraph>Contenido inicial</p>
      <article #container></article>

      <button (click)="cambiarEstilo()">Cambiar Estilo</button>
      <button (click)="cambiarTexto()">Cambiar Texto</button>
      <button (click)="crearElemento()">Crear Elemento</button>
      <button (click)="eliminarElemento()">Eliminar Elemento</button>
    </section>
  `,
  styles: []
})
export class DomExampleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('targetParagraph', { static: false }) targetParagraph!: ElementRef;
  @ViewChild('container', { static: false }) container!: ElementRef;

  // Guardamos referencia a los elementos creados para poder limpiarlos
  private elementosCreados: HTMLElement[] = [];

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    console.log('Acceso al DOM:', this.targetParagraph.nativeElement);
  }

  // Limpieza de elementos creados al destruir el componente
  ngOnDestroy() {
    this.elementosCreados.forEach(elemento => {
      if (elemento.parentNode) {
        this.renderer.removeChild(elemento.parentNode, elemento);
      }
    });
    this.elementosCreados = [];
  }

  cambiarEstilo() {
    this.renderer.setStyle(this.targetParagraph.nativeElement, 'color', 'red');
    this.renderer.setStyle(this.targetParagraph.nativeElement, 'fontSize', '20px');
    this.renderer.setStyle(this.targetParagraph.nativeElement, 'fontWeight', 'bold');
  }

  cambiarTexto() {
    this.renderer.setProperty(this.targetParagraph.nativeElement, 'innerText', 'Texto modificado con Renderer2');
  }

  crearElemento() {
    const nuevoParrafo = this.renderer.createElement('p');
    this.renderer.setProperty(nuevoParrafo, 'innerText', 'Elemento creado dinamicamente');
    this.renderer.setStyle(nuevoParrafo, 'backgroundColor', 'lightblue');
    this.renderer.setStyle(nuevoParrafo, 'padding', '10px');
    this.renderer.setStyle(nuevoParrafo, 'margin', '5px 0');
    this.renderer.appendChild(this.container.nativeElement, nuevoParrafo);

    // Guardamos referencia para limpieza
    this.elementosCreados.push(nuevoParrafo);
  }

  eliminarElemento() {
    const primerHijo = this.container.nativeElement.firstChild;
    if (primerHijo) {
      this.renderer.removeChild(this.container.nativeElement, primerHijo);
      // Quitamos de la lista de elementos creados
      const index = this.elementosCreados.indexOf(primerHijo);
      if (index > -1) {
        this.elementosCreados.splice(index, 1);
      }
    }
  }
}
