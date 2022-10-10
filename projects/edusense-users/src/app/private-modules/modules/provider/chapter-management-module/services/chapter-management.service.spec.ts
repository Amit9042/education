import { TestBed } from '@angular/core/testing';

import { ChapterManagementService } from './chapter-management.service';

describe('ChapterManagementService', () => {
  let service: ChapterManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChapterManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
