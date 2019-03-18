import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AssignTask } from '../models/shared';
import { AuthGuardService } from './auth-guard.service';
import { Employee } from 'src/app/employee/models/employee';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  isLogin: boolean;
  userAccount: Employee;
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
  iconStatusSelect = [
    {
      value: 0,
      label: 'Chưa bắt đầu'
    },
    {
      value: 1,
      label: 'Đang thực hiện'
    },
    {
      value: 2,
      label: 'Hoàn thành'
    },
    // {
    //   value: 3,
    //   label: 'Quá hạn'
    // }
  ];
  week = [
    { id: 1, inputId: 'option1', label: 'Thứ 2' , check: false},
    { id: 2, inputId: 'option2', label: 'Thứ 3' , check: false},
    { id: 3, inputId: 'option3', label: 'Thứ 4' , check: false},
    { id: 4, inputId: 'option4', label: 'Thứ 5' , check: false},
    { id: 5, inputId: 'option5', label: 'Thứ 6' , check: false},
    { id: 6, inputId: 'option6', label: 'Thứ 7' , check: false},
    { id: 7, inputId: 'option7', label: 'Chủ nhật' , check: false},
  ];

  constructor(
    private httpClient: HttpClient,
    private authGuardService: AuthGuardService
  ) {
    const token = this.authGuardService.getToken();
    this.isLogin = token ? true : false;
  }

  getUserAccount(): Employee {
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
    const day = string.split('-', 3)[0];
    const month = string.split('-', 3)[1];
    const year = string.split('-', 3)[2];
    if (year.length !== 4) {
      return string;
    } else {
      return `${year}-${month}-${day}`;
    }
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
