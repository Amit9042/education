import { TestBed } from '@angular/core/testing';

import { StudentProfileResolverService } from './student-profile-resolver.service';

describe('StudentProfileResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentProfileResolverService = TestBed.get(StudentProfileResolverService);
    expect(service).toBeTruthy();
  });
});
