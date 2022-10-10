import { TestBed } from '@angular/core/testing';

import { StudentProfileResolverService } from './student-profile-resolver.service';

describe('StudentProfileResolverService', () => {
  let service: StudentProfileResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentProfileResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
