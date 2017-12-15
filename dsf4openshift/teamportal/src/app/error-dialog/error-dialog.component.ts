import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-error-dialog',
  templateUrl: 'error-dialog.component.html',
})
export class DeployNewErrorDialogComponent {
  options: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DeployNewErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  sendRoute() {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
