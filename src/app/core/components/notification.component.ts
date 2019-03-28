import { Component, HostListener, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { trigger, transition, animate, style, state, group } from '@angular/animations';
import { NotificationService } from '../services/notification.service';
import { Employee } from 'src/app/employee/models/employee';
import { GlobalService } from '../services/global.service';
import { PaginationResponse } from '../models/shared';
import { Notification } from '../models/notification';

@Component({
  selector: 'app-notification',
  template: `
    <div class="wrapper">

      <button type="button" class="btn btn-sm btn-notification" (click)="toggleShowDiv()">
        <i class="fa fa-bell"></i>
      </button>
      <span class="counter">22</span>

      <div [@slideInOut]="animationState" class="card-notification">
        <h6 class="p-3 font-weight-bold">Thông báo</h6>
        <div class="pt51">
          <div [ngStyle]="styleObject(noti)"
          *ngFor="let noti of notificationList"
          class="d-flex flex-wrap w-100 py-3"
          (mouseenter)="noti.hover=true"
          (mouseleave)="noti.hover=false"
          (click)="toggleSeen(noti.id)"
          [routerLink]="['/task-detail', noti.taskId]"
          >
            <div class="col-2">
              <img src="https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"
              class="rounded-circle img-responsive list-avatar mr-2">
            </div>
            <div class="col-10">
              <p class="font-weight-bold mb-0">{{noti.sender}} đã {{noti.title | lowercase}}</p>
              <small>{{noti.timeStatus}}</small>
              <!-- <p class="font-weight-bold mb-0">Người gửi vừa báo cáo công việc</p>
              <small>2 phút trước</small> -->
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
      font-size: 10px;
    }
    .counter {
      margin-left: -35px !important;
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
  `],
  animations: [
    trigger('slideInOut', [
      state('in', style({
          'max-height': '500px', 'opacity': '1', 'visibility': 'visible'
      })),
      state('out', style({
          'max-height': '0px', 'opacity': '0', 'visibility': 'hidden'
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
      ]
      )]),
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
      ]
      )])
  ]),
  ]
})
export class NotificationComponent implements AfterViewChecked {

  userAccount: Employee;
  notificationResponse: PaginationResponse = new PaginationResponse();
  notificationList: Notification[] = [];
  size = 10;
  disableScrollDown = false;
  animationState = 'out';
  // @ViewChild('scroll') private scrollContainer: ElementRef;

  constructor(
    private notificationService: NotificationService,
    private globalService: GlobalService
  ) {
    this.userAccount = this.globalService.getUserAccount();
    this.getNotifications();
  }

  ngAfterViewChecked() {
    // this.scrollToBottom();
  }

  toggleShowDiv() {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
  }

  getNotifications() {
    this.notificationService.getAll(this.userAccount.id, '', 'dateCreate', 0, this.size)
      .then(
        (response) => {
          this.notificationList = response.content;
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

  toggleSeen(id: number) {
    this.notificationService.toggleSeen(id, 'seen', 'true')
      .then(
        () => {
          this.getNotifications();
        }
      );
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
