import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceTaskBasicComponent } from './place-task-basic.component';

describe('PlaceTaskBasicComponent', () => {
  let component: PlaceTaskBasicComponent;
  let fixture: ComponentFixture<PlaceTaskBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceTaskBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceTaskBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
