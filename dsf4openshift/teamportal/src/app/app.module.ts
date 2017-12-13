import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { CovalentDataTableModule, CovalentLayoutModule } from '@covalent/core';
import { MaterialModule } from './material-module/material.module';
import {
  MatTabsModule,
  MatTooltipModule,
  MatDialogModule,
  MAT_PLACEHOLDER_GLOBAL_OPTIONS,
  MatButtonModule,
  MatButtonToggleModule,
} from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import {NgForageModule} from 'ngforage';

import { appRoutes } from './app.routes';
import { AppComponent } from './app.component';
import { MenuServicesComponent } from './menu-services/menu-services.component';

import { CicdServicesComponent } from './menu-services/cicd-services/cicd-services.component';
import { MyServicesComponent, DeployNewAppDialogComponent } from './menu-services/my-services/my-services.component';
import { OpenShiftService } from './menu-services/shared/openshift.service';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { DeleteAppService } from './menu-services/shared/delete-app.service';
import { NewAppService } from './menu-services/shared/new-app.service';
import { MyServicesService } from './menu-services/shared/my-services.service';
import { CicdServicesService } from './menu-services/shared/cicd-services.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuServicesComponent,
    CicdServicesComponent,
    MyServicesComponent,
    LoginComponent,
    DeployNewAppDialogComponent,
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
    MatDialogModule,
    MatTooltipModule,
    HttpClientModule,
    NgForageModule,
    MatFormFieldModule,
    MatButtonModule,
    MatButtonToggleModule
  ],
  providers: [
    OpenShiftService,
    MyServicesService,
    NewAppService,
    DeleteAppService,
    CicdServicesService,
    {provide: MAT_PLACEHOLDER_GLOBAL_OPTIONS, useValue: {float: 'always'}}
  ],
  entryComponents: [
    DeployNewAppDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
