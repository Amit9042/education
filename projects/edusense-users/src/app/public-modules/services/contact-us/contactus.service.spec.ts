/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ContactusService } from './contactus.service';

describe('Service: Contactus', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactusService]
    });
  });

  it('should ...', inject([ContactusService], (service: ContactusService) => {
    expect(service).toBeTruthy();
  }));
});
