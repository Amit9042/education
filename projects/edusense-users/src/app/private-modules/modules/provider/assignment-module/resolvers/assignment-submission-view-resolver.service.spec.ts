import { TestBed } from '@angular/core/testing';

import { AssignmentSubmissionViewResolverService } from './assignment-submission-view-resolver.service';

describe('AssignmentSubmissionViewResolverService', () => {
  let service: AssignmentSubmissionViewResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentSubmissionViewResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
