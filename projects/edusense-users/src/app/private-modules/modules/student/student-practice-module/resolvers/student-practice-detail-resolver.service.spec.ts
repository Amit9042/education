import { TestBed } from '@angular/core/testing';

import { StudentPracticeDetailResolverService } from './student-practice-detail-resolver.service';

describe('StudentPracticeDetailResolverService', () => {
  let service: StudentPracticeDetailResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentPracticeDetailResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
