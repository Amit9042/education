import { TestBed } from '@angular/core/testing';

import { StudentEnrollService } from './student-enroll.service';

describe('StudentEnrollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentEnrollService = TestBed.get(StudentEnrollService);
    expect(service).toBeTruthy();
  });
});
