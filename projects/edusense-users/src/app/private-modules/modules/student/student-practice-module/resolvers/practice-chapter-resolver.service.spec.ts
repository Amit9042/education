import { TestBed } from '@angular/core/testing';

import { PracticeChapterResolverService } from './practice-chapter-resolver.service';

describe('PracticeChapterResolverService', () => {
  let service: PracticeChapterResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticeChapterResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
