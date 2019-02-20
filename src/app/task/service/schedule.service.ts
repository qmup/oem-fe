import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task';
import { environment } from 'src/environments/environment';
import { Schedule } from '../models/schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private httpClient: HttpClient) { }

  create(scheduleCM: Schedule): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.manager.schedule.create}`, scheduleCM
    ).toPromise();
  }
  getTaskByStatus(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.manager.schedule.getTaskByStatus}`
    ).toPromise();
  }
  getTaskDetail(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.manager.schedule.getTaskDetail}`
    ).toPromise();
  }
  getTaskByDate(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.manager.schedule.getTaskByDate}`
    ).toPromise();
  }
  getTodayTask(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.manager.schedule.getTodayTask}`
    ).toPromise();
  }
  summaryTask(): Promise<Task> {
    return this.httpClient.get<Task>(
      `${environment.endPoint}${environment.apiPaths.manager.schedule.summaryTask}`
    ).toPromise();
  }
}
