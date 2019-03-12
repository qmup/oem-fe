import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceRemoveComponent } from './place-remove.component';

describe('PlaceRemoveComponent', () => {
  let component: PlaceRemoveComponent;
  let fixture: ComponentFixture<PlaceRemoveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaceRemoveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
