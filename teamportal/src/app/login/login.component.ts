import { Component, OnInit } from '@angular/core';
import { UserCredentials } from '../menu-services/shared/models';
import { Router } from '@angular/router';
import { OpenShiftService } from '../menu-services/shared/openshift.service';
import { NgForage } from 'ngforage';

@Component({
  selector: 'dsf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: UserCredentials = {
    username: '',
    password: '',
    token: ''
  };

  constructor(
    private osservice: OpenShiftService,
    private router: Router,
    private storage: NgForage
  ) { }

  ngOnInit() {
    this.user.username = '';
    this.user.token = '';
  }

  doLoginToCluster() {
    const me = this;
    this.osservice.requestToken(this.user.username, this.user.password).subscribe(data => {
      localStorage.removeItem('token');
      localStorage.setItem('token', data.substring(data.indexOf('<code>') + 6, data.indexOf('</code>')));
      me.router.navigate(['menu']);
    });
  }

}
