import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaborerComponent } from './laborer.component';

describe('LaborerComponent', () => {
  let component: LaborerComponent;
  let fixture: ComponentFixture<LaborerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaborerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaborerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
