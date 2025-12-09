import { Component, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

/**
 * Componente demostrativo de Tarea 1: Manipulación del DOM
 * Demuestra el uso de ViewChild, ElementRef y Renderer2
 */
@Component({
  selector: 'app-dom-example',
  imports: [],
  template: `
    <section>
      <h3>Tarea 1: Manipulación del DOM</h3>
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
export class DomExampleComponent implements AfterViewInit {
  @ViewChild('targetParagraph', { static: false }) targetParagraph!: ElementRef;
  @ViewChild('container', { static: false }) container!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    console.log('Acceso al DOM:', this.targetParagraph.nativeElement);
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
    this.renderer.setProperty(nuevoParrafo, 'innerText', 'Elemento creado dinámicamente');
    this.renderer.setStyle(nuevoParrafo, 'backgroundColor', 'lightblue');
    this.renderer.setStyle(nuevoParrafo, 'padding', '10px');
    this.renderer.setStyle(nuevoParrafo, 'margin', '5px 0');
    this.renderer.appendChild(this.container.nativeElement, nuevoParrafo);
  }

  eliminarElemento() {
    const primerHijo = this.container.nativeElement.firstChild;
    if (primerHijo) {
      this.renderer.removeChild(this.container.nativeElement, primerHijo);
    }
  }
}
