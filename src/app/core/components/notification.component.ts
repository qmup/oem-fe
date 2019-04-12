import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit
} from '@angular/core';
import {
  trigger,
  transition,
  animate,
  style,
  state,
  group
} from '@angular/animations';
import {
  NotificationService
} from '../services/notification.service';
import {
  Employee
} from 'src/app/employee/models/employee';
import {
  GlobalService
} from '../services/global.service';
import {
  PaginationResponse
} from '../models/shared';
import {
  Notification
} from '../models/notification';
import {
  Router
} from '@angular/router';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-notification',
  template: `
    <div class="wrapper">

      <button type="button" class="btn btn-sm btn-notification" (click)="toggleShowDiv()">
        <i class="fa fa-bell"></i>
      </button>
      <span class="counter" *ngIf="countUnread !== 0 && countUnread <= 9">{{countUnread}}</span>
      <span class="counter" *ngIf="countUnread !== 0 && countUnread > 9">9+</span>
      <div [@slideInOut]="animationState" class="card-notification">
        <h6 class="p-3 font-weight-bold">Thông báo</h6>
        <div class="pt51">
          <div [ngStyle]="styleObject(noti)"
          *ngFor="let noti of notificationList"
          class="d-flex flex-wrap w-100 py-3"
          (mouseenter)="noti.hover=true"
          (mouseleave)="noti.hover=false"
          (click)="toggleSeen(noti.id, noti.taskId)"
          >
            <div class="col-2 my-auto">
              <img [src]="noti.pictureSender || defaultImage"
              class="rounded-circle img-responsive list-avatar mr-2">
            </div>
            <div class="col-10">
              <span class="font-weight-bold mb-0">{{noti.sender}}</span> đã {{noti.title | lowercase}} với ID là {{noti.taskId}}
              <br>
              <small>{{noti.timeStatus}}</small>
            </div>
          </div>
        </div>
        <a class="p-3 font-weight-bold read-more" (click)="showMore()">Xem thêm
          <i class="fa fa-caret-down"></i>
        </a>
      </div>
    </div>

  `,
  styles: [`
    .btn-notification {
      box-shadow: none;
    }
    i.fa.fa-bell {
      font-size: 20px;
    }
    span {
      font-size: 14px;
      font-weight: 400;
    }
    .counter {
      margin-left: -43px !important;
    }
    .card-notification {
      position: absolute;
      height: 400px;
      background-color: white;
      color: black;
      width: 400px;
      right: -85px;
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
    .card-notification h6 {
      position: fixed;
      box-shadow: 0 0px 20px rgba(0,0,0,0.2);
      width: 400px;
    }
    a.read-more {
      text-align: center;
      color: #007bff !important;
      position: fixed;
      top: 407px;
      box-shadow: 0 0 4px rgba(0,0,0,0.2);
      cursor: pointer;
      width: 400px;
    }
    .list-avatar {
      height: 50px !important;
      width: 50px !important;
    }
    .pt51 {
      position: absolute;
      top: 51px;
      width: 400px;
      height: calc(400px - 106px);
      overflow-y: scroll;
      cursor: pointer;
    }
    .col-10 span {
      font-size: 16px;
    }
  `],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        'max-height': '500px',
        'opacity': '1',
        'visibility': 'visible'
      })),
      state('out', style({
        'max-height': '0px',
        'opacity': '0',
        'visibility': 'hidden'
      })),
      transition('in => out', [group([
        animate('200ms ease-in-out', style({
          'opacity': '0'
        })),
        animate('300ms ease-in-out', style({
          'max-height': '0px'
        })),
        animate('350ms ease-in-out', style({
          'visibility': 'hidden'
        }))
      ])]),
      transition('out => in', [group([
        animate('1ms ease-in-out', style({
          'visibility': 'visible'
        })),
        animate('20ms ease-in-out', style({
          'max-height': '500px'
        })),
        animate('300ms ease-in-out', style({
          'opacity': '1'
        }))
      ])])
    ]),
  ]
})
export class NotificationComponent implements OnInit {

  userAccount: Employee;
  notificationResponse: PaginationResponse = new PaginationResponse();
  notificationList: Notification[] = [];
  size = 10;
  disableScrollDown = false;
  animationState = 'out';
  countUnread: number;
  defaultImage = '../../../../assets/default-image.jpg';
  // @ViewChild('scroll') private scrollContainer: ElementRef;

  constructor(
    private notificationService: NotificationService,
    private globalService: GlobalService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.countUnread = this.globalService.countUnread;
    this.getNotifications();
  }

  toggleShowDiv() {
    if (this.animationState === 'out') {
      this.getNotifications();
    }
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  getNotifications() {
    this.notificationService.getAll(this.userAccount.id, '', 'dateCreate', 0, this.size)
      .then(
        (response) => {
          this.countUnread = response.totalNotSeen;
          this.notificationList = response.notificationModels.content;
          console.log(this.notificationList);
          for (let i = 0; i < this.notificationList.length; i++) {
            Notification.calculateTimeStatus(this.notificationList[i]);
          }
        }
      );
  }

  styleObject(noti: Notification): Object {
    if (noti.seen) {
      if (noti.hover) {
        return {
          'background-image': 'linear-gradient(rgba(29, 33, 41, .04), rgba(29, 33, 41, .04))'
        };
      } else {
        return {
          'background-image': ''
        };
      }
    } else {
      if (noti.hover) {
        return {
          'background-image': 'linear-gradient(rgba(29, 33, 41, .04), rgba(29, 33, 41, .04))'
        };
      } else {
        return {
          'background-image': 'linear-gradient(rgba(29, 33, 41, .08), rgba(29, 33, 41, .08))'
        };
      }
    }
  }

  toggleSeen(notiId: number, taskId: number) {
    if (!this.notificationList.find(noti => noti.id === notiId).seen) {
      this.notificationService.toggleSeen(notiId, 'seen', 'true')
        .then(
          () => {
            this.notificationList.find(noti => noti.id === notiId).seen = true;
            this.countUnread--;
          }
          );
        }
    this.animationState = 'out';
    this.router.navigate(['/task-detail', taskId]);
  }

  showMore() {
    this.size += 10;
    this.getNotifications();
  }

  // private onScroll() {
  //   const element = this.scrollContainer.nativeElement;
  //   const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
  //   if (this.disableScrollDown && atBottom) {
  //     this.size += 5;
  //     this.getNotifications();
  //     this.disableScrollDown = false;
  //   } else {
  //     this.disableScrollDown = true;
  //   }
  // }


  // private scrollToBottom(): void {
  //   if (this.disableScrollDown) {
  //     return;
  //   }
  //   try {
  //     this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  //   } catch (err) { }
  // }

}
