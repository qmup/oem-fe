import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'view-profile', component: ProfilePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizeRoutingModule { }
