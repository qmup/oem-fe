import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthorizeRoutingModule } from './authorize-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { ProfileComponent } from './components/profile/profile.component';
import { FormsModule } from '@angular/forms';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { ProfileUpdateInformationComponent } from './components/profile-update-information/profile-update-information.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ProfileUpdateAvatarComponent } from './components/profile-update-avatar/profile-update-avatar.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { OwlInputModule, OwlFormFieldModule } from 'owl-ng';
import { ProfileChangePasswordComponent } from './components/profile-change-password/profile-change-password.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    ProfileComponent,
    UserInfoComponent,
    ProfilePageComponent,
    ProfileUpdateAvatarComponent,
    ProfileUpdateInformationComponent,
    ProfileChangePasswordComponent
  ],
  imports: [
    CommonModule,
    AuthorizeRoutingModule,
    FormsModule,
    MDBBootstrapModulesPro.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlFormFieldModule,
    OwlInputModule,
  ],
  exports: [
    UserInfoComponent,
  ],
  entryComponents: [
    ProfileUpdateAvatarComponent,
    ProfileUpdateInformationComponent,
    ProfileChangePasswordComponent,
  ]
})
export class AuthorizeModule { }
