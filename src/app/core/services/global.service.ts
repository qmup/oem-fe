import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  isLogin = true;
  userName: string;
  requestEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor(private httpClient: HttpClient) {
  }

  convertToYearMonthDay(date) {
    const year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return year + '-' + month + '-' + day;
  }

  convertStringToYearMonthDay(string) {
    const year = string.split('-', 3)[2];
    const month = string.split('-', 3)[1];
    const day = string.split('-', 3)[0];
    console.log(year, month, day);
    return `${year}-${month}-${day}`;
  }

  uploadFile(formData: FormData, pathPackage: string): Promise<any> {
    const headers: HttpHeaders = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.upload.handlerUpload}?pathPackage=${pathPackage}`,
      formData,
      { headers: headers, responseType: 'text' }
    ).toPromise();
  }

}
