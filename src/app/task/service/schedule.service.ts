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

  create(scheduleCM: Schedule): Promise<Schedule> {
    return this.httpClient.post<Schedule>(
      `${environment.endPoint}${environment.apiPaths.schedule.create}`, scheduleCM
    ).toPromise();
  }
  getAll(): Promise<Schedule[]> {
    return this.httpClient.get<Schedule[]>(
      `${environment.endPoint}${environment.apiPaths.schedule.getAll}`
    ).toPromise();
  }
}
