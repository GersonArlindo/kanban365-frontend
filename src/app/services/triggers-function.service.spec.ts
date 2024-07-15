import { TestBed } from '@angular/core/testing';

import { TriggersFunctionService } from './triggers-function.service';

describe('TriggersFunctionService', () => {
  let service: TriggersFunctionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TriggersFunctionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
