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
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.admin.employee.create}`, employeeCM
    ).toPromise();
  }

  getByManager(managerId?): Promise<Employee[]> {
    return this.httpClient.get<Employee[]>(
      `${environment.endPoint}${environment.apiPaths.admin.employee.get}`,
      {
        params: {
          managerId: managerId,
        },
      }
    ).toPromise();
  }

  getAll(): Promise<Employee[]> {
    return this.httpClient.get<Employee[]>(
      `${environment.endPoint}${environment.apiPaths.admin.employee.getAll}`,
    ).toPromise();
  }

  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.admin.employee.remove + id}`
    ).toPromise();
  }

  update(employeeUM: EmployeeUpdateModel): Promise<EmployeeUpdateModel> {
    return this.httpClient.put<EmployeeUpdateModel>(
      `${environment.endPoint}${environment.apiPaths.admin.employee.update + employeeUM.id}`, employeeUM
    ).toPromise();
  }
}
