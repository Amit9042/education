import { TestBed } from '@angular/core/testing';

import { ChooseSubjectPracticeResolverService } from './choose-subject-practice-resolver.service';

describe('ChooseSubjectPracticeResolverService', () => {
  let service: ChooseSubjectPracticeResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChooseSubjectPracticeResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
