import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Company } from '../models/company';

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
  getAll(): Promise<Company[]> {
    return this.httpClient.get<Company[]>(
      `${environment.endPoint}${environment.apiPaths.company.getAll}`
    ).toPromise();
  }
  getById(): Promise<Company> {
    return this.httpClient.get<Company>(
      `${environment.endPoint}${environment.apiPaths.company.getById}`
    ).toPromise();
  }
  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.company.remove}?companyId=${id}`
    ).toPromise();
  }
  update(companyUM: Company): Promise<Company> {
    return this.httpClient.put<Company>(
      `${environment.endPoint}${environment.apiPaths.company.update}`, companyUM
    ).toPromise();
  }
}
