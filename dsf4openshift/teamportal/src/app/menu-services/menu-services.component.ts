import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { NgForOf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-services',
  templateUrl: './menu-services.component.html',
  styleUrls: ['./menu-services.component.css']
})
export class MenuServicesComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  navigateTo(url: string): void {
    console.log(url);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

}
