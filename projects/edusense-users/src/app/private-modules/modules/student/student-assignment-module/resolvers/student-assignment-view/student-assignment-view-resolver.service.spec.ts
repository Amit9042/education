import { TestBed } from '@angular/core/testing';

import { StudentAssignmentViewResolverService } from './student-assignment-view-resolver.service';

describe('StudentAssignmentViewResolverService', () => {
  let service: StudentAssignmentViewResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentAssignmentViewResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
