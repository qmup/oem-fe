import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ScheduleModel, Schedule } from '../models/schedule';

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
  getAll(): Promise<Schedule[]> {
    return this.httpClient.get<Schedule[]>(
      `${environment.endPoint}${environment.apiPaths.schedule.getAll}`
    ).toPromise();
  }
}
