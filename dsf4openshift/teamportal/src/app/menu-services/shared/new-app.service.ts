import { Injectable } from '@angular/core';
import { RouteNameAndNamespace, RouteNamespaceAndBodyJSON } from './models';
import { OpenShiftService } from './openshift.service';
import { Service } from './service';

@Injectable()
export class NewAppService {

  constructor(
    private osservice: OpenShiftService,
  ) { }

  newApp(route: string): Promise<boolean> {
    let created = true;
    this.osservice.requestFileParam(route).subscribe(fileParams => {

      const CreateProject = {
        'name': fileParams['PROJECT'],
        'displayName': fileParams['PROJECT_DISPLAYNAME'],
        'description': fileParams['DESCRIPTION'],
      };

      // STEP 0. TRY TO CREATE PROJECT (if the project exist, this don't do nothing)
      this.osservice.requestProject(fileParams['PROJECT']).subscribe(project => {
        this.createApp_searchEndPoint(fileParams).then(result => {
          created = result;
        });
      }, error => {
        this.osservice.createProject(CreateProject).subscribe(newProject => {
          this.createApp_searchEndPoint(fileParams).then(result => {
            created = result;
          });
        }, errorCreate => {
          if (error.status === 401) {
            console.log('Unathorized. Please enter your Cluster Credentials');
          }
        });
      });
    });
    return Promise.resolve(created);
  }

  private createApp_searchEndPoint(fileParams): Promise<boolean> {
    let created = true;
    // STEP 0.1 LINKS TO ENDPOINT?
    if (fileParams['LINKS']) {
      if (fileParams['LINKS']['PROJECT'] && fileParams['LINKS']['APPLICATION_NAME']) {
        const params: RouteNameAndNamespace = {
          'name': fileParams['LINKS']['APPLICATION_NAME'],
          'namespace': fileParams['LINKS']['PROJECT'],
        };
        this.osservice.requestRoutes(params).subscribe(routes => {
          fileParams['REST_ENDPOINT_URL'] = 'http://' + routes['spec']['host'];
          this.createApp(fileParams).then(result => {
            created = result;
          });
        }, error => {
          if (error.status === 401) {
            console.log('Unathorized. Please enter your Cluster Credentials');
          } else {
            this.createApp(fileParams).then(result => {
              created = result;
            });
          }
        });
      } else {
        console.log('No REST_ENDPOINT_URL found, starting createApp');
        this.createApp(fileParams).then(result => {
          created = result;
        });
      }
    } else {
      console.log('No LINKS to endpoint found, starting createApp');
      this.createApp(fileParams).then(result => {
        created = result;
      });
    }
    return Promise.resolve(created);
  }

  private createApp(fileParams): Promise<boolean> {
    let created = true;
    const params: RouteNameAndNamespace = {
      'name': 'devonfw-' + fileParams['TYPE'],
      'namespace': 'openshift',
    };
    const body: RouteNamespaceAndBodyJSON = {
      'namespaceRoute': fileParams['PROJECT'],
      'bodyJSON': JSON
    };

    // STEP 1. Get the Template
    this.osservice.requestTemplate(params).subscribe(template => {
      const parameters = template['parameters'];
      for (let i = 0; i < parameters.length; i++) {
        if (fileParams[parameters[i]['name']]) {
          parameters[i]['value'] = fileParams[parameters[i]['name']];
        }
      }
      // STEP 2. Process the Template
      body.bodyJSON = template;
      this.osservice.processedTemplate(body).subscribe(processedTemplate => {
        const objects = processedTemplate['objects'];
        for (let i = 0; i < objects.length; i++) {
          body.bodyJSON = objects[i];
          if (objects[i]['kind'] === 'Service') {
            objects[i]['spec']['ports'][0]['port'] = '8092';
          }
          // STEP 3 CREATE CONFIGS
          this.osservice.create(body).subscribe(data => {
            // creating confing
          }, error => {
            created = false;
            if (error.status === 401) {
              console.log('Unathorized. Please enter your Cluster Credentials');
            }
          });
        }
      }, error => {
        created = false;
        if (error.status === 401) {
          console.log('Unathorized. Please enter your Cluster Credentials');
        }
      });
    }, error => {
      created = false;
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
    return Promise.resolve(created);
  }
}
