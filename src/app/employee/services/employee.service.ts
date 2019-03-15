import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee';
import { PaginationResponse } from 'src/app/core/models/shared';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private httpClient: HttpClient) { }

  create(employeeCM: Employee): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.employee.create}`, employeeCM
    ).toPromise();
  }

  getEmployeeByManager(
    managerId: number,
    roleId: number,
    sort: string,
    fieldSort: string,
    page: number,
    size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.employee.getEmployeeByManager}`,
      {
        params: {
          managerID: `${managerId}`,
          roleID: `${roleId}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`
        }
      }
    ).toPromise();
  }

  getRole(): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.employee.getAllRole}`,
    ).toPromise();
  }

  getByManager(managerId: number, sort: string, fieldSort: string, page: number, size: number): Promise<Employee[]> {
    return this.httpClient.get<Employee[]>(
      `${environment.endPoint}${environment.apiPaths.employee.get}`,
      {
        params: {
          managerID: `${managerId}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`
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

  update(employeeUM: Employee): Promise<Employee> {
    return this.httpClient.put<Employee>(
      `${environment.endPoint}${environment.apiPaths.employee.update}`, employeeUM
    ).toPromise();
  }

  getByRole(roleId: number, search: string, sort: string, fieldSort: string, page: number, size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.employee.getByRole}`,
      {
        params: {
          roleID: `${roleId}`,
          search: `${search}`,
          fieldSort: `${fieldSort}`,
          sort: `${sort}`,
          page: `${page}`,
          size: `${size}`
        },
      }
    ).toPromise();
  }

  checkExist(username: string): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.employee.checkExist}`,
      {
        params: {
          username: `${username}`
        }
      }
    ).toPromise();
  }

  updateField(id, key, value): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.employee.updateField}${id}`,
        {
          key: `${key}`,
          value: `${value}`
        }
      ).toPromise();
  }
}
