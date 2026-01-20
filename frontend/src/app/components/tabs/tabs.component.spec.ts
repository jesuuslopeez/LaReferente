import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 3 tab buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabButtons = compiled.querySelectorAll('[role="tab"]');
    expect(tabButtons.length).toBe(3);
  });

  it('should start with first tab active', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const activeTab = compiled.querySelector('.active');
    expect(activeTab?.textContent?.trim()).toBe('Detalles');
  });

  it('should show first panel content by default', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const panel = compiled.querySelector('[role="tabpanel"]');
    expect(panel?.getAttribute('id')).toBe('panel-detalles');
  });

  it('should change active tab when clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const especButton = compiled.querySelector('#tab-especificaciones') as HTMLButtonElement;

    especButton.click();
    fixture.detectChanges();

    expect(especButton.classList.contains('active')).toBe(true);
    expect(especButton.getAttribute('aria-selected')).toBe('true');
  });

  it('should show correct panel content when tab changes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const especButton = compiled.querySelector('#tab-especificaciones') as HTMLButtonElement;

    especButton.click();
    fixture.detectChanges();

    const panel = compiled.querySelector('[role="tabpanel"]');
    expect(panel?.getAttribute('id')).toBe('panel-especificaciones');
  });

  it('should have proper ARIA attributes on tabs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tabButtons = compiled.querySelectorAll('[role="tab"]');

    tabButtons.forEach((tab) => {
      expect(tab.getAttribute('aria-controls')).toContain('panel-');
      expect(tab.getAttribute('id')).toContain('tab-');
    });
  });

  it('should have tablist role on navigation', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const tablist = compiled.querySelector('[role="tablist"]');
    expect(tablist).toBeTruthy();
  });

  it('should set tabindex correctly for roving tabindex pattern', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const activeTab = compiled.querySelector('#tab-detalles');
    const inactiveTab = compiled.querySelector('#tab-especificaciones');

    expect(activeTab?.getAttribute('tabindex')).toBe('0');
    expect(inactiveTab?.getAttribute('tabindex')).toBe('-1');
  });

  it('should update tabindex when changing tabs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const especButton = compiled.querySelector('#tab-especificaciones') as HTMLButtonElement;

    especButton.click();
    fixture.detectChanges();

    const detallesTab = compiled.querySelector('#tab-detalles');
    expect(detallesTab?.getAttribute('tabindex')).toBe('-1');
    expect(especButton.getAttribute('tabindex')).toBe('0');
  });

  it('should show opinions panel when third tab is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const opinionesButton = compiled.querySelector('#tab-opiniones') as HTMLButtonElement;

    opinionesButton.click();
    fixture.detectChanges();

    const panel = compiled.querySelector('[role="tabpanel"]');
    expect(panel?.getAttribute('id')).toBe('panel-opiniones');
    expect(panel?.textContent).toContain('Opiniones de Clientes');
  });
});
