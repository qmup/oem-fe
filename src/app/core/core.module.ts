import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LayoutComponent } from './pages/layout/layout.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { AuthorizeModule } from '../authorize/authorize.module';
import { NotificationComponent } from './components/notification.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [LayoutComponent, NotificationComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    CoreRoutingModule,
    AuthorizeModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  exports: [
    LayoutComponent
  ]
})
export class CoreModule { }
