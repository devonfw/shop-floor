import { Component, OnInit, Inject } from '@angular/core';
import { Service } from '../shared/service';
import { OpenShiftService } from '../shared/openshift.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import { RouteNameAndNamespace, RouteNamespaceAndBodyJSON, NewApp, RouteNamespace } from '../shared/models';

@Component({
  selector: 'my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css']
})
export class MyServicesComponent implements OnInit {
  myservices: Service[] = [];
  constructor(
    private osservice: OpenShiftService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getMYservices();
  }

  goToApp(route: string) {
    window.open('https://' + route);
  }

  getMYservices(): void {
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
            this.myservices.push(service);
          }
        }, error => {
          if (error.status === 401) {
            console.log('Unathorized. Please enter your Cluster Credentials');
          }
        });
      }
    }, error => {
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DeployNewAppDialogComponent, {
      // width: '250px',
      data: { route: '' }
    });

    dialogRef.afterClosed().subscribe(route => {
      if (route === undefined) {
        //
      } else {
        this.newApp(route);
      }
    });
  }

  newApp(route: string): void {
    // const route = 'https://raw.githubusercontent.com/Jorge-Dacal/my-thai-star/develop/angular/openshift.json';
    // const route = 'https://raw.githubusercontent.com/Jorge-Dacal/my-thai-star/develop/java/mtsj/openshift.json';
    this.osservice.requestFileParam(route).subscribe(fileParams => {

      const CreateProject = {
        'name': fileParams['PROJECT'],
        // 'name': 'paquito',
        'displayName': fileParams['PROJECT_DISPLAYNAME'],
        'description': fileParams['DESCRIPTION'],
      };

      // STEP 0. TRY TO CREATE PROJECT (if the project exist, this don't do nothing)
      this.osservice.requestProject(fileParams['PROJECT']).subscribe(project => {
        this.createApp(fileParams);
      }, error => {
        this.osservice.createProject(CreateProject).subscribe(newProject => {
          debugger
          this.createApp(fileParams);
        }, errorCreate => {
          // TODO: ¿AUTH?
        });
      });
    });
  }

  createApp(fileParams) {
    const params: RouteNameAndNamespace = {
      'name': 'devonfw-' + fileParams['TYPE'],
      'namespace': 'openshift',
    };
    const body: RouteNamespaceAndBodyJSON = {
      'namespaceRoute': fileParams['PROJECT'],
      // 'namespaceRoute': 'paquito',
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
        let wait = 4;
        for (let i = 0; i < objects.length; i++) {
          body.bodyJSON = objects[i];
          if (objects[i]['kind'] === 'Service') {
            objects[i]['spec']['ports'][0]['port'] = '8092';
          }
          this.osservice.create(body).subscribe(data => {
             wait--;
             console.log('interno: ' + wait);
             console.log(data);
          });
          // if (objects[i]['kind'] === 'BuildConfig') {
          //   // STEP 3.1 Create BuildConfig
          //   body.bodyJSON = objects[i];
          //   this.osservice.createBuildConfig(body).subscribe(data => { });
          // }
          // if (objects[i]['kind'] === 'ImageStream') {
          //   // STEP 3.2 Create ImageStream
          //   body.bodyJSON = objects[i];
          //   this.osservice.createImageStream(body).subscribe(data => { });
          // }
          // if (objects[i]['kind'] === 'DeploymentConfig') {
          //   // STEP 3.3 Create DeploymentConfig
          //   body.bodyJSON = objects[i];
          //   this.osservice.createDeploymentConfig(body).subscribe(data => { });
          // }
          // if (objects[i]['kind'] === 'Route') {
          //   // STEP 3.4 Create Route
          //   body.bodyJSON = objects[i];
          //   this.osservice.createRoute(body).subscribe(data => { });
          // }
          // if (objects[i]['kind'] === 'Service') {
          //   // STEP 3.5 Create Service
          //   body.bodyJSON = objects[i];
          //   this.osservice.createService(body).subscribe(data => {
          //     this.myservices = [];
          //     this.getMYservices(); });
          // }
        }

        // while (wait > 0) {
        //   console.log(wait);
        // }

        this.myservices = [];
        this.getMYservices(); });


      // }, error => {
      //   if (error.status === 401) {
      //     console.log('Unathorized. Please enter your Cluster Credentials');
      //   }
      // });
    }, error => {
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
  }

  deleteApp(name: string, namespace: string): void {
    const params: RouteNameAndNamespace = {
      'name': name,
      'namespace': namespace,
    };
    this.osservice.deleteBuildConfig(params).subscribe(data => { });
    this.osservice.deleteImageStream(params).subscribe(data => { });
    this.osservice.deleteDeploymentConfig(params).subscribe(data => { });
    this.osservice.deleteRoute(params).subscribe(data => { });
    this.osservice.deleteService(params).subscribe(data => { this.myservices = [];
      this.getMYservices(); });

    // Optimizar haciendo que solo busque e inserte la app recien desplegada
  }
}

@Component({
  selector: 'deploy-new-app-dialog',
  templateUrl: 'deploy-new-app-dialog.html',
})
export class DeployNewAppDialogComponent {
  options: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DeployNewAppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  sendRoute() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
