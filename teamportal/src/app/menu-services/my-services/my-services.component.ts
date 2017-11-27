import { Component, OnInit, Inject } from '@angular/core';
import { Service } from '../shared/service';
import { OpenShiftService } from '../shared/openshift.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import { RouteNameAndNamespace, RouteNamespaceAndBodyJSON } from '../shared/models';

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
      data: { name: '', animal: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  newApp(): void {
    const params: RouteNameAndNamespace = {
      'name': 'devonfw-angular',
      'namespace': 'openshift'
    };

    const body: RouteNamespaceAndBodyJSON = {
      'namespaceRoute': 'prueba',
      'bodyJSON': JSON
    };

    // STEP 1. Get the Template
    this.osservice.requestTemplate(params).subscribe(template => {
      const fileParams = {
        'APPLICATION_NAME': 'mythaistar-angular',
        'GIT_URI': 'https://github.com/Jorge-Dacal/my-thai-star.git',
        'GIT_REF': 'develop',
        'CONTEXT_DIR': '/angular'
      };
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
  constructor(
    public dialogRef: MatDialogRef<DeployNewAppDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
