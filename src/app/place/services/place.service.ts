import { Place, PlaceModel } from '../models/place';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TaskBasic } from 'src/app/task/models/task-basic';

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

  getAll(zoneId: number): Promise<Place[]> {
    return this.httpClient.get<Place[]>(
      `${environment.endPoint}${environment.apiPaths.workplace.getAll}?zoneId=${zoneId}`,
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
}
