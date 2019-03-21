
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AgmCoreModule } from '@agm/core';
import { AppComponent } from './app.component';

import { MDBSpinningPreloader, MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { AppRoutingModule } from './app-routing.module';
import { EmployeeModule } from './employee/employee.module';
import { ManagerModule } from './manager/manager.module';
import { PlaceModule } from './place/place.module';
import { BeaconModule } from './beacon/beacon.module';
import { CoreModule } from './core/core.module';
import { AuthorizeModule } from './authorize/authorize.module';
import { TaskModule } from './task/task.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { NotificationService } from './core/services/notification.service';
import { AsyncPipe } from '@angular/common';
import { TaskCalendarModule } from './task-calendar/task-calendar.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptorService } from './core/services/request-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBzi6k4xf4dNTVRofgFajZKQbApQ_hbzzc'
    }),
    CoreModule,
    EmployeeModule,
    TaskCalendarModule,
    ManagerModule,
    PlaceModule,
    TaskModule,
    BeaconModule,
    AuthorizeModule,
    // CalendarModule,
    DashboardModule,
    ToastModule.forRoot(
      { preventDuplicates: true }
    ),
    MDBBootstrapModulesPro.forRoot(),
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.apiPaths.firebase),

  ],
  providers: [
    MDBSpinningPreloader,
    NotificationService,
    AsyncPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas:      [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
