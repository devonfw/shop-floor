import { Injectable } from '@angular/core';

import { Service } from './service';
import { SERVICESLIST } from './mock-services';

@Injectable()
export class ServiceService {
    getServices(): Promise<Service[]> {
    return Promise.resolve(SERVICESLIST);
  }
}
