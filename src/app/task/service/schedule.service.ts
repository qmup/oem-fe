import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ScheduleModel, Schedule } from '../models/schedule';
import { PaginationResponse } from 'src/app/core/models/shared';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private httpClient: HttpClient) { }

  create(scheduleCM: ScheduleModel): Promise<ScheduleModel> {
    return this.httpClient.post<ScheduleModel>(
      `${environment.endPoint}${environment.apiPaths.schedule.create}`, scheduleCM
    ).toPromise();
  }
  getAll(search: string, managerId: number, sort: string, fieldSort: string, page: number, size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.schedule.getAll}`,
      {
        params: {
          search: `${search}`,
          managerId: `${managerId}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`,
        }
      }
    ).toPromise();
  }
  getDetail(): Promise<Schedule> {
    return this.httpClient.get<Schedule>(
      `${environment.endPoint}${environment.apiPaths.schedule.getDetail}`
    ).toPromise();
  }
  updateField(id, key, value): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.schedule.create + id}`,
      {
        params: {
          key: `${key}`,
          value: `${value}`,
        }
      }
    ).toPromise();
  }
}
