import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPagesComponent } from './task-pages.component';

describe('TaskPagesComponent', () => {
  let component: TaskPagesComponent;
  let fixture: ComponentFixture<TaskPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
