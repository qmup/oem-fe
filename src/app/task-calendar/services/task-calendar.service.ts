import { Injectable } from '@angular/core';
import { TaskCalendar } from '../models/task-calendar';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskCalendarService {

  constructor(private httpClient: HttpClient) { }

  get(managerId: number, date: string): Promise<TaskCalendar[]> {
    return this.httpClient.get<TaskCalendar[]>(
      `${environment.endPoint}${environment.apiPaths.calendar.get + managerId}`,
      {
        params: {
          date: `${date}`
        }
      }
    ).toPromise();
  }
}
