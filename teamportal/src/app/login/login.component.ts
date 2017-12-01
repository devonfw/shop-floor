import { Component, OnInit } from '@angular/core';
import { BasicAuth } from '../menu-services/shared/models'
import { Router } from '@angular/router';
import { OpenShiftService } from '../menu-services/shared/openshift.service';
import { NgForage } from 'ngforage';

@Component({
  selector: 'dsf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = false;

  basicAuth: BasicAuth = {
    username: '',
    password: ''
  };

  constructor(
    private osservice: OpenShiftService,
    private router: Router,
    private storage: NgForage
  ) { }

  ngOnInit() {
    this.basicAuth.username = '';
    this.basicAuth.password = '';
    this.osservice.requestAllProjects().subscribe(data => {
      this.router.navigate(['/menu']);
    }, error => {
      if (error.status === 401) {
        console.log('Unauthorized. Please enter your Cluster Credentials');
      }
    });
  }

  doLoginToCluster() {
    const me = this;

    this.osservice.requestToken(this.basicAuth).subscribe(data => {
      localStorage.removeItem('token');
      localStorage.setItem('token', data.substring(data.indexOf('<code>') + 6, data.indexOf('</code>')));
      me.router.navigate(['menu']);
    }, error => {
      debugger
    }, () => {
      //
    });
  }

}
