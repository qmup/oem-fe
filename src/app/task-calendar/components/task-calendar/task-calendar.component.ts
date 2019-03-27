import { colors } from '../../models/colors';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  OnChanges
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { TaskCalendarService } from '../../services/task-calendar.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { Employee } from 'src/app/employee/models/employee';
import { TaskCalendar } from '../../models/task-calendar';

const users = [
  {
    id: 0,
    name: 'Hoàng Vũ',
    color: colors.yellow
  },
  {
    id: 1,
    name: 'Hoàng Thông',
    color: colors.blue
  }
];

@Component({
    selector: 'app-task-calendar',
    templateUrl: './task-calendar.component.html',
    styleUrls: ['./task-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  export class TaskCalendarComponent {

  viewDate: Date = new Date();

  userAccount: Employee = this.globalService.getUserAccount();

  events: CalendarEvent[] = this.getCalendarEvent();

  taskCalendar: TaskCalendar[];

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.events = [...this.events];
  }

  userChanged({ event, newUser }) {
    event.color = newUser.color;
    event.meta.user = newUser;
    this.events = [...this.events];
  }

  constructor(
    private calendarService: TaskCalendarService,
    private globalService: GlobalService,
  ) {}

  getCalendarEvent(): CalendarEvent[] {
    this.calendarService.get(this.userAccount.id, this.globalService.convertToYearMonthDay(this.viewDate))
      .then(
        (response: any) => {
          this.taskCalendar = response;
            this.events = response.map(e => {
            return {
              title: e.title,
              start: addHours(startOfDay(e.start), 5),
              end: addHours(startOfDay(e.end), 3),
              meta: {
                user: e.meta
              },
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: true
            };
          });
        }
        );
    console.log(this.events);
    return this.events;
  }

}
