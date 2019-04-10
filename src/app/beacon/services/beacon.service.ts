import { Injectable } from '@angular/core';
import { Beacon } from '../models/beacon';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationResponse } from 'src/app/core/models/shared';

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

  getAll(sort: string, search: string, fieldSort: string, page: number, size: number): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.beacon.getAll}`,
      {
        params: {
          sort: `${sort}`,
          search: `${search}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`
        }
      }
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

  getAvailableBeacon(): Promise<Beacon[]> {
    return this.httpClient.get<Beacon[]>(
      `${environment.endPoint}${environment.apiPaths.beacon.getAvailable}`,
    ).toPromise();
  }
  checkRemove(beaconId: number): Promise<any> {
    return this.httpClient.get<Beacon[]>(
      `${environment.endPoint}${environment.apiPaths.beacon.checkRemove + beaconId}`,
    ).toPromise();
  }
}
