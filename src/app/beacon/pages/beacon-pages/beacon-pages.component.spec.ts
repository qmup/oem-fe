import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeaconPagesComponent } from './beacon-pages.component';

describe('BeaconPagesComponent', () => {
  let component: BeaconPagesComponent;
  let fixture: ComponentFixture<BeaconPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeaconPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeaconPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
