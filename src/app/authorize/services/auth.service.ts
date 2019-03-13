import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserAccount } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  getInformation(username: string): Promise<UserAccount> {
    return this.httpClient.post<UserAccount>(
      `${environment.endPoint}${environment.apiPaths.authorize.getInformation}`, { username }
    ).toPromise();
  }
}
