import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlacePagesComponent } from './pages/place-pages/place-pages.component';
import { ZonePagesComponent } from './pages/zone-pages/zone-pages.component';
import { CompanyPagesComponent } from './pages/company-pages/company-pages.component';
import { AuthGuardService } from '../core/services/auth-guard.service';

const routes: Routes = [
  { path: 'company', component: CompanyPagesComponent, canActivate: [AuthGuardService] },
  { path: 'zone/:id', component: ZonePagesComponent, canActivate: [AuthGuardService] },
  { path: 'place/:id', component: PlacePagesComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaceRoutingModule { }
