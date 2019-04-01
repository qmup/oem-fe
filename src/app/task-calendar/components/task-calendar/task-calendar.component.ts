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
            return {
              title: e.title,
              start: new Date(e.start),
              end: new Date(e.end),
              meta: {
                user: user
              },
              resizable: {
                beforeStart: false,
                afterEnd: false
              },
              draggable: false
            };
          });
        }
      );
  }
}
