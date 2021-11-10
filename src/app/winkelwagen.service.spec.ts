import { TestBed } from '@angular/core/testing';

import { WinkelwagenService } from './winkelwagen.service';

describe('WinkelwagenService', () => {
  let service: WinkelwagenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WinkelwagenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
