import { TestBed } from '@angular/core/testing';

import { ChapterManagementViewResolverService } from './chapter-management-view-resolver.service';

describe('ChapterManagementViewResolverService', () => {
  let service: ChapterManagementViewResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChapterManagementViewResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
