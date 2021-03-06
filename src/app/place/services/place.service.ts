import { Place, PlaceModel, ManageWorkplace, PlacePagination, CheckWorkplaceOverlap } from '../models/place';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskBasic } from 'src/app/task/models/task-basic';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private httpClient: HttpClient) { }

  create(placeCM: PlaceModel, managerId: number): Promise<any> {
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.workplace.create}/${managerId}`, placeCM
    ).toPromise();
  }

  getAll(
    zoneId: number,
    search: string,
    status: any,
    sort: string,
    fieldSort: string,
    page: number,
    size: number): Promise<PlacePagination> {
    return this.httpClient.get<PlacePagination>(
      `${environment.endPoint}${environment.apiPaths.workplace.getAll}`,
      {
        params: {
          zoneId: `${zoneId}`,
          search: `${search}`,
          status: `${status}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`
        }
      }
    ).toPromise();
  }

  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.workplace.remove + id}`
    ).toPromise();
  }

  update(placeUM: PlaceModel): Promise<Place> {
    return this.httpClient.put<Place>(
      `${environment.endPoint}${environment.apiPaths.workplace.update}`, placeUM
    ).toPromise();
  }
  getTaskBasic(workplaceId: number): Promise<TaskBasic[]> {
    return this.httpClient.get<TaskBasic[]>(
      `${environment.endPoint}${environment.apiPaths.workplace.getTaskBasic}${workplaceId}`,
    ).toPromise();
  }
  addTask(taskBasicData): Promise<any> {
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.workplace.addTask}`, taskBasicData
    ).toPromise();
  }
  getWorkplaceByManager(
    managerId: number,
    search: string,
    zoneId: any,
    status: number,
    sort: string,
    fieldSort: string,
    page: number,
    size: number ): Promise<PlacePagination> {
    return this.httpClient.get<PlacePagination>(
      `${environment.endPoint}${environment.apiPaths.workplace.getByManager + managerId}`,
      {
        params: {
          zoneId: `${zoneId}`,
          search: `${search}`,
          sort: `${sort}`,
          status: `${status}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`
        }
      }
    ).toPromise();
  }
  updateManager(id, key, value): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.updateManager + id}`,
      {
        key: `${key}`,
        value: `${value}`
      }
    ).toPromise();
  }
  removeFromManager(managerId: number, workplaceId: number): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.removeFromManager}/${managerId}/${workplaceId}`, {},
    ).toPromise();
  }
  addTaskToWorkplace(taskId: number, workplaceId: number): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.addTaskToWorkplace}/${taskId}/${workplaceId}`, {}
    ).toPromise();
  }

  updateField(id, key, value): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.updateField + id}`,
        {
          key: `${key}`,
          value: `${value}`
        }
      ).toPromise();
  }

  getAvailableByDate(
    managerId: number,
    search: string,
    status: number,
    zoneId: any,
    date: string,
    sort: string,
    fieldSort: string,
    page: number,
    size: number
  ): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.getAvailableByDate + managerId}`,
      {
        params: {
          zoneId: `${zoneId}`,
          search: `${search}`,
          status: `${status}`,
          date: `${date}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`
        }
      }
    ).toPromise();
  }

  checkRemove(workplaceId: number): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.checkRemove + workplaceId}`,
    ).toPromise();
  }
  checkRemoveManager(assigner: number, workplaceId: number): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.checkRemoveManager + assigner}/${workplaceId}`,
    ).toPromise();
  }

  checkOverlap(workplaceId: number, managerId: number, fromTo: string, startTime, endTime): Promise<CheckWorkplaceOverlap> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.checkOverlap}`,
      {
        params: {
          workplaceId: `${workplaceId}`,
          managerId: `${managerId}`,
          fromTo: `${fromTo}`,
          startTimeTask: `${startTime}`,
          endTimeTask: `${endTime}`,
        }
      }
    ).toPromise();
  }
}
