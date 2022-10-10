import { TestBed } from '@angular/core/testing';

import { AllDoubtService } from './all-doubt.service';

describe('AllDoubtService', () => {
  let service: AllDoubtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllDoubtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
