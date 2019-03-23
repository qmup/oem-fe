import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerPagesComponent } from './pages/manager-pages/manager-pages.component';
import { ManagerComponent } from './components/manager/manager.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { FormsModule } from '@angular/forms';
import { ManagerUpdateComponent } from './components/manager-update/manager-update.component';
import { ManagerDetailComponent } from './components/manager-detail/manager-detail.component';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    ManagerPagesComponent,
    ManagerComponent,
    ManagerUpdateComponent,
    ManagerDetailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    MDBBootstrapModulesPro.forRoot(),
    BsDatepickerModule.forRoot(),
    ManagerRoutingModule
  ],
  entryComponents: [
    ManagerUpdateComponent,
  ]
})
export class ManagerModule { }
