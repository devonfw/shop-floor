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

  constructor(private serviceService: ServiceService) { }

  ngOnInit() {
    this.getServices();
  }

  getServices(): void {
    this.serviceService.getServices().then(services => this.servicesList = services);
  }

  navigateTo(url: string): void {
    console.log(url);
  }

}
