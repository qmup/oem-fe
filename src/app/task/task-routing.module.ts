import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskPagesComponent } from './pages/task-pages/task-pages.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { ScheduleComponent } from './components/schedule/schedule.component';

const routes: Routes = [
  { path: 'task', component: TaskPagesComponent },
  { path: 'task-detail/employee/:id', component: TaskDetailComponent },
  { path: 'schedule', component: ScheduleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
