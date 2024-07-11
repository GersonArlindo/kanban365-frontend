import { TestBed } from '@angular/core/testing';

import { GhlApiKeyService } from './ghl-api-key.service';

describe('GhlApiKeyService', () => {
  let service: GhlApiKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GhlApiKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
