import { Component, OnInit, Inject } from '@angular/core';
import { Service } from '../shared/service';
import { OpenShiftService } from '../shared/openshift.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';

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
