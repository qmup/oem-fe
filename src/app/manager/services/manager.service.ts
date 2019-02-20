import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Manager } from '../models/manager';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {

  constructor(private httpClient: HttpClient) { }

  create(managerCM: Manager): Promise<any> {
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.admin.manager.create}`, managerCM
    ).toPromise();
  }

  getAll(): Promise<Manager[]> {
    return this.httpClient.get<Manager[]>(
      `${environment.endPoint}${environment.apiPaths.admin.manager.getAll}`,
    ).toPromise();
  }

  remove(id: number): Promise<any> {
    return this.httpClient.delete(
      `${environment.endPoint}${environment.apiPaths.admin.manager.remove + id}`
    ).toPromise();
  }

  update(managerUM: Manager): Promise<Manager> {
    return this.httpClient.put<Manager>(
      `${environment.endPoint}${environment.apiPaths.admin.manager.update}`, managerUM
    ).toPromise();
  }
}
