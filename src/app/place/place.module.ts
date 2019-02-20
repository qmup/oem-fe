import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaceRoutingModule } from './place-routing.module';
import { PlacePagesComponent } from './pages/place-pages/place-pages.component';
import { PlaceComponent } from './components/place/place.component';
import { MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { PlaceUpdateComponent } from './components/place-update/place-update.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PlacePagesComponent,
    PlaceComponent,
    PlaceUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PlaceRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  entryComponents: [
    PlaceUpdateComponent,
  ]
})
export class PlaceModule { }
