import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendInfoPresent } from './backend-info-present';

describe('BackendInfoPresent', () => {
  let component: BackendInfoPresent;
  let fixture: ComponentFixture<BackendInfoPresent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackendInfoPresent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackendInfoPresent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
