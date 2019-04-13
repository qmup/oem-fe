import { Shared } from 'src/app/core/models/shared';

export class TaskCalendar {
  taskId: number;
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
