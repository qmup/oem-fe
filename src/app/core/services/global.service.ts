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

}
