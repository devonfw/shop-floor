import { Injectable } from '@angular/core';

import { Service } from './service';
import { OpenShiftService } from './openshift.service';
import { RouteNamespace } from './models';

@Injectable()
export class MyServicesService {

  constructor(
    private osservice: OpenShiftService,
  ) { }

  getMYservices(): Promise<Service[]> {
    return new Promise((resolve, reject) => {
      const myservices: Service[] = [];
      this.osservice.requestAllProjects().subscribe(ProjectList => {
        const route: RouteNamespace = {
          'namespace': '',
        };
        for (let i = 0; i < ProjectList['items'].length; i++) {
          route['namespace'] = ProjectList['items'][i]['metadata']['name'];
          this.osservice.requestAllRoutes(route).subscribe(RouteList => {
            for (let j = 0; j < RouteList['items'].length; j++) {
              const service = {
                'name': RouteList['items'][j]['spec']['to']['name'],
                'project': ProjectList['items'][i]['metadata']['annotations']['openshift.io/display-name'],
                'namespace': route['namespace'],
                'image': '',
                'urlLink': RouteList['items'][j]['spec']['host'],
                'status': ''
              };
              myservices.push(service);
            }
          }, error => {
            reject(this.osservice.analizeError(error));
          });
        }
        resolve(myservices);
      }, error => {
        reject(this.osservice.analizeError(error));
      });
    });
  }
}
