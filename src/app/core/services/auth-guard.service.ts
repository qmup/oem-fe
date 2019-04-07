import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Employee } from 'src/app/employee/models/employee';
import { Token } from 'src/app/authorize/models/token';
import { ToastService } from 'ng-uikit-pro-standard';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private router: Router,
    private globalService: GlobalService,
    private toastService: ToastService) { }

  canActivate(): boolean {
    const token = this.getToken();
    const now = new Date().getTime();
    if (!token || token.expired_time < now) {
      this.clearToken();
      this.globalService.isLogin = false;
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  getToken(): Token {
    let token: Token;
    try {
      token = JSON.parse(localStorage.getItem(environment.token));
    } catch (exception) {

    }
    return token;
  }

  setToken(token: Token) {
    localStorage.setItem(environment.token, JSON.stringify(token));
  }

  setUserAccount(employee: Employee) {
    localStorage.setItem(environment.account, JSON.stringify(employee));
  }

  clearToken() {
    localStorage.clear();
  }
}
