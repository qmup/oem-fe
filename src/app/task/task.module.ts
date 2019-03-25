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
import { BsDatepickerModule, ModalModule } from 'ngx-bootstrap';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { OwlFormFieldModule, OwlInputModule, OwlRatingModule } from 'owl-ng';
import { PlaceTaskBasicComponent } from '../place/components/place-task-basic/place-task-basic.component';
import { TaskSearchComponent } from './components/task-search/task-search.component';
import { TaskSuggestionComponent } from './components/task-suggestion/task-suggestion.component';

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
    BasicTaskUpdateComponent,
    TaskSearchComponent,
    TaskSuggestionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TaskRoutingModule,
    CoreModule,
    OwlInputModule,
    OwlDateTimeModule,
    OwlFormFieldModule,
    OwlRatingModule,
    OwlNativeDateTimeModule,
    BsDatepickerModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),
  ],
  entryComponents: [
    ScheduleDetailComponent,
    BasicTaskUpdateComponent,
    PlaceTaskBasicComponent,
    TaskSuggestionComponent,
  ],
  providers: [
    {provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB'},
  ],
})
export class TaskModule { }
