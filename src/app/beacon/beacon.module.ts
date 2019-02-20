import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeaconRoutingModule } from './beacon-routing.module';
import { BeaconPagesComponent } from './pages/beacon-pages/beacon-pages.component';
import { BeaconComponent } from './components/beacon/beacon.component';
import { FormsModule } from '@angular/forms';
import { MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { BeaconUpdateComponent } from './components/beacon-update/beacon-update.component';

@NgModule({
  declarations: [
    BeaconPagesComponent,
    BeaconComponent,
    BeaconUpdateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BeaconRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  entryComponents: [
    BeaconUpdateComponent,
  ]
})
export class BeaconModule { }
