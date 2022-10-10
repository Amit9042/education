import { TestBed } from '@angular/core/testing';

import { StudentSubmittedAssignmentViewService } from './student-submitted-assignment-view.service';

describe('StudentSubmittedAssignmentViewService', () => {
  let service: StudentSubmittedAssignmentViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentSubmittedAssignmentViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
