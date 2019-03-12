import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskBasic, TaskBasicManager } from '../models/task-basic';
import { environment } from 'src/environments/environment';
import { PaginationResponse } from 'src/app/core/models/shared';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskBasicService {

  constructor(private httpClient: HttpClient) { }

  create(taskCM: Task): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.task.create}`, taskCM
    ).toPromise();
  }
  getTaskBasic(search: string, sort: string, fieldShort: string, page: number, size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.taskBasic.get}`,
      {
        params: {
          search: `${search}`,
          sort: `${sort}`,
          fieldShort: `${fieldShort}`,
          page: `${page}`,
          size: `${size}`,
        }
      }
    ).toPromise();
  }
  removeTaskBasic(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.task.remove}?taskId=${id}`
    ).toPromise();
  }

  updateTaskBasic(taskUM: Task): Promise<Task> {
    return this.httpClient.put<Task>(
      `${environment.endPoint}${environment.apiPaths.task.update}`, taskUM
    ).toPromise();
  }

  getListTaskBasic(
    managerId: number, search: string, sort: string, fieldShort: string, page: number, size: number
  ): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.taskBasic.getListBasic}${managerId}`,
      {
        params: {
          search: `${search}`,
          sort: `${sort}`,
          fieldShort: `${fieldShort}`,
          page: `${page}`,
          size: `${size}`,
        }
      }
    ).toPromise();
  }

  setToManager(taskBasicManager: TaskBasicManager): Promise<PaginationResponse> {
    return this.httpClient.post<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.taskBasic.setToManager}`, taskBasicManager
    ).toPromise();
  }

}
