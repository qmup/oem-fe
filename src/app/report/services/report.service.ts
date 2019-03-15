import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskReport, TaskModel } from '../models/report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClient: HttpClient) { }

  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.report.delete + id}`
    ).toPromise();
  }
  getByTaskId(taskId: number): Promise<TaskReport[]> {
    return this.httpClient.get<TaskReport[]>(
      `${environment.endPoint}${environment.apiPaths.report.getByTaskId + taskId}`,
    ).toPromise();
  }
  update(reportUM: TaskModel) {
    return this.httpClient.put<TaskModel>(
      `${environment.endPoint}${environment.apiPaths.workplace.update}`, reportUM,
    ).toPromise();
  }
}
