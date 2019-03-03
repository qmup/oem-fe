import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { LayoutComponent } from './pages/layout/layout.component';
import { MDBBootstrapModulesPro, ToastService, ToastModule } from 'ng-uikit-pro-standard';
import { AuthorizeModule } from '../authorize/authorize.module';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule, BsDatepickerModule } from 'ngx-bootstrap';
import { NotificationService } from './services/notification.service';
import { PaginationComponent } from './components/pagination.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// import { FlatpickrModule } from 'angularx-flatpickr';


@NgModule({
  declarations: [LayoutComponent, PaginationComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    CoreRoutingModule,
    AuthorizeModule,
    ToastModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
    NgbModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    // FlatpickrModule.forRoot(),
  ],
  exports: [
    LayoutComponent,
    PaginationComponent,
  ],
  providers: [
    NotificationService
  ]
})
export class CoreModule { }
