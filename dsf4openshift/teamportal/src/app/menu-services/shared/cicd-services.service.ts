import { Injectable } from '@angular/core';
import { Service } from './service';
import { OpenShiftService } from './openshift.service';

@Injectable()
export class CicdServicesService {

  constructor(
    private osservice: OpenShiftService,
  ) { }

  getCICDservices(): Promise<Service[]> {
    return this.osservice.getCICDservices();
  }

}
