import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCalendarPagesComponent } from './task-calendar-pages.component';

describe('TaskCalendarPagesComponent', () => {
  let component: TaskCalendarPagesComponent;
  let fixture: ComponentFixture<TaskCalendarPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCalendarPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCalendarPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
