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
import { CoreModule } from '../core/core.module';
import { ScheduleDetailComponent } from './components/schedule-detail/schedule-detail.component';
import { BasicTaskComponent } from './components/basic-task/basic-task.component';
import { BasicTaskPagesComponent } from './pages/basic-task-pages/basic-task-pages.component';
import { BasicTaskUpdateComponent } from './components/basic-task-update/basic-task-update.component';

@NgModule({
  declarations: [
    TaskPagesComponent,
    TaskComponent,
    TaskDetailComponent,
    ScheduleComponent,
    SchedulePagesComponent,
    ScheduleComponent,
    ScheduleDetailComponent,
    BasicTaskComponent,
    BasicTaskPagesComponent,
    BasicTaskUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TaskRoutingModule,
    CoreModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  entryComponents: [
    ScheduleDetailComponent,
    BasicTaskUpdateComponent
  ]
})
export class TaskModule { }
