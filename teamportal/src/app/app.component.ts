import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { OpenShiftService } from './menu-services/shared/openshift.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private osservice: OpenShiftService, private router: Router) { }

  ngOnInit() {
    // this.osservice.requestToken();
    // this.osservice.requestProjects().subscribe(data => {
    // }, error => {
    //   if (error.status === 403 || error.status === 401) {
    //     this.router.navigate(['login']);
    //   }
    // });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
