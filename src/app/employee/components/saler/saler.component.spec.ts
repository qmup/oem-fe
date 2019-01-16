import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalerComponent } from './saler.component';

describe('SalerComponent', () => {
  let component: SalerComponent;
  let fixture: ComponentFixture<SalerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
