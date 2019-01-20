import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { LaborerComponent } from './components/laborer/laborer.component';
import { SalerComponent } from './components/saler/saler.component';
import { LaborerPagesComponent } from './pages/laborer-pages/laborer-pages.component';
import { SalerPagesComponent } from './pages/saler-pages/saler-pages.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LaborerComponent,
    SalerComponent,
    LaborerPagesComponent,
    SalerPagesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EmployeeRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
  ]
})
export class EmployeeModule { }
