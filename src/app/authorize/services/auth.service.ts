import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Employee } from 'src/app/employee/models/employee';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  getInformation(email: string): Promise<Employee> {
    return this.httpClient.get<Employee>(
      `${environment.endPoint}${environment.apiPaths.employee.getByEmail}`,
      {
        params: {
          email: `${email}`
        }
      }
    ).toPromise();
  }

  updateToken(employeeId: number, tokenValue: number): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.authorize.updateField}${employeeId}`,
      {
        key: 'tokenFirebase',
        value: `${tokenValue}`,
      }
    ).toPromise();
  }
}
