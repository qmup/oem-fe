import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';

import { TaskCalendarRoutingModule } from './task-calendar-routing.module';
import { TaskCalendarPagesComponent } from './pages/task-calendar-pages/task-calendar-pages.component';
import { TaskCalendarComponent } from './components/task-calendar/task-calendar.component';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { DayViewSchedulerComponent } from './components/day-view-scheduler/day-view-scheduler.component';

@NgModule({
  declarations: [TaskCalendarPagesComponent, TaskCalendarComponent, DayViewSchedulerComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    TaskCalendarRoutingModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MDBBootstrapModulesPro.forRoot()
  ]
})
export class TaskCalendarModule { }
