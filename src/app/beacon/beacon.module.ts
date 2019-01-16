import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeaconRoutingModule } from './beacon-routing.module';
import { BeaconPagesComponent } from './pages/beacon-pages/beacon-pages.component';
import { BeaconComponent } from './components/beacon/beacon.component';

@NgModule({
  declarations: [
    BeaconPagesComponent,
    BeaconComponent
  ],
  imports: [
    CommonModule,
    BeaconRoutingModule
  ]
})
export class BeaconModule { }
