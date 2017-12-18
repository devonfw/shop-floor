import { Injectable } from '@angular/core';
import { Service } from './service';
import { OpenShiftService } from './openshift.service';

@Injectable()
export class CicdServicesService {

  constructor(
    private osservice: OpenShiftService,
  ) { }

  getCICDservices(): Promise<Service[]> {
    return new Promise((resolve, reject) => {
      const cicdServices: Service[] = [];
      this.osservice.getCICDservices().then(RouteList => {
        for (let i = 0; i < RouteList['items'].length; i++) {
            if ('teamportal' !== RouteList['items'][i]['spec']['to']['name']) {
                const service = {
                'name': RouteList['items'][i]['spec']['to']['name'],
                'project': 'DevonFW',
                'namespace': 'devonfw',
                'image': '',
                'urlLink': RouteList['items'][i]['spec']['host'],
                'status': ''
                };
                cicdServices.push(service);
            }
        }
        resolve(cicdServices);
      }, error => {
        reject(this.osservice.analizeError(error));
      });
    });
  }
}
