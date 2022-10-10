import { TestBed } from '@angular/core/testing';

import { StudentForgotPasswordService } from './student-forgot-password.service';

describe('StudentForgotPasswordService', () => {
  let service: StudentForgotPasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentForgotPasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
