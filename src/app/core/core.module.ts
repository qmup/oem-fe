import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LayoutComponent } from './pages/layout/layout.component';
import { MDBBootstrapModulesPro, ToastService, ToastModule } from 'ng-uikit-pro-standard';
import { AuthorizeModule } from '../authorize/authorize.module';
import { NotificationComponent } from './components/notification.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule, BsDatepickerModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [LayoutComponent, NotificationComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    CoreRoutingModule,
    AuthorizeModule,
    ToastModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
  ],
  exports: [
    LayoutComponent,
  ]
})
export class CoreModule { }
