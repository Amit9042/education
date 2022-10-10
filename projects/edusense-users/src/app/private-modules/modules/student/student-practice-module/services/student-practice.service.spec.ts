import { TestBed } from '@angular/core/testing';

import { StudentPracticeService } from './student-practice.service';

describe('StudentPracticeService', () => {
  let service: StudentPracticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentPracticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
