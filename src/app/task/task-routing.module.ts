import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskPagesComponent } from './pages/task-pages/task-pages.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { SchedulePagesComponent } from './pages/schedule-pages/schedule-pages.component';
import { ScheduleDetailComponent } from './components/schedule-detail/schedule-detail.component';
import { BasicTaskPagesComponent } from './pages/basic-task-pages/basic-task-pages.component';

const routes: Routes = [
  { path: 'task', component: TaskPagesComponent },
  { path: 'task-detail/:id', component: TaskDetailComponent },
  { path: 'schedule', component: SchedulePagesComponent },
  { path: 'schedule-detail/:id', component: ScheduleDetailComponent },
  { path: 'basic-task', component: BasicTaskPagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
