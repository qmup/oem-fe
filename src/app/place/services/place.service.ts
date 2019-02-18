import { Place } from '../models/place';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  constructor(private httpClient: HttpClient) { }

  create(place: Place): Promise<any> {
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.admin.workplace.create}`, place
    ).toPromise();
  }

  getAll(): Promise<Place[]> {
    return this.httpClient.get<Place[]>(
      `${environment.endPoint}${environment.apiPaths.admin.workplace.getAll}`,
    ).toPromise();
  }

  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.admin.workplace.remove + id}`
    ).toPromise();
  }

  update(place: Place): Promise<Place> {
    return this.httpClient.put<Place>(
      `${environment.endPoint}${environment.apiPaths.admin.workplace.update}`, place
    ).toPromise();
  }
}
