import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizeRoutingModule } from './authorize-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [LoginPageComponent, ProfileComponent],
  imports: [
    CommonModule,
    AuthorizeRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  exports: [
  ]
})
export class AuthorizeModule { }
