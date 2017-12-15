import { NewAppService } from '../shared/new-app.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Service } from '../shared/service';
import { OpenShiftService } from '../shared/openshift.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';
import { MyServicesService } from '../shared/my-services.service';
import { DeleteAppService } from '../shared/delete-app.service';
import { DeployNewErrorDialogComponent } from '../../error-dialog/error-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css']
})
export class MyServicesComponent implements OnInit {
  myservices: Service[] = [];
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private errorDialog: MatDialog,
    private myServicesService: MyServicesService,
    private newAppService: NewAppService,
    private deleteAppService: DeleteAppService,
  ) { }

  ngOnInit() {
    this.getMYservices();
    // this.openErrorDialog('Texto de ejemplo');
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

  analizeError(error) {
    console.log('analize error');
    if (error.status !== 401) {
      this.openErrorDialog(error);
    } else {
      this.router.navigate(['/login']);
    }
  }

  openErrorDialog(error): void {
    const dialogRef = this.errorDialog.open(DeployNewErrorDialogComponent, {
      // width: '250px',
      'data': { 'error': error }
    });

    dialogRef.afterClosed().subscribe(route => {
      if (route === undefined) {
        //
      } else {
        //
      }
    });
  }

  getMYservices(): void {
    this.myServicesService.getMYservices().then(services => {
      this.myservices = services;
    }).catch(error => {
      console.log(error);
      this.analizeError(error);
    });
  }

  newApp(route: string): void {
    // const route = 'https://raw.githubusercontent.com/Jorge-Dacal/my-thai-star/develop/angular/openshift.json';
    // const route = 'https://raw.githubusercontent.com/Jorge-Dacal/my-thai-star/develop/java/mtsj/openshift.json';
    this.newAppService.newApp(route).then(newApp => {
      if (newApp === 'endpoint') {
        // TODO: endpoint in openshift.json not found
      }
      this.getMYservices();
    }).catch(error => {
      this.analizeError(error);
    });
  }

  deleteApp(name: string, namespace: string): void {
    this.deleteAppService.deleteApp(name, namespace).then(deleted => {
      // console.log(deleted);
      this.getMYservices();
    }).catch(error => {
      // TODO: Care is a list of errors.
      this.analizeError(error);
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
