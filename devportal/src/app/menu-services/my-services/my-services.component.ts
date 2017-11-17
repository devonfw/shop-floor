import { Component, OnInit } from '@angular/core';
import { Service } from '../shared/service';
import { OpenShiftService } from '../shared/openshift.service';

@Component({
  selector: 'my-services',
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css']
})
export class MyServicesComponent implements OnInit {
  myservices: Service[];
  constructor(private osservice: OpenShiftService) { }

  ngOnInit() {
    this.getMYservices();
  }

  getMYservices(): void {
    this.osservice.getMYservices().then(services => {
      this.myservices = services
    });
  }

}
