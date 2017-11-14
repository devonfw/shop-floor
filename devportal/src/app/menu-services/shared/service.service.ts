import { Injectable } from '@angular/core';

import { Service } from './service';
import { SERVICESLIST, MYSERVICES } from './mock-services';

@Injectable()
export class ServiceService {
    getServices(): Promise<Service[]> {
      return Promise.resolve(SERVICESLIST);
    }

    getMyServices(): Promise<Service[]> {
      return Promise.resolve(MYSERVICES);
    }
}
