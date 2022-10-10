import { TestBed } from '@angular/core/testing';

import { StudentBookmarkQuestionResolverService } from './student-bookmark-question-resolver.service';

describe('StudentBookmarkQuestionResolverService', () => {
  let service: StudentBookmarkQuestionResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentBookmarkQuestionResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
