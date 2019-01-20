import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerPagesComponent } from './pages/manager-pages/manager-pages.component';
import { ManagerComponent } from './components/manager/manager.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [
    ManagerPagesComponent,
    ManagerComponent
  ],
  imports: [
    CommonModule,
    MDBBootstrapModulesPro.forRoot(),
    ManagerRoutingModule
  ]
})
export class ManagerModule { }
