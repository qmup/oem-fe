import { Injectable, OnInit, AfterViewInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToastService } from 'ng-uikit-pro-standard';
import { AuthService } from 'src/app/authorize/services/auth.service';
import { GlobalService } from './global.service';
import { Employee } from 'src/app/employee/models/employee';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  currentMessage = new BehaviorSubject(null);
  userAccount: Employee;

  constructor(
    private toastService: ToastService,
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private authService: AuthService,
    private router: Router
  ) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    );
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token;
        this.authService.updateToken(userId, token);
      });
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload: any) => {
        console.log(payload);
        const alertInstance = this.toastService.info(
          `${payload.data.sender + payload.data.gcm.notification.messages}`,
          payload.notification.title, { positionClass: 'toast-bottom-right'} );
          alertInstance.onTap.subscribe(() => {
            this.router.navigate([`task-detail/${payload.data.task_id}`]);
          });
          this.currentMessage.next(payload);
      });
  }
}
