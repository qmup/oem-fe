import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerPagesComponent } from './pages/manager-pages/manager-pages.component';
import { ManagerComponent } from './components/manager/manager.component';

@NgModule({
  declarations: [
    ManagerPagesComponent,
    ManagerComponent
  ],
  imports: [
    CommonModule,
    ManagerRoutingModule
  ]
})
export class ManagerModule { }
