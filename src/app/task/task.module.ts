import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskPagesComponent } from './pages/task-pages/task-pages.component';
import { TaskComponent } from './components/task/task.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TaskPagesComponent, TaskComponent],
  imports: [
    CommonModule,
    FormsModule,
    TaskRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
  ]
})
export class TaskModule { }
