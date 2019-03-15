import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizeRoutingModule } from './authorize-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule } from '@angular/forms';
import { UserInfoComponent } from './components/user-info/user-info.component';

@NgModule({
  declarations: [LoginPageComponent, ProfileComponent, UserInfoComponent],
  imports: [
    CommonModule,
    AuthorizeRoutingModule,
    FormsModule,
    MDBBootstrapModulesPro.forRoot(),
  ],
  exports: [
    UserInfoComponent,
  ]
})
export class AuthorizeModule { }
