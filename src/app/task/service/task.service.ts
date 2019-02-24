import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task, TaskModel } from '../models/task';
import { environment } from 'src/environments/environment';

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
  getTaskByManager(managerId: number): Promise<Task[]> {
    return this.httpClient.get<Task[]>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskByManager}?managerId=${managerId}`
    ).toPromise();
  }
  getTaskByStatus(): Promise<Task[]> {
    return this.httpClient.get<Task[]>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskByStatus}`
    ).toPromise();
  }
  getTaskDetail(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskDetail}`
    ).toPromise();
  }
  getTaskByDate(id: number, fromDate: string, toDate: string): Promise<Task[]> {
    return this.httpClient.get<Task[]>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskByDate}`,
      {
        params: {
          id: `${id}`,
          fromDate: `${fromDate}`,
          toDate: `${toDate}`
        }
      }
    ).toPromise();
  }
  getTodayTask(): Promise<Task[]> {
    return this.httpClient.get<Task[]>(
      `${environment.endPoint}${environment.apiPaths.task.getTodayTask}`
    ).toPromise();
  }
  summaryTask(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.task.summaryTask}`
    ).toPromise();
  }

  removeTask(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.task.remove}?taskId=${id}`
    ).toPromise();
  }

  updateTask(taskUM: TaskModel): Promise<TaskModel> {
    return this.httpClient.put<TaskModel>(
      `${environment.endPoint}${environment.apiPaths.task.update}`, taskUM
    ).toPromise();
  }

}
