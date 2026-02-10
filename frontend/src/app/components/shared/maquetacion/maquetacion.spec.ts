import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maquetacion } from './maquetacion';

describe('Maquetacion', () => {
  let component: Maquetacion;
  let fixture: ComponentFixture<Maquetacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maquetacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Maquetacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
