import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiwPage } from './diw-page';

describe('DiwPage', () => {
  let component: DiwPage;
  let fixture: ComponentFixture<DiwPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiwPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiwPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
