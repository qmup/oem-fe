import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlacePagesComponent } from './pages/place-pages/place-pages.component';
import { ZonePagesComponent } from './pages/zone-pages/zone-pages.component';
import { CompanyPagesComponent } from './pages/company-pages/company-pages.component';

const routes: Routes = [
  { path: 'company', component: CompanyPagesComponent },
  { path: 'zone/:id', component: ZonePagesComponent },
  { path: 'place/:id', component: PlacePagesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaceRoutingModule { }
