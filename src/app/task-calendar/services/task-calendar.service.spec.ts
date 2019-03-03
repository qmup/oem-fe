import { TestBed } from '@angular/core/testing';

import { TaskCalendarService } from './task-calendar.service';

describe('TaskCalendarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskCalendarService = TestBed.get(TaskCalendarService);
    expect(service).toBeTruthy();
  });
});
