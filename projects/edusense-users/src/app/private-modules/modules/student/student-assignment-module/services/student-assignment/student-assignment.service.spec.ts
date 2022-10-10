import { TestBed } from '@angular/core/testing';

import { StudentAssignmentService } from './student-assignment.service';

describe('StudentAssignmentService', () => {
  let service: StudentAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentAssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
