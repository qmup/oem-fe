import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { FormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [DashboardPageComponent, DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    CoreModule,
    BsDatepickerModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
  ]
})
export class DashboardModule { }
