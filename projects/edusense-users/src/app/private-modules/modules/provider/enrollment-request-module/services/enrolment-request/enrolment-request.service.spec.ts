import { TestBed } from '@angular/core/testing';

import { EnrolmentRequestService } from './enrolment-request.service';

describe('StudentEnrollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrolmentRequestService = TestBed.get(EnrolmentRequestService);
    expect(service).toBeTruthy();
  });
});
