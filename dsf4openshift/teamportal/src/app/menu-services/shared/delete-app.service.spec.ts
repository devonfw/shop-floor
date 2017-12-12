import { TestBed, inject } from '@angular/core/testing';

import { DeleteAppService } from './delete-app.service';

describe('DeleteAppService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeleteAppService]
    });
  });

  it('should be created', inject([DeleteAppService], (service: DeleteAppService) => {
    expect(service).toBeTruthy();
  }));
});
