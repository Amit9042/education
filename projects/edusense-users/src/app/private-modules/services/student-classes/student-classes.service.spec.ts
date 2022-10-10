import { TestBed } from '@angular/core/testing';

import { StudentClassesService } from './student-classes.service';

describe('StudentClassesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StudentClassesService = TestBed.get(StudentClassesService);
    expect(service).toBeTruthy();
  });
});
