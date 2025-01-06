import { TestBed } from '@angular/core/testing';

import { PeoplesService } from './people.service';

describe('PeoplesService', () => {
  let service: PeoplesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeoplesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
