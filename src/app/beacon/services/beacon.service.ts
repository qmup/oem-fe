import { Injectable } from '@angular/core';
import { Beacon } from '../models/beacon';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BeaconService {

  constructor(private httpClient: HttpClient) { }

  create(beacon: Beacon): Promise<any> {
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.beacon.create}`, beacon
    ).toPromise();
  }

  getAll(): Promise<Beacon[]> {
    return this.httpClient.get<Beacon[]>(
      `${environment.endPoint}${environment.apiPaths.beacon.getAll}`,
    ).toPromise();
  }

  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.beacon.remove + id}`
    ).toPromise();
  }

  update(beacon: Beacon): Promise<Beacon> {
    return this.httpClient.put<Beacon>(
      `${environment.endPoint}${environment.apiPaths.beacon.update}`, beacon
    ).toPromise();
  }
  updateField(id, key, value): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.beacon.updateField}${id}`,
        {
          key: `${key}`,
          value: `${value}`
        }
      ).toPromise();
  }

  getByWorkplace(workplaceId: number): Promise<Beacon> {
    return this.httpClient.get<Beacon>(
      `${environment.endPoint}${environment.apiPaths.beacon.getByWorkplace}?workplaceId=${workplaceId}`,
    ).toPromise();
  }

  getAvailableBeacon(): Promise<Beacon[]> {
    return this.httpClient.get<Beacon[]>(
      `${environment.endPoint}${environment.apiPaths.beacon.getAvailable}`,
    ).toPromise();
  }
}
