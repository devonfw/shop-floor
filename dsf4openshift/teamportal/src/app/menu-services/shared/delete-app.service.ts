import { Injectable } from '@angular/core';
import { OpenShiftService } from './openshift.service';
import { RouteNameAndNamespace, RouteNamespace } from './models';

@Injectable()
export class DeleteAppService {

  constructor(
    private osservice: OpenShiftService,
  ) { }

  /**
   * This function search all the things that refer to the app in Openshift and delete it
   * 
   * @param name The name of the App
   * @param namespace The namespace where is the app in openshift
   */
  public async deleteApp(name: string, namespace: string): Promise<any> {
    const errors = [];
    const promises: Promise<any>[] = [];
    const params: RouteNameAndNamespace = {
      'name': name,
      'namespace': namespace,
    };

    promises.push(this.deleteBuildConfig(params).then(deleted => {
      // console.log(deleted + ' deleted');
    }, error => {
      errors.push(this.osservice.analizeError(error));
    }));
    promises.push(this.deleteImageStream(params).then(deleted => {
      // console.log('ImageStream ' + deleted + ' deleted');
    }, error => {
      errors.push(this.osservice.analizeError(error));
    }));
    promises.push(this.deleteDeploymentConfig(params).then(deleted => {
      // console.log('DeploymentConfig ' + deleted + ' deleted');
    }, error => {
      errors.push(this.osservice.analizeError(error));
    }));
    promises.push(this.deleteRoute(params).then(deleted => {
      // console.log('Route ' + deleted + ' deleted');
    }, error => {
      errors.push(this.osservice.analizeError(error));
    }));
    promises.push(this.deleteService(params).then(deleted => {
      // console.log('Service ' + deleted + ' deleted');
    }, error => {
      errors.push(this.osservice.analizeError(error));
    }));
    promises.push(this.deletePods(params).then(deleted => {
      // console.log(deleted);
    }, error => {
      errors.push(this.osservice.analizeError(error));
    }));
    promises.push(this.deleteBuilds(params).then(deleted => {
      // console.log(deleted);
    }, error => {
      errors.push(this.osservice.analizeError(error));
    }));

    await Promise.all(promises);

    return new Promise((resolve, reject) => {
      if (errors.length === 0) {
        resolve('App Deleted');
      } else {
        reject(errors);
      }
    });
  }

  private deleteBuildConfig(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.deleteBuildConfig(params).subscribe(deleted => {
        resolve(deleted['kind']);
      }, error => {
        reject(error);
      });
    });
  }

  private deleteImageStream(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.deleteImageStream(params).subscribe(deleted => {
        resolve(deleted['kind']);
      }, error => {
        reject(error);
      });
    });
  }

  private deleteDeploymentConfig(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.deleteDeploymentConfig(params).subscribe(deleted => {
        resolve(deleted['kind']);
      }, error => {
        reject(error);
      });
    });
  }

  private deleteRoute(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.deleteRoute(params).subscribe(deleted => {
        resolve(deleted['kind']);
      }, error => {
        reject(error);
      });
    });
  }

  private deleteService(params): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.deleteService(params).subscribe(deleted => {
        resolve(deleted['kind']);
      }, error => {
        reject(error);
      });
    });
  }

  private async deleteBuilds(params): Promise<any> {
    const route: RouteNamespace = {
      'namespace': params.namespace,
    };

    return new Promise((resolve, reject) => {
      this.osservice.requestAllBuilds(route).subscribe(buildList => {
        this.deleteBuildList(buildList, params).then(deleted => {
          resolve(deleted);
        }, error => {
          // TODO: Care its a list of errors
          reject(error);
        });
      }, error => {
        reject(error);
      });
    });
  }

  private async deleteBuildList(buildList, params) {
    const errors = [];
    const promises: Promise<any>[] = [];

    const buildParams: RouteNameAndNamespace = {
      'name': '',
      'namespace': params.namespace,
    };

    for (let i = 0; i < buildList['items'].length; i++) {
      if (buildList['items'][i]['metadata']['name'].search(params.name) >= 0) {
        buildParams.name = buildList['items'][i]['metadata']['name'];
        promises.push(this.deleteBuild(buildParams).then(deleted => {
          // console.log('Build ' + deleted['kind'] + ' deleted');
        }, error => {
          errors.push(error);
        }));
      }
    }

    await Promise.all(promises);

    return new Promise((resolve, reject) => {
      if (errors.length === 0) {
        resolve('All builds deleted');
      } else {
        reject (errors);
      }
    });
  }

  private deleteBuild(buildParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.deleteBuild(buildParams).subscribe(deleted => {
        resolve(deleted);
      }, error => {
        reject(error);
      });
    });
  }

  private async deletePods(params): Promise<any> {
    const route: RouteNamespace = {
      'namespace': params.namespace,
    };

    return new Promise((resolve, reject) => {
      this.osservice.requestAllPods(route).subscribe(podList => {
        this.deletePodList(podList, params).then(deleted => {
          resolve(deleted);
        }, error => {
          // TODO: Care its a list of errors
          reject(error);
        });
      }, error => {
        reject(error);
      });
    });
  }

  private async deletePodList(podList, params) {
    const errors = [];
    const promises: Promise<any>[] = [];

    const podsParams: RouteNameAndNamespace = {
      'name': '',
      'namespace': params.namespace,
    };

    for (let i = 0; i < podList['items'].length; i++) {
      if (podList['items'][i]['metadata']['name'].search(params.name) >= 0) {
        podsParams.name = podList['items'][i]['metadata']['name'];
        promises.push(this.deletePod(podsParams).then(deleted => {
          // console.log(deleted['kind'] + ' deleted');
        }, error => {
          errors.push(error);
        }));
      }
    }

    await Promise.all(promises);

    return new Promise((resolve, reject) => {
      if (errors.length === 0) {
        resolve('All pods deleted');
      } else {
        reject (errors);
      }
    });
  }

  private deletePod(podsParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.deletePod(podsParams).subscribe(deleted => {
        resolve(deleted);
      }, error => {
        reject(error);
      });
    });
  }
}
