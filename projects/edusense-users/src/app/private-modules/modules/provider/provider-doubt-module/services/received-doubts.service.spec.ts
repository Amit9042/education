import { TestBed } from '@angular/core/testing';

import { ReceivedDoubtsService } from './received-doubts.service';

describe('ReceivedDoubtsService', () => {
  let service: ReceivedDoubtsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceivedDoubtsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
