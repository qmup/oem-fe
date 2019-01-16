import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlacePagesComponent } from './pages/place-pages/place-pages.component';

const routes: Routes = [
  { path: 'place', component: PlacePagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaceRoutingModule { }
