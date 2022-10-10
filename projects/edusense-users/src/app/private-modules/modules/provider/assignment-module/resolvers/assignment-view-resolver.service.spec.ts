import { TestBed } from '@angular/core/testing';

import { AssignmentViewResolverService } from './assignment-view-resolver.service';

describe('AssignmentViewResolverService', () => {
  let service: AssignmentViewResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentViewResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
