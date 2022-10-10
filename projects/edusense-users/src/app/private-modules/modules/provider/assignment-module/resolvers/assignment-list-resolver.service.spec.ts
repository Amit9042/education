import { TestBed } from '@angular/core/testing';

import { AssignmentListResolverService } from './assignment-list-resolver.service';

describe('AssignmentListResolverService', () => {
  let service: AssignmentListResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentListResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
