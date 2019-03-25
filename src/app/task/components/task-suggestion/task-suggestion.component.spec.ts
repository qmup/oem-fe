import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSuggestionComponent } from './task-suggestion.component';

describe('TaskSuggestionComponent', () => {
  let component: TaskSuggestionComponent;
  let fixture: ComponentFixture<TaskSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
