import { TestBed } from '@angular/core/testing';

import { StudentSignupService } from './student-signup.service';

describe('StudentSignupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentSignupService = TestBed.get(StudentSignupService);
    expect(service).toBeTruthy();
  });
});
