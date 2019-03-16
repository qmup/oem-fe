import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ZoneModel, Zone } from '../models/zone';
import { PaginationResponse } from 'src/app/core/models/shared';

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
  getByCompany(companyId: number): Promise<Zone[]> {
    return this.httpClient.get<Zone[]>(
      `${environment.endPoint}${environment.apiPaths.zone.getByCompany}?companyId=${companyId}`
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
  getZoneByManager(managerId: number, sort: string, fieldSort: string, page: number, size: number ): Promise<PaginationResponse> {
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
}
