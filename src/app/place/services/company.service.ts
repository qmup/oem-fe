import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company';
import { PaginationResponse } from 'src/app/core/models/shared';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpClient: HttpClient) { }

  create(companyCM: Company): Promise<any> {
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.company.create}`, companyCM
    ).toPromise();
  }
  getAll(
    sort: string, search: string, fieldSort: string, status: number, page: number, size: number
  ): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.company.getAll}`,
      {
        params: {
          sort: `${sort}`,
          search: `${search}`,
          fieldSort: `${fieldSort}`,
          status: `${status}`,
          page: `${page}`,
          size: `${size}`
        }
      }
    ).toPromise();
  }
  getById(): Promise<Company> {
    return this.httpClient.get<Company>(
      `${environment.endPoint}${environment.apiPaths.company.getById}`
    ).toPromise();
  }
  remove(id: number): Promise<any> {
    return this.httpClient.put(
      `${environment.endPoint}${environment.apiPaths.company.remove}/${id}`, {}
    ).toPromise();
  }
  update(companyUM: Company): Promise<Company> {
    return this.httpClient.put<Company>(
      `${environment.endPoint}${environment.apiPaths.company.update}`, companyUM
    ).toPromise();
  }
  getCompanyByManager(
    managerId: number, sort: string, search: string, fieldSort: string, page: number, size: number
  ): Promise<PaginationResponse> {
    return this.httpClient.get<PaginationResponse>(
      `${environment.endPoint}${environment.apiPaths.company.getByManager + managerId}`,
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
  checkRemove(companyId: number): Promise<any> {
    return this.httpClient.get<any>(
      `${environment.endPoint}${environment.apiPaths.company.checkRemove + companyId}`,
    ).toPromise();
  }
}
