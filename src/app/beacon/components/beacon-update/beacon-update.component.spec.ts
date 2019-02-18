import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeaconUpdateComponent } from './beacon-update.component';

describe('BeaconUpdateComponent', () => {
  let component: BeaconUpdateComponent;
  let fixture: ComponentFixture<BeaconUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeaconUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeaconUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
