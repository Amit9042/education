import { TestBed } from '@angular/core/testing';

import { AssignmentViewService } from './assignment-view.service';

describe('AssignmentViewService', () => {
  let service: AssignmentViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
