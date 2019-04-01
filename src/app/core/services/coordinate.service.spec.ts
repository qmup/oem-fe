import { TestBed } from '@angular/core/testing';

import { CoordinateService } from './coordinate.service';

describe('CoordinateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoordinateService = TestBed.get(CoordinateService);
    expect(service).toBeTruthy();
  });
});
