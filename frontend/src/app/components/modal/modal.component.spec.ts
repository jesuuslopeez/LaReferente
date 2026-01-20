import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with modal closed', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const modal = compiled.querySelector('.modal-backdrop');
    expect(modal).toBeNull();
  });

  it('should render open button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Abrir Modal');
  });

  it('should open modal when button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const modal = compiled.querySelector('.modal-backdrop');
    expect(modal).toBeTruthy();
  });

  it('should show modal content when open', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const content = compiled.querySelector('.modal-content');
    expect(content).toBeTruthy();
    expect(content?.querySelector('h2')?.textContent).toBe('Modal de Ejemplo');
  });

  it('should have proper ARIA attributes on modal', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;

    button.click();
    fixture.detectChanges();

    const modal = compiled.querySelector('.modal-content');
    expect(modal?.getAttribute('role')).toBe('dialog');
    expect(modal?.getAttribute('aria-modal')).toBe('true');
  });

  it('should close modal when close button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const openButton = compiled.querySelector('button') as HTMLButtonElement;

    openButton.click();
    fixture.detectChanges();

    const closeButton = compiled.querySelector('[aria-label="Cerrar modal"]') as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();

    const modal = compiled.querySelector('.modal-backdrop');
    expect(modal).toBeNull();
  });

  it('should close modal when backdrop is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const openButton = compiled.querySelector('button') as HTMLButtonElement;

    openButton.click();
    fixture.detectChanges();

    const backdrop = compiled.querySelector('.modal-backdrop') as HTMLElement;
    backdrop.click();
    fixture.detectChanges();

    const modal = compiled.querySelector('.modal-backdrop');
    expect(modal).toBeNull();
  });

  it('should not close modal when clicking inside content', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const openButton = compiled.querySelector('button') as HTMLButtonElement;

    openButton.click();
    fixture.detectChanges();

    const content = compiled.querySelector('.modal-content') as HTMLElement;
    content.click();
    fixture.detectChanges();

    const modal = compiled.querySelector('.modal-backdrop');
    expect(modal).toBeTruthy();
  });

  it('should close modal when ESC is pressed', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const openButton = compiled.querySelector('button') as HTMLButtonElement;

    openButton.click();
    fixture.detectChanges();

    // Trigger the HostListener for escape key
    component.onEscapePress();
    fixture.detectChanges();

    const modal = compiled.querySelector('.modal-backdrop');
    expect(modal).toBeNull();
  });

  it('should have close button in footer', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const openButton = compiled.querySelector('button') as HTMLButtonElement;

    openButton.click();
    fixture.detectChanges();

    const footer = compiled.querySelector('footer');
    const closeButton = footer?.querySelector('button');
    expect(closeButton?.textContent?.trim()).toBe('Cerrar');
  });

  it('should close modal when footer close button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const openButton = compiled.querySelector('button') as HTMLButtonElement;

    openButton.click();
    fixture.detectChanges();

    const footer = compiled.querySelector('footer');
    const closeButton = footer?.querySelector('button') as HTMLButtonElement;
    closeButton.click();
    fixture.detectChanges();

    const modal = compiled.querySelector('.modal-backdrop');
    expect(modal).toBeNull();
  });
});
