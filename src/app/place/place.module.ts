import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaceRoutingModule } from './place-routing.module';
import { PlacePagesComponent } from './pages/place-pages/place-pages.component';
import { PlaceComponent } from './components/place/place.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [
    PlacePagesComponent,
    PlaceComponent
  ],
  imports: [
    CommonModule,
    PlaceRoutingModule,
    MDBBootstrapModulesPro,
  ]
})
export class PlaceModule { }
