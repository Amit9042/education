import { TestBed } from '@angular/core/testing';

import { ProviderDeactivateGuard } from './provider-deactivate-guard.service';

describe('ProviderDeactivateGuardGuard', () => {
  let guard: ProviderDeactivateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProviderDeactivateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
