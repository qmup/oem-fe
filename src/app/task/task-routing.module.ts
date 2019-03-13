import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskPagesComponent } from './pages/task-pages/task-pages.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { SchedulePagesComponent } from './pages/schedule-pages/schedule-pages.component';
import { ScheduleDetailComponent } from './components/schedule-detail/schedule-detail.component';
import { BasicTaskPagesComponent } from './pages/basic-task-pages/basic-task-pages.component';
import { AuthGuardService } from '../core/services/auth-guard.service';

const routes: Routes = [
  { path: 'task', component: TaskPagesComponent, canActivate: [AuthGuardService] },
  { path: 'task-detail/:id', component: TaskDetailComponent, canActivate: [AuthGuardService] },
  { path: 'schedule', component: SchedulePagesComponent, canActivate: [AuthGuardService] },
  { path: 'schedule-detail/:id', component: ScheduleDetailComponent, canActivate: [AuthGuardService] },
  { path: 'basic-task', component: BasicTaskPagesComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
