import { TestBed, inject } from '@angular/core/testing';

import { CicdServicesService } from './cicd-services.service';

describe('CicdServicesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CicdServicesService]
    });
  });

  it('should be created', inject([CicdServicesService], (service: CicdServicesService) => {
    expect(service).toBeTruthy();
  }));
});
