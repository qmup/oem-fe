import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ZoneModel, Zone } from '../models/zone';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  constructor(private httpClient: HttpClient) { }

  create(zoneCM: ZoneModel): Promise<any> {
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.zone.create}`, zoneCM
    ).toPromise();
  }
  // getAll(): Promise<Zone[]> {
  //   return this.httpClient.get<Zone[]>(
  //     `${environment.endPoint}${environment.apiPaths.zone.}`
  //   ).toPromise();
  // }
  getByCompany(): Promise<Zone[]> {
    return this.httpClient.get<Zone[]>(
      `${environment.endPoint}${environment.apiPaths.zone.getByCompany}`
    ).toPromise();
  }
  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.zone.remove}?zoneId=${id}`
    ).toPromise();
  }
  update(zoneUM: ZoneModel): Promise<Zone> {
    return this.httpClient.put<Zone>(
      `${environment.endPoint}${environment.apiPaths.zone.update}`, zoneUM
    ).toPromise();
  }
}
