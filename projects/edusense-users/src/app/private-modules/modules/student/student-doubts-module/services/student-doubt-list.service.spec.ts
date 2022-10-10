import { TestBed } from '@angular/core/testing';

import { StudentDoubtListService } from './student-doubt-list.service';

describe('StudentDoubtListService', () => {
  let service: StudentDoubtListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentDoubtListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
