import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskPagesComponent } from './pages/task-pages/task-pages.component';
import { TaskComponent } from './components/task/task.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { FormsModule } from '@angular/forms';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { SchedulePagesComponent } from './pages/schedule-pages/schedule-pages.component';
import { ScheduleComponent } from './components/schedule/schedule.component';

@NgModule({
  declarations: [TaskPagesComponent, TaskComponent, TaskDetailComponent, ScheduleComponent, SchedulePagesComponent, ScheduleComponent],
  imports: [
    CommonModule,
    FormsModule,
    TaskRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
  ]
})
export class TaskModule { }
