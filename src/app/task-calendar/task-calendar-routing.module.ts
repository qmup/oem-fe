import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskCalendarPagesComponent } from './pages/task-calendar-pages/task-calendar-pages.component';
import { AuthGuardService } from '../core/services/auth-guard.service';

const routes: Routes = [
  { path: 'calendar', component: TaskCalendarPagesComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskCalendarRoutingModule { }
