import { Component, OnInit } from '@angular/core';
import { UserCredentials } from '../menu-services/shared/models';
import { Router } from '@angular/router';
import { OpenShiftService } from '../menu-services/shared/openshift.service';
import { NgForage } from 'ngforage';
import { BasicAuth } from '../menu-services/shared/models'

@Component({
  selector: 'dsf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = false;
  user: UserCredentials = {
    username: '',
    password: '',
    token: ''
  };

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
    this.user.username = '';
    this.user.token = '';
    this.osservice.requestProjects().subscribe(data => {
      this.router.navigate(['/menu']);
    }, error => {
      if (error.status === 401) {
        console.log('Unathorized. Please enter your Cluster Credentials');
      }
    });
  }

  doLoginToCluster() {
    const me = this;
    this.basicAuth.username = this.user.username;
    this.basicAuth.password = this.user.password

    this.osservice.requestToken(this.basicAuth).subscribe(data => {
      debugger
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
