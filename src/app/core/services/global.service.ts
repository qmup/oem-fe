import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  isLogin = false;
  userName: string;
  requestEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor() {
  }

}
