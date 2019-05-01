import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SummaryTask } from '../models/summary-task';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private httpClient: HttpClient) { }

  summary(managerId: number, from: string, to: string, employeeId?: number): Promise<SummaryTask> {
    return this.httpClient.get<SummaryTask>(
      `${environment.endPoint}${environment.apiPaths.task.summary}`,
      {
        params: {
          managerId: `${managerId}`,
          employeeId: employeeId ? `${employeeId}` : `0`,
          fromDate: `${from}`,
          toDate: `${to}`
        }
      }
    ).toPromise();
  }

  // summaryEmployeeTask(id: number, from: string, to: string): Promise<SummaryTask> {
  //   return this.httpClient.get<SummaryTask>(
  //     `${environment.endPoint}${environment.apiPaths.task.summaryTaskByEmployee}?employeeId=${id}&fromDate=${from}&toDate=${to}`
  //   ).toPromise();
  // }
}
