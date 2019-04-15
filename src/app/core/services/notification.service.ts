import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToastService } from 'ng-uikit-pro-standard';
import { AuthService } from 'src/app/authorize/services/auth.service';
import { Employee } from 'src/app/employee/models/employee';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Notification, NotificationResponse } from '../models/notification';
import { environment } from 'src/environments/environment';
import { PaginationResponse } from '../models/shared';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  currentMessage = new BehaviorSubject(null);
  countUnread: number;

  constructor(
    private toastService: ToastService,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private authService: AuthService,
    private httpClient: HttpClient,
    private router: Router,
    private globalService: GlobalService
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
        this.globalService.countUnread++;
        const alertInstance = this.toastService.info(
          `${payload.data.sender + ' ' + payload.data['gcm.notification.message']}`,
          payload.notification.title, { positionClass: 'toast-bottom-right'} );
          alertInstance.onTap.subscribe(() => {
            this.router.navigate([`task-detail/${payload.data.task_id}`]);
          });
          this.currentMessage.next(payload);
      });
  }

  getAll(managerId: number, sort: string, fieldSort: string, page: number, size: number): Promise<NotificationResponse> {
    return this.httpClient.get<NotificationResponse>(
      `${environment.endPoint}${environment.apiPaths.notify.getAll + managerId}`,
      {
        params: {
          sort: `${sort}`,
          fieldSort: `${fieldSort}`,
          page: `${page}`,
          size: `${size}`,
        }
      }
    ).toPromise();
  }

  toggleSeen(id, key, value): Promise<any> {
    return this.httpClient.put<any>(
      `${environment.endPoint}${environment.apiPaths.notify.update + id}`,
      {
        key: `${key}`,
        value: `${value}`,
      }
    ).toPromise();
  }
}
