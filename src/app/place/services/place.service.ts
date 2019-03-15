import { Place, PlaceModel, ManageWorkplace, PlacePagination } from '../models/place';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskBasic } from 'src/app/task/models/task-basic';
import { PaginationResponse } from 'src/app/core/models/shared';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private httpClient: HttpClient) { }

  create(placeCM: PlaceModel): Promise<any> {
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.workplace.create}`, placeCM
    ).toPromise();
  }

  getAll(zoneId: number, search: string, sort: string, fieldSort: string, page: number, size: number): Promise<PlacePagination> {
    return this.httpClient.get<PlacePagination>(
      `${environment.endPoint}${environment.apiPaths.workplace.getAll}`,
      {
        params: {
          zoneId: `${zoneId}`,
          search: `${search}`,
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
  getWorkplaceByManager(managerId: number, sort: string, fieldSort: string, page: number, size: number ): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.workplace.getByManager}`,
      {
        params: {
          managerID: `${managerId}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`
        }
      }
    ).toPromise();
  }
  addManagerToWorkplace(manageWorkplace: ManageWorkplace): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.addManager}`, manageWorkplace,
      {
        responseType: 'text' as 'json'
      }
    ).toPromise();
  }
  removeFromManager(managerId: number, workplaceId: number): Promise<any> {
    return this.httpClient.delete<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.removeFromManager}/${managerId}/${workplaceId}`,
    ).toPromise();
  }
  addTaskToWorkplace(taskId: number, workplaceId: number): Promise<any> {
    return this.httpClient.post<any>(
      `${environment.endPoint}${environment.apiPaths.workplace.addTaskToWorkplace}/${taskId}/${workplaceId}`, {}
    ).toPromise();
  }
}
