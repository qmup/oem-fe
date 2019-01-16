import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BeaconPagesComponent } from './pages/beacon-pages/beacon-pages.component';

const routes: Routes = [
  { path: 'beacon', component: BeaconPagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BeaconRoutingModule { }
