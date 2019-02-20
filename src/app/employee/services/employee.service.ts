import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Employee, EmployeeCreateModel, EmployeeUpdateModel } from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpClient: HttpClient) { }

  create(employeeCM: EmployeeCreateModel): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.employee.create}`, employeeCM
    ).toPromise();
  }

  getByManager(managerId?): Promise<Employee[]> {
    return this.httpClient.get<Employee[]>(
      `${environment.endPoint}${environment.apiPaths.employee.get}`,
      {
        params: {
          managerId: managerId,
        },
      }
    ).toPromise();
  }

  getById(employeeId: number): Promise<Employee> {
    return this.httpClient.get<Employee>(
      `${environment.endPoint}${environment.apiPaths.employee.getById + employeeId}`
    ).toPromise();
  }

  getAll(): Promise<Employee[]> {
    return this.httpClient.get<Employee[]>(
      `${environment.endPoint}${environment.apiPaths.employee.getAll}`,
    ).toPromise();
  }

  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.employee.remove + id}`
    ).toPromise();
  }

  update(employeeUM: EmployeeUpdateModel): Promise<EmployeeUpdateModel> {
    return this.httpClient.put<EmployeeUpdateModel>(
      `${environment.endPoint}${environment.apiPaths.employee.update}`, employeeUM
    ).toPromise();
  }
}
