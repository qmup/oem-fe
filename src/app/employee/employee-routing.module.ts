import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LaborerPagesComponent } from './pages/laborer-pages/laborer-pages.component';
import { SalerPagesComponent } from './pages/saler-pages/saler-pages.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { AuthGuardService } from '../core/services/auth-guard.service';

const routes: Routes = [
  { path: 'employee', component: LaborerPagesComponent, canActivate: [AuthGuardService] },
  { path: 'saler', component: SalerPagesComponent, canActivate: [AuthGuardService] },
  { path: 'employee-detail/:id', component: EmployeeDetailComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
