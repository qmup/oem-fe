import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonePagesComponent } from './zone-pages.component';

describe('ZonePagesComponent', () => {
  let component: ZonePagesComponent;
  let fixture: ComponentFixture<ZonePagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZonePagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonePagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
