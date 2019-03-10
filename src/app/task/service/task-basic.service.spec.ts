import { TestBed } from '@angular/core/testing';

import { TaskBasicService } from './task-basic.service';

describe('TaskBasicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskBasicService = TestBed.get(TaskBasicService);
    expect(service).toBeTruthy();
  });
});
