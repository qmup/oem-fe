import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LaborerPagesComponent } from './pages/laborer-pages/laborer-pages.component';
import { SalerPagesComponent } from './pages/saler-pages/saler-pages.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';

const routes: Routes = [
  { path: 'laborer', component: LaborerPagesComponent },
  { path: 'saler', component: SalerPagesComponent },
  { path: 'employee-detail/:id', component: EmployeeDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
