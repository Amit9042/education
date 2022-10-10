import { TestBed } from '@angular/core/testing';

import { ProviderRecordingService } from './provider-recording.service';

describe('ProviderRecordingService', () => {
  let service: ProviderRecordingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderRecordingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
