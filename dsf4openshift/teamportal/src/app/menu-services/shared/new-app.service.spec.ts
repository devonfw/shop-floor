import { TestBed, inject } from '@angular/core/testing';

import { NewAppService } from './new-app.service';

describe('NewAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewAppService]
    });
  });

  it('should be created', inject([NewAppService], (service: NewAppService) => {
    expect(service).toBeTruthy();
  }));
});
