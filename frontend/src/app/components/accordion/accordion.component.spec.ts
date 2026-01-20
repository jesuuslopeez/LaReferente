import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AccordionComponent } from './accordion.component';

describe('AccordionComponent', () => {
  let component: AccordionComponent;
  let fixture: ComponentFixture<AccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccordionComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all accordion items', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.accordion__item');
    expect(items.length).toBe(4);
  });

  it('should start with no items open', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const openPanels = compiled.querySelectorAll('.accordion__panel--open');
    expect(openPanels.length).toBe(0);
  });

  it('should open item when header is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstButton = compiled.querySelector('.accordion__header') as HTMLButtonElement;

    firstButton.click();
    fixture.detectChanges();

    const openPanels = compiled.querySelectorAll('.accordion__panel--open');
    expect(openPanels.length).toBe(1);
    expect(firstButton.getAttribute('aria-expanded')).toBe('true');
  });

  it('should close item when clicking same header twice', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstButton = compiled.querySelector('.accordion__header') as HTMLButtonElement;

    firstButton.click();
    fixture.detectChanges();

    firstButton.click();
    fixture.detectChanges();

    const openPanels = compiled.querySelectorAll('.accordion__panel--open');
    expect(openPanels.length).toBe(0);
    expect(firstButton.getAttribute('aria-expanded')).toBe('false');
  });

  it('should close previous item when opening another', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.accordion__header') as NodeListOf<HTMLButtonElement>;

    buttons[0].click();
    fixture.detectChanges();

    buttons[1].click();
    fixture.detectChanges();

    const openPanels = compiled.querySelectorAll('.accordion__panel--open');
    expect(openPanels.length).toBe(1);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    expect(buttons[1].getAttribute('aria-expanded')).toBe('true');
  });

  it('should have proper accessibility attributes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('.accordion__header');

    buttons.forEach((button, index) => {
      expect(button.getAttribute('aria-controls')).toContain('panel-');
      expect(button.getAttribute('id')).toContain('header-');
      expect(button.getAttribute('type')).toBe('button');
    });
  });

  it('should have aria-labelledby on panels', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const panels = compiled.querySelectorAll('.accordion__panel');

    panels.forEach((panel) => {
      expect(panel.getAttribute('aria-labelledby')).toContain('header-');
      expect(panel.getAttribute('role')).toBe('region');
    });
  });

  it('should rotate icon when item is open', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const firstButton = compiled.querySelector('.accordion__header') as HTMLButtonElement;

    firstButton.click();
    fixture.detectChanges();

    const icon = compiled.querySelector('.accordion__icon--open');
    expect(icon).toBeTruthy();
  });
});
