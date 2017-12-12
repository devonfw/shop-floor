import { Injectable } from '@angular/core';
import { OpenShiftService } from './openshift.service';
import { RouteNameAndNamespace } from './models';

@Injectable()
export class DeleteAppService {

  constructor(
    private osservice: OpenShiftService,
  ) { }

  deleteApp(name: string, namespace: string): Promise<boolean> {
    let deleted = true;
    const params: RouteNameAndNamespace = {
      'name': name,
      'namespace': namespace,
    };
    this.osservice.deleteBuildConfig(params).subscribe(data => {
     }, error => {
      deleted = false;
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
    this.osservice.deleteImageStream(params).subscribe(data => { }, error => {
      deleted = false;
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
    this.osservice.deleteDeploymentConfig(params).subscribe(data => {
    }, error => {
      deleted = false;
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
    this.osservice.deleteRoute(params).subscribe(data => {
    }, error => {
      deleted = false;
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
    this.osservice.deleteService(params).subscribe(data => {
    }, error => {
      deleted = false;
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
    return Promise.resolve(deleted);
  }
}
