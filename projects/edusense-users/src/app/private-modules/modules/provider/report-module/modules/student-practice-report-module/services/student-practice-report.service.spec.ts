import { TestBed } from '@angular/core/testing';

import { StudentPracticeReportService } from './student-practice-report.service';

describe('StudentPracticeReportService', () => {
  let service: StudentPracticeReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentPracticeReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
