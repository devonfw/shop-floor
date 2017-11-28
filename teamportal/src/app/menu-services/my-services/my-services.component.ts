import { Component, OnInit, Inject } from '@angular/core';
import { Service } from '../shared/service';
import { OpenShiftService } from '../shared/openshift.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import { RouteNameAndNamespace, RouteNamespaceAndBodyJSON, NewApp } from '../shared/models';

@Component({
  selector: 'my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css']
})
export class MyServicesComponent implements OnInit {
  myservices: Service[];
  constructor(
    private osservice: OpenShiftService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getMYservices();
  }

  getMYservices(): void {
    this.osservice.getMYservices().then(services => {
      this.myservices = services;
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
    // this.osservice.requestFileParam(route).subscribe(fileParams => {
    //   this.osservice.createProject(fileParams).subscribe(project => {
    //     this.osservice.requestTemplate(fileParams).subscribe(template => {
    //       this.osservice.processedTemplate(template).subscribe(processedTemplate => {
    //         //
    //       })
    //     })
    //   })
    // })

    // const route = 'https://raw.githubusercontent.com/Jorge-Dacal/my-thai-star/develop/angular/openshift.json';
    // const route = 'https://raw.githubusercontent.com/Jorge-Dacal/my-thai-star/develop/java/mtsj/openshift.json';
    this.osservice.requestFileParam(route).subscribe(fileParams => {

      const CreateProject = {
        'name': fileParams['PROJECT'],
        'displayName': fileParams['PROJECT_DISPLAYNAME'],
        'description': fileParams['DESCRIPTION'],
      };

      // STEP 0. TRY TO CREATE PROJECT (if the project exist, this don't do nothing)
      this.osservice.requestProject(fileParams['PROJECT']).subscribe(project => {
        this.createApp(fileParams);
      }, error => {
        this.osservice.createProject(CreateProject).subscribe(newProject => {
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
          console.log(objects[i]['kind']);
          if (objects[i]['kind'] === 'BuildConfig') {
            console.log(objects[i]);
            // STEP 3.1 Create BuildConfig
            body.bodyJSON = objects[i];
            this.osservice.createBuildConfig(body).subscribe(data => { console.log(data); });
          }
          if (objects[i]['kind'] === 'ImageStream') {
            console.log(objects[i]);
            // STEP 3.2 Create ImageStream
            body.bodyJSON = objects[i];
            this.osservice.createImageStream(body).subscribe(data => { console.log(data); });
          }
          if (objects[i]['kind'] === 'DeploymentConfig') {
            console.log(objects[i]);
            // STEP 3.3 Create DeploymentConfig
            body.bodyJSON = objects[i];
            this.osservice.createDeploymentConfig(body).subscribe(data => { console.log(data); });
          }
          if (objects[i]['kind'] === 'Route') {
            console.log(objects[i]);
            // STEP 3.4 Create Route
            body.bodyJSON = objects[i];
            this.osservice.createRoute(body).subscribe(data => { console.log(data); });
          }
          if (objects[i]['kind'] === 'Service') {
            console.log(objects[i]);
            // STEP 3.5 Create Service
            body.bodyJSON = objects[i];
            this.osservice.createService(body).subscribe(data => { console.log(data); });
          }
        }
      }, error => {
        if (error.status === 401) {
          console.log('Unathorized. Please enter your Cluster Credentials');
        }
      });
    }, error => {
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
  }
}

@Component({
  selector: 'deploy-new-app-dialog',
  templateUrl: 'deploy-new-app-dialog.html',
})
export class DeployNewAppDialogComponent {
  options: FormGroup;
  // route = '';
  constructor(
    public dialogRef: MatDialogRef<DeployNewAppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  sendRoute() {
    this.dialogRef.close();
  }

  // onNoClick(): void {
  //   this.dialogRef.close();
  // }

}
