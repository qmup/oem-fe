import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeaconPagesComponent } from './pages/beacon-pages/beacon-pages.component';
import { AuthGuardService } from '../core/services/auth-guard.service';

const routes: Routes = [
  { path: 'beacon', component: BeaconPagesComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeaconRoutingModule { }
