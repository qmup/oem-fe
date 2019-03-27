import { Shared } from 'src/app/core/models/shared';

export class TaskCalendar {
  title: string;
  start: string;
  end: string;
  meta: Shared;
  resizable: {
    beforeStart: true,
    afterEnd: true
  };
  draggable: true;
}