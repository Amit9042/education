import { TestBed } from '@angular/core/testing';

import { AttendanceViewResolverService } from './attendance-view-resolver.service';

describe('AttendanceViewResolverService', () => {
  let service: AttendanceViewResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttendanceViewResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
