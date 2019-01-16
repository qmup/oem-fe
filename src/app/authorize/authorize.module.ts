import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizeRoutingModule } from './authorize-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    AuthorizeRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
  ]
})
export class AuthorizeModule { }
