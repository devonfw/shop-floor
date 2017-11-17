import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { CovalentDataTableModule, CovalentLayoutModule } from '@covalent/core';
import { MaterialModule } from './material-module/material.module';
import { MatTabsModule, MatTooltipModule } from '@angular/material';

import { appRoutes } from './app.routes';

import { AppComponent } from './app.component';
import { MenuServicesComponent } from './menu-services/menu-services.component';

import { ServiceService } from './menu-services/shared/service.service';
import { CicdServicesComponent } from './menu-services/cicd-services/cicd-services.component';
import { MyServicesComponent } from './menu-services/my-services/my-services.component';
import { OpenShiftService } from './menu-services/shared/openshift.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuServicesComponent,
    CicdServicesComponent,
    MyServicesComponent
  ],
  imports: [
    FormsModule,
    appRoutes,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    CovalentLayoutModule,
    CovalentDataTableModule,
    MaterialModule,
    MatTabsModule,
    MatTooltipModule
  ],
  providers: [
    ServiceService,
    OpenShiftService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
