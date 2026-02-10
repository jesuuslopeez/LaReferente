import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendInfoContainer } from './backend-info-container';

describe('BackendInfoContainer', () => {
  let component: BackendInfoContainer;
  let fixture: ComponentFixture<BackendInfoContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackendInfoContainer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackendInfoContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
