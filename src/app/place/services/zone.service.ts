import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ZoneModel, Zone, ZonePagination } from '../models/zone';
import { PaginationResponse } from 'src/app/core/models/shared';
import { PlacePagination } from '../models/place';

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
  getByCompany(
    companyId: number,
    search: string,
    sort: string,
    fieldSort: string,
    page: number,
    size: number): Promise<ZonePagination> {
    return this.httpClient.get<ZonePagination>(
      `${environment.endPoint}${environment.apiPaths.zone.getByCompany}/${companyId}`,
      {
        params: {
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
      `${environment.endPoint}${environment.apiPaths.zone.remove}/${id}`
    ).toPromise();
  }
  update(zoneUM: ZoneModel): Promise<Zone> {
    return this.httpClient.put<Zone>(
      `${environment.endPoint}${environment.apiPaths.zone.update}`, zoneUM
    ).toPromise();
  }
  getAll(
    managerId: number,
    companyId: number,
    search: string,
    sort: string,
    fieldSort: string,
    page: number,
    size: number): Promise<ZonePagination> {
    return this.httpClient.get<ZonePagination>(
      `${environment.endPoint}${environment.apiPaths.zone.getByManager + managerId}/${companyId}`,
      {
        params: {
          search: `${search}`,
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`
        }
      }
    ).toPromise();
  }
}
