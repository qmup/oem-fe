import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
} from 'angular-calendar';

import {
  TaskCalendarService
} from '../../services/task-calendar.service';
import {
  GlobalService
} from 'src/app/core/services/global.service';
import {
  Employee
} from 'src/app/employee/models/employee';
import { Router } from '@angular/router';
import { colors } from '../../models/colors';

const taskColor = [
  {
    color: colors.grey,
    name: 'grey',
  },
  {
    color: colors.blue,
    name: 'blue',
  },
  {
    color: colors.green,
    name: 'green',
  },
  {
    color: colors.red,
    name: 'red',
  },
  {
    color: colors.yellow,
    name: 'yellow',
  }
];


@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.scss'],
})
export class TaskCalendarComponent implements OnInit {

  userAccount: Employee;

  users = [];

  viewDate = new Date();

  events: CalendarEvent[] = [];
  constructor(
    private calendarService: TaskCalendarService,
    private route: Router,
    private globalService: GlobalService,
  ) {}

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.getCalendarEvent();
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.events = [...this.events];
  }

  userChanged({
    event,
    newUser
  }) {
    event.color = newUser.color;
    event.meta.user = newUser;
    this.events = [...this.events];
  }

  getCalendarEvent() {
    this.viewDate.setHours(0, 0, 0, 0);
    this.calendarService.get(
      this.userAccount.id,
      `${this.viewDate.toISOString()};${new Date(this.viewDate.getTime() + (24 * 60 * 60 * 1000 - 1000)).toISOString()}`)
      .then(
        (response) => {
          this.users = [];
          const arr1 = response.filter((e, i, self) =>
            i === self.findIndex((t) => (
              t.meta.id === e.meta.id
            ))
          );
          arr1.forEach(element => {
            this.users.push(element.meta);
          });

          this.events = response.map(e => {
            const user = this.users.find(u => u.id === e.meta.id);
            const start = new Date(e.start);
            const end = new Date(e.end);
            const startHour = this.addZero(start.getHours());
            const startMin = this.addZero(start.getMinutes());
            const endHour = this.addZero(end.getHours());
            const endMin = this.addZero(end.getMinutes());
            const title = `${e.title}<br>
            Lúc ${startHour}:${startMin}-${endHour}:${endMin}<br>
            Tại ${e.workplace} `;
            console.log(title);
            return {
              title: title,
              start: new Date(e.start),
              end: new Date(e.end),
              meta: {
                user: user
              },
              resizable: {
                beforeStart: false,
                afterEnd: false
              },
              color: taskColor[e.status].color,
              draggable: false,
              taskId: e.taskId
            };
          });
        }
      );
  }

  clicked(e: any) {
    this.route.navigate(['/task-detail', e.event.taskId]);
  }

  addZero(i) {
    if (i < 10) {
      i = '0' + i;
    }
    return i;
  }
}
