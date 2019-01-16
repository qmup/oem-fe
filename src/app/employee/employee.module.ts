import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { LaborerComponent } from './components/laborer/laborer.component';
import { SalerComponent } from './components/saler/saler.component';
import { LaborerPagesComponent } from './pages/laborer-pages/laborer-pages.component';
import { SalerPagesComponent } from './pages/saler-pages/saler-pages.component';

@NgModule({
  declarations: [
    LaborerComponent,
    SalerComponent,
    LaborerPagesComponent,
    SalerPagesComponent
  ],
  imports: [
    CommonModule,
    EmployeeRoutingModule,
  ]
})
export class EmployeeModule { }
