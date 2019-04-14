import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { AuthGuardService } from 'src/app/core/services/auth-guard.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { Employee } from 'src/app/employee/models/employee';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Token } from '../../models/token';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  email: string;
  password: string;
  wrongUsernameOrPassword = false;
  constructor(
    private globalService: GlobalService,
    private loginService: LoginService,
    private authService: AuthService,
    private authGuardService: AuthGuardService,
    private toastService: ToastService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.globalService.isLogin) {
      this.router.navigate(['']);
    }
  }

  login() {
    this.loginService.login(this.email, this.password)
      .then(
        (response: Token) => {
          this.setExpiredTime(response);
          this.authService.getInformation(this.email)
          .then(
            (response2: Employee) => {
              this.globalService.oldPassword = this.password;
              this.globalService.userAccount = response2;
              this.wrongUsernameOrPassword = false;
              this.authGuardService.setUserAccount(this.globalService.userAccount);
              this.globalService.isLogin = true;
              this.globalService.avatar = response2.picture;
              this.notificationService.requestPermission(response2.id);
              this.toastService.success('Đăng nhập thành công', '', { positionClass: 'toast-bottom-right'} );
              this.router.navigate(['']);
              },
              (error: string) => {
                this.toastService.error(error, '', { positionClass: 'toast-bottom-right'} );
              }
            );
        },
        () => {
          this.globalService.isLogin = false;
          this.wrongUsernameOrPassword = true;
        }
      );
  }

  setExpiredTime(token: Token) {
    const now = new Date().getTime();
    token.expired_time = now + token.expired_time;
    this.authGuardService.setToken(token);
  }

}
