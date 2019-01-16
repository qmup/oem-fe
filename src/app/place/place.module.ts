import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaceRoutingModule } from './place-routing.module';
import { PlacePagesComponent } from './pages/place-pages/place-pages.component';
import { PlaceComponent } from './components/place/place.component';

@NgModule({
  declarations: [
    PlacePagesComponent,
    PlaceComponent
  ],
  imports: [
    CommonModule,
    PlaceRoutingModule
  ]
})
export class PlaceModule { }
