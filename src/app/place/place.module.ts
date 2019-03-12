import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaceRoutingModule } from './place-routing.module';
import { PlacePagesComponent } from './pages/place-pages/place-pages.component';
import { PlaceComponent } from './components/place/place.component';
import { MDBBootstrapModulesPro, ToastModule } from 'ng-uikit-pro-standard';
import { PlaceUpdateComponent } from './components/place-update/place-update.component';
import { FormsModule } from '@angular/forms';
import { CompanyComponent } from './components/company/company.component';
import { ZoneComponent } from './components/zone/zone.component';
import { ZoneUpdateComponent } from './components/zone-update/zone-update.component';
import { CompanyUpdateComponent } from './components/company-update/company-update.component';
import { AgmCoreModule } from '@agm/core';
import { CompanyPagesComponent } from './pages/company-pages/company-pages.component';
import { ZonePagesComponent } from './pages/zone-pages/zone-pages.component';
import { PlaceTaskBasicComponent } from './components/place-task-basic/place-task-basic.component';
import { PlaceRemoveComponent } from './components/place-remove/place-remove.component';

@NgModule({
  declarations: [
    PlacePagesComponent,
    PlaceComponent,
    PlaceUpdateComponent,
    CompanyComponent,
    ZoneComponent,
    ZoneUpdateComponent,
    CompanyUpdateComponent,
    CompanyPagesComponent,
    ZonePagesComponent,
    PlaceTaskBasicComponent,
    PlaceRemoveComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PlaceRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
    AgmCoreModule.forRoot({
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en#key
      apiKey: 'AIzaSyD02259nRLm-9mjD3-xDD9dsWyDJPv2B8k'
    }),
  ],
  entryComponents: [
    PlaceUpdateComponent,
    CompanyUpdateComponent,
    ZoneUpdateComponent,
    PlaceTaskBasicComponent,
    PlaceRemoveComponent
  ]
})
export class PlaceModule { }
