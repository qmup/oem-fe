import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Promise<Token> {
    return this.httpClient.post<Token>(
      `${environment.endPoint}${environment.apiPaths.authorize.login}`,
      {
        username: `${username}`,
        password: `${password}`,
      }
    ).toPromise();
  }
}
