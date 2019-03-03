import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskCalendarPagesComponent } from './pages/task-calendar-pages/task-calendar-pages.component';

const routes: Routes = [
  { path: 'calendar', component: TaskCalendarPagesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskCalendarRoutingModule { }
