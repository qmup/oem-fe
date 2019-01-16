import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerPagesComponent } from './pages/manager-pages/manager-pages.component';

const routes: Routes = [
  { path: 'manager', component: ManagerPagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
