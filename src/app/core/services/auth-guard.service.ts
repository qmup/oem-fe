import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserAccount } from 'src/app/authorize/models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = this.getToken();
    if (!token) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

  getToken(): string {
    let token: string;
    try {
      token = JSON.parse(localStorage.getItem(environment.token));
    } catch (exception) {

    }
    return token;
  }

  setToken(token: string) {
    localStorage.setItem(environment.token, JSON.stringify(token));
  }

  setUserAccount(userAccount: UserAccount) {
    localStorage.setItem(environment.account, JSON.stringify(userAccount));
  }

  clearToken() {
    localStorage.clear();
  }
}
