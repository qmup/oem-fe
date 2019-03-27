import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { LaborerComponent } from './components/laborer/laborer.component';
import { SalerComponent } from './components/saler/saler.component';
import { LaborerPagesComponent } from './pages/laborer-pages/laborer-pages.component';
import { SalerPagesComponent } from './pages/saler-pages/saler-pages.component';
import { MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { FormsModule } from '@angular/forms';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap';
import { EmployeeUpdateComponent } from './components/employee-update/employee-update.component';
import { CoreModule } from '../core/core.module';
import { AgmCoreModule } from '@agm/core';
import { OwlInputModule, OwlFormFieldModule } from 'owl-ng';
import { OwlNativeDateTimeModule, OwlDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    LaborerComponent,
    SalerComponent,
    LaborerPagesComponent,
    SalerPagesComponent,
    EmployeeDetailComponent,
    EmployeeUpdateComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlFormFieldModule,
    OwlInputModule,
    EmployeeRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBzi6k4xf4dNTVRofgFajZKQbApQ_hbzzc'
    }),
    BsDatepickerModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
  ],
  entryComponents: [
    EmployeeUpdateComponent,
  ]
})
export class EmployeeModule { }
