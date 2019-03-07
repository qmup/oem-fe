import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerPagesComponent } from './pages/manager-pages/manager-pages.component';
import { ManagerDetailComponent } from './components/manager-detail/manager-detail.component';

const routes: Routes = [
  { path: 'manager', component: ManagerPagesComponent },
  { path: 'manager-detail/:id', component: ManagerDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
