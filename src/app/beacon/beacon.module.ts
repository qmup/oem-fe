import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeaconRoutingModule } from './beacon-routing.module';
import { BeaconPagesComponent } from './pages/beacon-pages/beacon-pages.component';
import { BeaconComponent } from './components/beacon/beacon.component';
import { FormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [
    BeaconPagesComponent,
    BeaconComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BeaconRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
  ]
})
export class BeaconModule { }
