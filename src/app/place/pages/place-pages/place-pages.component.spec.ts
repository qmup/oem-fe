import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacePagesComponent } from './place-pages.component';

describe('PlacePagesComponent', () => {
  let component: PlacePagesComponent;
  let fixture: ComponentFixture<PlacePagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacePagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacePagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
