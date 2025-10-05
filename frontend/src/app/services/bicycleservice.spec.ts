import { TestBed } from '@angular/core/testing';

import { Bicycleservice } from './bicycleservice';

describe('Bicycleservice', () => {
  let service: Bicycleservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Bicycleservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
