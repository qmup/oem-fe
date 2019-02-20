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
      `${environment.endPoint}${environment.apiPaths.admin.beacon.create}`, beacon
    ).toPromise();
  }

  getAll(): Promise<Beacon[]> {
    return this.httpClient.get<Beacon[]>(
      `${environment.endPoint}${environment.apiPaths.admin.beacon.getAll}`,
    ).toPromise();
  }

  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.admin.beacon.remove + id}`
    ).toPromise();
  }

  update(beacon: Beacon): Promise<Beacon> {
    return this.httpClient.put<Beacon>(
      `${environment.endPoint}${environment.apiPaths.admin.beacon.update}`, beacon
    ).toPromise();
  }

  getByWorkplace(workplaceId: number): Promise<Beacon> {
    return this.httpClient.get<Beacon>(
      `${environment.endPoint}${environment.apiPaths.admin.beacon.getByWorkplace + workplaceId}`,
    ).toPromise();
  }
}
