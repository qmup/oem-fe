import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ScheduleModel, Schedule, CheckScheduleOverlap } from '../models/schedule';
import { PaginationResponse } from 'src/app/core/models/shared';
import { TaskBasic } from '../models/task-basic';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private httpClient: HttpClient) { }

  create(scheduleCM: ScheduleModel, option: number): Promise<ScheduleModel> {
    return this.httpClient.post<ScheduleModel>(
      `${environment.endPoint}${environment.apiPaths.schedule.create}`, scheduleCM,
      {
        params: {
          option: `${option}`,
        }
      }
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
  getDetail(id: number): Promise<Schedule> {
    return this.httpClient.get<Schedule>(
      `${environment.endPoint}${environment.apiPaths.schedule.getDetail + id}`
    ).toPromise();
  }
  updateField(id, key, value): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.schedule.updateField + id}`,
      {
        key: `${key}`,
        value: `${value}`,
      }
    ).toPromise();
  }
  update(scheduleUM: ScheduleModel): Promise<ScheduleModel> {
    return this.httpClient.put<ScheduleModel>(
      `${environment.endPoint}${environment.apiPaths.schedule.update}`, scheduleUM
    ).toPromise();
  }
  updateTaskBasicList(scheduleId: number, taskBasic: TaskBasic[]): Promise<boolean> {
    return this.httpClient.put<boolean>(
      `${environment.endPoint}${environment.apiPaths.schedule.updateTaskBasic + scheduleId}`, taskBasic
    ).toPromise();
  }
  deleteTaskBasicList(taskBasicId: number, scheduleId: number): Promise<boolean> {
    return this.httpClient.delete<boolean>(
      `${environment.endPoint}${environment.apiPaths.schedule.deleteTaskBasic + taskBasicId}/${scheduleId}`,
    ).toPromise();
  }
  checkOverlap(
    workplaceId: number,
    assigneeId: number,
    managerId: number,
    dayOfWeeks: string,
    startTimeSchedule: string,
    duration: number,
    scheduleId: number
  ): Promise<CheckScheduleOverlap[]> {
    return this.httpClient.get<CheckScheduleOverlap[]>(
      `${environment.endPoint}${environment.apiPaths.schedule.checkOverlap}`,
      {
        params: {
          workplaceId: `${workplaceId}`,
          assigneeId: `${assigneeId}`,
          managerId: `${managerId}`,
          startTimeSchedule: `${startTimeSchedule}`,
          duration: `${duration}`,
          dayOfWeeks: `${dayOfWeeks}`,
          scheduleId: `${scheduleId}`
        }
      }
    ).toPromise();
  }
}
