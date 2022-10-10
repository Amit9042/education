import { TestBed } from '@angular/core/testing';

import { StudentAutenticationService } from './student-autentication.service';

describe('StudentAutenticationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentAutenticationService = TestBed.get(StudentAutenticationService);
    expect(service).toBeTruthy();
  });
});
