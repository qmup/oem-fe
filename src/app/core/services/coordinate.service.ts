import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Coordinate } from '../models/coordinate';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoordinateService {

  constructor(private httpClient: HttpClient) { }

  create(coordinateModel: Coordinate): Promise<Coordinate> {
    return this.httpClient.post<Coordinate>(
      `${environment.endPoint + environment.apiPaths.coordinate.create}`, coordinateModel
    ).toPromise();
  }

  update(coordinateModel: Coordinate): Promise<Coordinate> {
    return this.httpClient.put<Coordinate>(
      `${environment.endPoint + environment.apiPaths.coordinate.update}`, coordinateModel
    ).toPromise();
  }
}
