import { NewAppService } from '../shared/new-app.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Service } from '../shared/service';
import { OpenShiftService } from '../shared/openshift.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MyServicesService } from '../shared/my-services.service';

@Component({
  selector: 'my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css']
})
export class MyServicesComponent implements OnInit {
  myservices: Service[] = [];
  constructor(
    public dialog: MatDialog,
    private myServicesService: MyServicesService,
    private newAppService: NewAppService,
    private deleteAppService: DeleteAppService,
  ) { }

  ngOnInit() {
    this.getMYservices();
  }

  goToApp(route: string) {
    window.open('http://' + route);
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

  getMYservices(): void {
    this.myServicesService.getMYservices().then(services => {
      this.myservices = services;
    }).catch(error => {
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
  }

  newApp(route: string): void {
    // const route = 'https://raw.githubusercontent.com/Jorge-Dacal/my-thai-star/develop/angular/openshift.json';
    // const route = 'https://raw.githubusercontent.com/Jorge-Dacal/my-thai-star/develop/java/mtsj/openshift.json';
    this.newAppService.newApp(route).then(created => {
      console.log('created: ' + created);
      this.getMYservices();
    }).catch(error => {
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
  }

  deleteApp(name: string, namespace: string): void {
    this.deleteAppService.deleteApp(name, namespace).then(deleted => {
      console.log('deleted: ' + deleted);
      this.getMYservices();
    }).catch(error => {
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

  sendRoute() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
