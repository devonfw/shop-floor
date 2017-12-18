import { Injectable } from '@angular/core';
import { RouteNameAndNamespace, RouteNamespaceAndBodyJSON } from './models';
import { OpenShiftService } from './openshift.service';
import { Service } from './service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NewAppService {

  constructor(
    private osservice: OpenShiftService,
  ) { }

  /**
   * This function read an openshift.json file and create an app into the openshift cluster
   * using the devonfw templates.
   *
   * The openshift.json is a file with the information that teamportal need to know to create
   * a new app in the openshift cluster.
   *
   * @param route the openshift.json RAW URL
   */
  public newApp(route: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.requestFileParam(route).subscribe(fileParams => {
        // STEP 1. TRY TO CREATE PROJECT (if the project exist, this don't do nothing)
        this.createProject(fileParams).then(project => {
          // console.log(project);
          // STEP 2. LINKS TO ENDPOINT?
          this.searchEndPoint(fileParams).then(endPoint => {
            if (endPoint) {
              fileParams['REST_ENDPOINT_URL'] = this.osservice.PROTOCOL + endPoint;
            }
            // STEP 3. CREATE APP
            this.createApp(fileParams).then(app => {
              // console.log(app);
              resolve(true);
            }, error => {
              reject(this.osservice.analizeError(error));
            });
          }, error => {
            if (error.status === 401) {
              reject(this.osservice.analizeError(error));
            } else {
              // Aplication must be created until the endpoint fail.
              // STEP 4. CREATE APP WITHOUT ENDPOINT
              this.createApp(fileParams).then(app => {
                // console.log(app + ' but endpoint not found');
                resolve('endpoint');
              }, errorApp => {
                reject(this.osservice.analizeError(errorApp));
              });
            }
          });
        }, error => {
          reject(this.osservice.analizeError(error));
        });
      });
    });
  }

  private createProject(fileParams): Promise<any> {
    const CreateProject = {
      'name': fileParams['PROJECT'],
      'displayName': fileParams['PROJECT_DISPLAYNAME'],
      'description': fileParams['DESCRIPTION'],
    };

    return new Promise((resolve, reject) => {
      this.osservice.requestProject(fileParams['PROJECT']).subscribe(project => {
        // Proyect Exists, don't do nothing.
        resolve('Project Exists');
      }, errorExpected => {
        // console.log('errorExpected: ' + errorExpected);
        if (errorExpected.status === 403) {
          // This is not and error, Maybe the Proyect don't exists, then create it.
          // console.log('This is not and error, Maybe the Proyect don\'t exists, creating it.');
          return this.osservice.createProject(CreateProject).subscribe(newProject => {
            resolve('Project Created');
          }, error => {
            reject(error);
          });
        } else {
          reject(errorExpected);
        }
      });
    });
  }

  private searchEndPoint(fileParams): Promise<any> {
    return new Promise((resolve, reject) => {
      if (fileParams['LINKS']) {
        if (fileParams['LINKS']['PROJECT'] && fileParams['LINKS']['APPLICATION_NAME']) {
          const params: RouteNameAndNamespace = {
            'name': fileParams['LINKS']['APPLICATION_NAME'],
            'namespace': fileParams['LINKS']['PROJECT'],
          };
          this.osservice.requestRoutes(params).subscribe(routes => {
            resolve(routes['spec']['host']);
          }, error => {
            reject(error);
          });
        } else {
          // console.log('No REST_ENDPOINT_URL found, starting createApp');
          resolve(false);
        }
      } else {
        // console.log('No LINKS to endpoint found, starting createApp');
        resolve(false);
      }
    });
  }

  private createApp(fileParams): Promise<any> {
    const params: RouteNameAndNamespace = {
      'name': 'devonfw-' + fileParams['TYPE'],
      'namespace': 'openshift',
    };
    const body: RouteNamespaceAndBodyJSON = {
      'namespaceRoute': fileParams['PROJECT'],
      'bodyJSON': JSON
    };
    return new Promise((resolve, reject) => {
      this.requestTemplate(params, fileParams).then(template => {
        body.bodyJSON = template;
        this.processedTemplate(body).then(result => {
          // console.log(result);
          resolve('App created');
        }, error => {
          reject(error);
        });
      }, error => {
        reject(error);
      });
    });
  }

  private requestTemplate(params, fileParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.requestTemplate(params).subscribe(template => {
        const parameters = template['parameters'];
        for (let i = 0; i < parameters.length; i++) {
          if (fileParams[parameters[i]['name']]) {
            parameters[i]['value'] = fileParams[parameters[i]['name']];
          }
        }
        resolve(template);
      }, error => {
        reject(error);
      });
    });
  }

  private processedTemplate(body): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.processedTemplate(body).subscribe(processedTemplate => {
        this.createConfigs(processedTemplate, body).then(created => {
          resolve(created);
        }, error => {
          // TODO: care is a list of errors
          reject(error);
        });
      }, error => {
        reject(error);
      });
    });
  }

  private async createConfigs(processedTemplate, body): Promise<any> {
    const errors = [];
    const promises: Promise<any>[] = [];

    const objects = processedTemplate['objects'];
    // console.log('Creating confings');

    for (let i = 0; i < objects.length; i++) {
      body.bodyJSON = objects[i];
      if (objects[i]['kind'] === 'Service') {
        objects[i]['spec']['ports'][0]['port'] = '8092';
      }
      // STEP 3 CREATE CONFIGS
      promises.push(this.createConfig(body).then(created => {
        // console.log(created);
      }, error => {
        errors.push(error);
      }));
    }

    await Promise.all(promises);

    return new Promise((resolve, reject) => {
      if (errors.length === 0) {
        resolve('All configs created');
      } else {
        reject(errors);
      }
    });
  }

  private createConfig(body): Promise<any> {
    return new Promise((resolve, reject) => {
      this.osservice.create(body).subscribe(data => {
        resolve(data['kind'] + ' created');
      }, errorCreated => {
        reject(errorCreated);
      });
    });
  }
}
