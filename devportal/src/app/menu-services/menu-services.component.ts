import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';

import { Service } from './shared/service';
import { ServiceService } from './shared/service.service';

import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-menu-services',
  templateUrl: './menu-services.component.html',
  styleUrls: ['./menu-services.component.css']
})
export class MenuServicesComponent implements OnInit {
  servicesList: Service[];
  myservicesList: Service[];

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.getServices();
    this.getMyServices();
  }

  getServices(): void {
    this.service.getServices().then(services => this.servicesList = services);
  }

  getMyServices(): void {
    this.service.getMyServices().then(services => this.myservicesList = services);
  }

  navigateTo(url: string): void {
    console.log(url);
  }

}
