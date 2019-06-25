import { TestBed, inject } from '@angular/core/testing';

import { AirtimeService } from './airtime.service';

describe('AirtimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AirtimeService]
    });
  });

  it('should ...', inject([AirtimeService], (service: AirtimeService) => {
    expect(service).toBeTruthy();
  }));
});
