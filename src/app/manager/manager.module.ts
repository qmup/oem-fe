import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerPagesComponent } from './pages/manager-pages/manager-pages.component';
import { ManagerComponent } from './components/manager/manager.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ManagerPagesComponent,
    ManagerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MDBBootstrapModulesPro.forRoot(),
    ManagerRoutingModule
  ]
})
export class ManagerModule { }
