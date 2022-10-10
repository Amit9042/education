import { TestBed } from '@angular/core/testing';

import { StudentAssignmentListResolverService } from './student-assignment-list-resolver.service';

describe('StudentAssignmentListResolverService', () => {
  let service: StudentAssignmentListResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentAssignmentListResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
