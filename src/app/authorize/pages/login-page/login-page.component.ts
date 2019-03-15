import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { UserAccount } from '../../models/token';
import { AuthGuardService } from 'src/app/core/services/auth-guard.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  email: string;
  password: string;

  constructor(
    private globalService: GlobalService,
    private loginService: LoginService,
    private authService: AuthService,
    private authGuardService: AuthGuardService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.loginService.login(this.email, this.password)
      .then(
        (response: any) => {
          this.authGuardService.setToken(response.Authorization);
          this.authService.getInformation(this.email)
          .then(
            (response2: UserAccount) => {
              this.globalService.userAccount = response2;
              this.authGuardService.setUserAccount(this.globalService.userAccount);
              this.globalService.isLogin = true;
              this.toastService.success('Đăng nhập thành công', '', { positionClass: 'toast-bottom-right'} );
              this.router.navigate(['']);
              },
              (error: string) => {
                this.toastService.error(error, '', { positionClass: 'toast-bottom-right'} );
              }
            );
        },
        (error: any) => {
          this.globalService.isLogin = false;
        }
      );
  }

}
