import { TestBed, inject } from '@angular/core/testing';

import { MyServicesService } from './my-services.service';

describe('MyServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyServicesService]
    });
  });

  it('should be created', inject([MyServicesService], (service: MyServicesService) => {
    expect(service).toBeTruthy();
  }));
});
