import { TestBed } from '@angular/core/testing';

import { ChapterManagementListResolverService } from './chapter-management-list-resolver.service';

describe('ChapterManagementListResolverService', () => {
  let service: ChapterManagementListResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChapterManagementListResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
