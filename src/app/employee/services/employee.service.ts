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
    status: number,
    managerId: number,
    search: string,
    sort: string,
    fieldSort: string,
    page: number,
    size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.employee.getEmployeeByManager}`,
      {
        params: {
          status: `${status}`,
          managerId: `${managerId}`,
          search: `${search}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`
        }
      }
    ).toPromise();
  }

  getAvailableEmployee(
    managerId: number,
    // search: string,
    sort: string,
    fieldSort: string,
    page: number,
    size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.employee.getAvailableEmployee}`,
      {
        params: {
          managerId: `${managerId}`,
          // search: `${search}`,
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

  getById(employeeId: number): Promise<Employee> {
    return this.httpClient.get<Employee>(
      `${environment.endPoint}${environment.apiPaths.employee.getById}?id=${employeeId}`
    ).toPromise();
  }

  getAll(search: string, status: number, sort: string, fieldSort: string, page: number, size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.employee.getAll}`,
      {
        params: {
          search: `${search}`,
          status: `${status}`,
          fieldSort: `${fieldSort}`,
          sort: `${sort}`,
          page: `${page}`,
          size: `${size}`
        }
      }
    ).toPromise();
  }

  getRemovedEmployee(sort: string, fieldSort: string, page: number, size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.employee.getRemovedEmployee}`,
      {
        params: {
          fieldSort: `${fieldSort}`,
          sort: `${sort}`,
          page: `${page}`,
          size: `${size}`
        }
      }
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

  checkDuplicateId(employeeId: string): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.employee.checkDuplicateId}`,
      {
        params: {
          employeeId: `${employeeId}`
        }
      }
    ).toPromise();
  }

  checkConstraint(employeeId: number): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.employee.checkEmployeeConstraint}`,
      {
        params: {
          employeeId: `${employeeId}`
        }
      }
    ).toPromise();
  }

  checkMac(phoneMacAddress: string): Promise<boolean> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.employee.checkMac}`,
      {
        params: {
          macAddress: `${phoneMacAddress}`
        }
      }
    ).toPromise();
  }

  suggest(managerId: number, workplaceId: number, date: string, startTime: string, duration: number) {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.employee.suggestion}`,
      {
        params: {
          managerId: `${managerId}`,
          workplaceId: `${workplaceId}`,
          date: `${date}`,
          startTime: `${startTime}`,
          duration: `${duration}`,
        }
      }
    ).toPromise();
  }
  checkAvailableForTask(
    managerId: number,
    fromTo: string,
    startTimeTask: string,
    endTimeTask: string,
    sort: string,
    fieldSort: string,
    page: number,
    size: number
  ) {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.employee.checkAvailableForTask}`,
      {
        params: {
          managerId: `${managerId}`,
          fromTo: `${fromTo}`,
          startTimeTask: `${startTimeTask}`,
          endTimeTask: `${endTimeTask}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`,
        }
      }
    ).toPromise();
  }
}
