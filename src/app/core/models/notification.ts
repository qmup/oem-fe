import { PaginationResponse } from './shared';

export class Notification {
  id: number;
  sender: string;
  pictureSender: string;
  receiveDeviceToken: string;
  taskId: number;
  title: string;
  body: string;
  message: string;
  dateCreate: string;
  seen: boolean;
  timeStatus: string;
  hover: boolean;

  constructor() {
    this.id = 0;
    this.sender = '';
    this.pictureSender = '';
    this.receiveDeviceToken = '';
    this.taskId = 0;
    this.title = '';
    this.body = '';
    this.message = '';
    this.dateCreate = '';
    this.seen = false;
    this.timeStatus = '';
    this.hover = false;
}

  public static calculateTimeStatus(notification: Notification) {
    const date = new Date(notification.dateCreate);
    const secs = Math.floor((Date.now() - date.getTime()) / 1000);
    let result = '';
    if (secs < 60) {
      if (secs < 10) {
        result = 'Ngay bây giờ';
      } else if (secs < 30) {
        result = 'Vài giây trước';
      } else {
        result = `${secs} giây trước`;
      }
    } else {
      const mins = Math.floor(secs / 60);
      if (mins < 2) {
        result = '1 phút trước';
      } else if (mins < 60) {
        result = `${mins} phút trước`;
      } else {
        const hours = Math.floor(mins / 60);
        const curHour = new Date().getHours();
        if (hours <= curHour) {
          if (hours < 2) {
            result = '1 giờ trước';
          } else {
            result = `${hours} giờ trước`;
          }
        } else {
          let h = date.getHours();
          const m = date.getMinutes();
          let _m = '';
          if (`${m}`.length < 2) { _m = '0'; }
          if (hours <= curHour + 23) {
            let postFix = 'sáng';
            if (h > 12) {
              h -= 12;
              postFix = 'tối';
            }
            result = `Hôm qua, lúc ${h}:${_m}${m} ${postFix}`;
          } else {
            const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
            const wd = date.getDay();
            const curWd = new Date().getDay();
            let postFix = 'sáng';
            if (h > 12) {
              h -= 12;
              postFix = 'tối';
            }
            if (wd < curWd) {
              result = `${days[wd]} lúc ${h}:${_m}${m} ${postFix}`;
            } else {
              const d = date.getDate();
              const M = date.getMonth() + 1;
              const yyyy = date.getFullYear();
              let _d = '';
              if (`${d}`.length < 2) { _d = '0'; }
              let _M = '';
              if (`${M}`.length < 2) { _M = '0'; }
              result = `${_d}${d}-${_M}${M}-${yyyy} at ${h}:${_m}${m} ${postFix}`;
            }
          }
        }
      }
    }
    notification.timeStatus = result;
  }
}

export class NotificationResponse {
  totalNotSeen: number;
  notificationModels: PaginationResponse;
}
