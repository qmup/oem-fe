import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  isLogin = true;
  userName: string;
  requestEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

  convertToYearMonthDay(date) {
    const year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return year + '-' + month + '-' + day;
  }

}
