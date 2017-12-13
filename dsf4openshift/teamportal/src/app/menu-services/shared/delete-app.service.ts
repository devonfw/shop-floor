import { Injectable } from '@angular/core';
import { OpenShiftService } from './openshift.service';
import { RouteNameAndNamespace } from './models';

@Injectable()
export class DeleteAppService {

  constructor(
    private osservice: OpenShiftService,
  ) { }

  deleteApp(name: string, namespace: string): Promise<boolean> {
    let deleted = true; // TODO: This must be changed by a real variable.
    const params: RouteNameAndNamespace = {
      'name': name,
      'namespace': namespace,
    };
    this.deleteBuildConfig(params);
    this.deleteImageStream(params);
    this.deleteDeploymentConfig(params);
    this.deleteRoute(params);
    this.deleteService(params);
    return Promise.resolve(deleted);
  }

  private deleteBuildConfig(params) {
    this.osservice.deleteBuildConfig(params).subscribe(data => {
    }, error => {
      this.osservice.analizeError(error);
   });
  }

  private deleteImageStream(params) {
    this.osservice.deleteImageStream(params).subscribe(data => {
    }, error => {
      this.osservice.analizeError(error);
    });
  }

  private deleteDeploymentConfig(params) {
    this.osservice.deleteDeploymentConfig(params).subscribe(data => {
    }, error => {
      this.osservice.analizeError(error);
    });
  }

  private deleteRoute(params) {
    this.osservice.deleteRoute(params).subscribe(data => {
    }, error => {
      this.osservice.analizeError(error);
    });
  }

  private deleteService(params) {
    this.osservice.deleteService(params).subscribe(data => {
    }, error => {
      this.osservice.analizeError(error);
    });
  }
}
