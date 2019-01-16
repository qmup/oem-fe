import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LaborerPagesComponent } from './pages/laborer-pages/laborer-pages.component';
import { SalerPagesComponent } from './pages/saler-pages/saler-pages.component';

const routes: Routes = [
  { path: 'laborer', component: LaborerPagesComponent },
  { path: 'saler', component: SalerPagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
