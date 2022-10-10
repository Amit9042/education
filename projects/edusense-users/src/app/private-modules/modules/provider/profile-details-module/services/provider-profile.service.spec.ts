import { TestBed } from '@angular/core/testing';

import { ProviderProfileService } from './provider-profile.service';

describe('ProviderProfileService', () => {
  let service: ProviderProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
