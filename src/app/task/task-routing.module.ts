import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskPagesComponent } from './pages/task-pages/task-pages.component';

const routes: Routes = [
  { path: 'task', component: TaskPagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
