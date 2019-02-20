import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePagesComponent } from './schedule-pages.component';

describe('SchedulePagesComponent', () => {
  let component: SchedulePagesComponent;
  let fixture: ComponentFixture<SchedulePagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulePagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulePagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
