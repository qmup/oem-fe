import { Shared } from 'src/app/core/models/shared';
import { TaskBasic } from './task-basic';

export class ScheduleModel {
  assigneeId: number;
  assignerId: number;
  daysOfWeek: string;
  description: string;
  dateCreate: string;
  endTime: string;
  id: number;
  taskBasics: TaskBasic[];
  startTime: string;
  duration: number;
  status: number;
  title: string;
  workplaceId: number;
  workplaceName: string;

  constructor() {
    this.assigneeId = 0;
    this.assignerId = 0;
    this.daysOfWeek = '';
    this.dateCreate = new Date().toISOString();
    this.description = '';
    this.endTime = '';
    this.id = 0;
    this.startTime = '';
    this.taskBasics = new Array<TaskBasic>();
    this.status = 0;
    this.title = '';
    this.workplaceId = 0;
    this.duration = 30;
  }
}

export class Schedule {
  assignee: Shared;
  assigner: Shared;
  daysOfWeek: string;
  dateCreate: string;
  description: string;
  endTime: string;
  id: number;
  startTime: string;
  taskBasics: TaskBasic[];
  status: number;
  title: string;
  duration: number;
  workplaceId: number;
  workplaceName: string;
  dayList: string[];

  constructor() {
    this.assignee = new Shared();
    this.assigner = new Shared();
    this.daysOfWeek = '';
    this.description = '';
    this.endTime = '';
    this.id = 0;
    this.startTime = '';
    this.status = 0;
    this.taskBasics = new Array<TaskBasic>();
    this.title = '';
    this.workplaceId = 0;
    this.workplaceName = '';
    this.dayList = [];
    this.duration = 30;
  }
}
