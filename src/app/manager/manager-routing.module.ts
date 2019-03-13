import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagerPagesComponent } from './pages/manager-pages/manager-pages.component';
import { ManagerDetailComponent } from './components/manager-detail/manager-detail.component';
import { AuthGuardService } from '../core/services/auth-guard.service';

const routes: Routes = [
  { path: 'manager', component: ManagerPagesComponent, canActivate: [AuthGuardService] },
  { path: 'manager-detail/:id', component: ManagerDetailComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagerRoutingModule { }
