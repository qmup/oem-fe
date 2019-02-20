import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient: HttpClient) { }

  create(scheduleCM: Task): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.task.create}`, scheduleCM
    ).toPromise();
  }
  getTaskByStatus(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskByStatus}`
    ).toPromise();
  }
  getTaskDetail(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskDetail}`
    ).toPromise();
  }
  getTaskByDate(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.task.getTaskByDate}`
    ).toPromise();
  }
  getTodayTask(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.task.getTodayTask}`
    ).toPromise();
  }
  summaryTask(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.task.summaryTask}`
    ).toPromise();
  }
}
