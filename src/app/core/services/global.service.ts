import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AssignTask } from '../models/shared';
import { AuthGuardService } from './auth-guard.service';
import { UserAccount } from 'src/app/authorize/models/token';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  isLogin: boolean;
  userAccount: UserAccount;
  isRequesting: EventEmitter<boolean> = new EventEmitter<boolean>();
  iconPrioritySelect = [
    {
      value: '1',
      label: 'Rất cao',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/highest.svg'
    },
    {
      value: '2',
      label: 'Cao',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/high.svg'
    },
    {
      value: '3',
      label: 'Bình thường',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/medium.svg'
    },
    {
      value: '4',
      label: 'Thấp',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/low.svg'
    },
    {
      value: '5',
      label: 'Rất thấp',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/lowest.svg'
    },
  ];

  constructor(
    private httpClient: HttpClient,
    private authGuardService: AuthGuardService
  ) {
    const token = this.authGuardService.getToken();
    this.isLogin = token ? true : false;
  }

  getUserAccount(): UserAccount {
      return JSON.parse(localStorage.getItem(environment.account));
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

  assignTask(assignTask: AssignTask): Promise<any> {
    return this.httpClient.post(
      `${environment.endPoint}${environment.apiPaths.assign.assignTask}`, assignTask
    ).toPromise();
  }

}
