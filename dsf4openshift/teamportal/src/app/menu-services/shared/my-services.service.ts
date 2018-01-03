import { Injectable } from '@angular/core';

import { Service } from './service';
import { OpenShiftService } from './openshift.service';
import { RouteNamespace, RouteNameAndNamespace } from './models';

@Injectable()
export class MyServicesService {

  constructor(
    private osservice: OpenShiftService,
  ) { }

  /**
   * Obtain the Services of the user logged.
   */
  getMYservices(): Promise<Service[]> {
    return new Promise((resolve, reject) => {
      this.osservice.requestAllProjects().subscribe(ProjectList => {
        this.getServices(ProjectList).then(services => {
          resolve(services);
        }, error => {
          reject(error);
        });
      }, error => {
        reject(this.osservice.analizeError(error));
      });
    });
  }

  /**
   * Analyze the ProjectList and return all the services with their status in that list.
   * @param ProjectList The ProjectList from Openshift
   */
  private async getServices(ProjectList): Promise<any> {
    const myservices: Service[] = [];
    const promises: Promise<any>[] = [];
    let error = '';
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
          promises.push(this.getStatus(service).then(status => {
            service.status = status;
          }, errorStatus => {
            // Error obteniendo el status de un servicio, guardar en el log el error pero continuar y poner el estado en error
            console.log(this.osservice.analizeError(errorStatus));
            service.status = 'Error';
          }));
          // getImage();
          myservices.push(service);
        }
      }, errorRouteList => {
        error = this.osservice.analizeError(errorRouteList);
      });
    }

    await Promise.all(promises);

    return new Promise((resolve, reject) => {
      resolve(myservices);
      if (error === '') {
        resolve(myservices);
      } else {
        reject(error);
      }
    });
  }

  /**
   * Return the status of the service
   * @param service It's a JSON with the name, project, namespace, and urLink of the service.
   */
  private getStatus(service): Promise<string> {
    const route: RouteNameAndNamespace = {
      'name': service.name,
      'namespace': service.namespace,
    };
    return new Promise((resolve, reject) => {
      this.osservice.requestDeploymentConfig(route).subscribe(deploymentConfig => {
        this.getBuildStatus(route, deploymentConfig['status']['latestVersion']).then(statusBuild => {
          switch (statusBuild) {
            case 'Complete':
              resolve(this.getDeploymentStatus(deploymentConfig));
              break;
            case 'Failed':
              if (this.getDeploymentStatus(deploymentConfig) === 'Ready') {
                resolve('ReadyOldVersion');
              } else {
                resolve(statusBuild);
              }
              break;
            default:
              resolve(statusBuild);
              break;
          }
        }, error => {
          reject(error);
        });
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * Return the status of the Deploy
   * @param deploymentConfig The DeploymentConfig from Openshift
   */
  private getDeploymentStatus(deploymentConfig): string {
    const availableReplicas = deploymentConfig['status']['availableReplicas'];
    if (availableReplicas > 0) {
      return 'Ready';
    } else {
      let progressing = false;
      for (let i = 0; i < deploymentConfig['status']['conditions'].length; i++) {
        if (deploymentConfig['status']['conditions'][i]['type'] === 'Progressing') {
          if (deploymentConfig['status']['conditions'][i]['status'] === 'True') {
            progressing = true;
            break;
          }
        }
      }
      if (progressing) {
        return 'Off';
      } else {
        return 'Error';
      }
    }
  }

  /**
   * Obtain the status of the Build. To do that, first try to find a new build, and if don't exist, find the status of the last knew build
   * @param route It's a JSON with the name and the namespace of the service
   * @param latestVersion It's the latest knew version builded
   */
  private getBuildStatus(route, latestVersion): Promise<string> {
    return new Promise((resolve, reject) => {
      const routeBuild: RouteNameAndNamespace = {
        'name': route.name + '-' + (latestVersion + 1),
        'namespace': route.namespace,
      };

      // Try to find a new building
      this.requestBuildStatus(routeBuild).then(phaseNew => {
        if (phaseNew !== 'Running') {
          // if a new version it's not Running, could be more builds
          this.getLastBuildStatus(route).then(phaseLatest => {
            resolve(phaseLatest);
          }, error => {
            reject(error);
          });
        } else {
          resolve(phaseNew);
        }
      }, errorNew => {
        // This is not an error, its only that not new version building
        // Find the status of the last build
        routeBuild.name = route.name + '-' + latestVersion;
        this.requestBuildStatus(routeBuild).then(phase => {
          resolve(phase);
        }, error => {
          reject(error);
        });
      });
    });
  }

  /**
   * Return the status of the last build.
   * @param route the information about the name and the namespace of the builds.
   */
  private getLastBuildStatus(route): Promise<string> {
    const routeNamespace: RouteNamespace = {
      'namespace': route.namespace,
    };
    return new Promise((resolve, reject) => {
      this.osservice.requestAllBuilds(routeNamespace).subscribe(buildList => {
        let name = buildList['items'][0]['metadata']['name'];
        let version = + name.substring(name.lastIndexOf('-') + 1); // + is for cast to number
        let latestVersion = buildList['items'][0];
        for (let i = 1; i < buildList['items'].length; i++) {
          name = buildList['items'][i]['metadata']['name'];
          if (name.search(route.name) >= 0) {
            const auxVersion = + name.substring(name.lastIndexOf('-') + 1); // + is for cast to number
            if (auxVersion > version) {
              latestVersion = buildList['items'][i];
              version = auxVersion;
            }
          }
        }
        resolve(latestVersion['status']['phase']);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * Obtain the status of the Build
   * @param route It's a JSON with the name and the namespace of the build.
   */
  private requestBuildStatus(route): Promise<string> {
    return new Promise((resolve, reject) => {
      this.osservice.requestBuild(route).subscribe(build => {
        resolve(build['status']['phase']);
      }, error => {
        reject(error);
      });
    });
  }
}
