import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskModel, TaskResponse, TaskDetail } from '../models/task';
import { environment } from 'src/environments/environment';
import { PaginationResponse } from 'src/app/core/models/shared';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) { }

  create(taskCM: TaskModel): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.task.create}`, taskCM
    ).toPromise();
  }
  getTaskByManager(
    managerId: number,
    search: string,
    sort: string,
    fieldSort: string,
    page: number,
    size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskByManager}`,
      {
        params: {
          managerId: `${managerId}`,
          search: `${search}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`,
        }
      }
    ).toPromise();
  }
  getTaskByStatus(): Promise<Task[]> {
    return this.httpClient.get<Task[]>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskByStatus}`
    ).toPromise();
  }
  getTaskDetail(taskId: number): Promise<TaskDetail> {
    return this.httpClient.get<TaskDetail>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskDetail}`,
      {
        params: {
          taskId: `${taskId}`
        }
      }
    ).toPromise();
  }
  getTaskByDate(employeeId: number, fromDate: string, toDate: string, page: number, size: number): Promise<TaskResponse> {
    return this.httpClient.get<TaskResponse>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskByDate}`,
      {
        params: {
          id: `${employeeId}`,
          fromDate: `${fromDate}`,
          toDate: `${toDate}`,
          page: `${page}`,
          size: `${size}`,
        }
      }
    ).toPromise();
  }
  getTodayTask(assigneeId: number): Promise<Task[]> {
    return this.httpClient.get<Task[]>(
      `${environment.endPoint}${environment.apiPaths.task.getTodayTask}?assigneeId=${assigneeId}`
    ).toPromise();
  }

  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.task.remove}?taskId=${id}`
    ).toPromise();
  }

  update(taskUM: TaskModel): Promise<TaskModel> {
    return this.httpClient.put<TaskModel>(
      `${environment.endPoint}${environment.apiPaths.task.update}`, taskUM
    ).toPromise();
  }
  updateWorkplace(taskId: number, workplaceId: number): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.task.updateWorkplace}/${taskId}/${workplaceId}`, {}
    ).toPromise();
  }
  getTodayTaskByEmployee(assignerId: number) {
    return this.httpClient.get<Task[]>(
      `${environment.endPoint}${environment.apiPaths.task.getTodayTask}?assignerId=${assignerId}`
    ).toPromise();
  }

  search(searchRequest: string, sortRequest: string, filterRequest: string, managerId: number, page: number, size: number): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.search.search}`,
      {
        params: {
          managerId: `${managerId}`,
          searchRequest: `${searchRequest}`,
          sortRequest: `${sortRequest}`,
          filterRequest: `${filterRequest}`,
          page: `${page}`,
          size: `${size}`,
        }
      }
    ).toPromise();
  }

}
