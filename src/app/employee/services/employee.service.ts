import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Employee, EmployeeCreateModel, EmployeeUpdateModel } from '../models/employee';
import { PaginationResponse } from 'src/app/core/models/shared';

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

  getEmployeeByManager(managerId, sort, page, size ): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.employee.getEmployeeByManager}`,
      {
        params: {
          search: managerId,
          sort: sort,
          page: page,
          size: size
        }
      }
    ).toPromise();
  }

  getByManager(managerId, sort, page, size): Promise<Employee[]> {
    return this.httpClient.get<Employee[]>(
      `${environment.endPoint}${environment.apiPaths.employee.get}`,
      {
        params: {
          search: managerId,
          sort: sort,
          page: page,
          size: size
        },
      }
    ).toPromise();
  }

  getById(employeeId: number): Promise<Employee> {
    return this.httpClient.get<Employee>(
      `${environment.endPoint}${environment.apiPaths.employee.getById}?id=${employeeId}`
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
