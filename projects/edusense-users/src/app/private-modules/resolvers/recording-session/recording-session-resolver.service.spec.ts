import { TestBed } from '@angular/core/testing';

import { RecordingSessionResolver } from './recording-session.service';

describe('RecordingSessionResolver', () => {
  let service: RecordingSessionResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordingSessionResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
