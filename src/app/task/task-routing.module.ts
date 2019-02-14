import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskPagesComponent } from './pages/task-pages/task-pages.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';

const routes: Routes = [
  { path: 'task', component: TaskPagesComponent },
  { path: 'task-detail/employee/:id', component: TaskDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
