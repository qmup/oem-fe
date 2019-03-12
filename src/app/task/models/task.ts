import { Shared } from 'src/app/core/models/shared';
import { TaskBasic } from './task-basic';

export class Task {
  attendanceStatus: number;
  basic: boolean;
  checkInTime: string;
  dateCreate: string;
  description: string;
  duration: number;
  id: number;
  picture: string;
  priority: number;
  scheduleId: number;
  startTime: string;
  status: number;
  title: string;
  taskBasics: TaskBasic[];

  constructor() {
    this.attendanceStatus = 0;
    this.basic = false;
    this.checkInTime = '';
    this.dateCreate = '';
    this.description = '';
    this.duration = 0;
    this.id = 0;
    this.picture = '';
    this.priority = 0;
    this.scheduleId = 0;
    this.startTime = '';
    this.status = 0;
    this.title = '';
    this.taskBasics = new Array<TaskBasic>();

  }
}

export class TaskModel {
  attendanceStatus: number;
  basic: boolean;
  checkInTime: string;
  dateCreate: string;
  description: string;
  duration: number;
  id: number;
  picture: string;
  priority: number;
  scheduleId: number;
  startTime: string;
  status: number;
  title: string;
  taskBasics: TaskBasic[];

  constructor() {
    this.attendanceStatus = 0;
    this.basic = false;
    this.checkInTime = '';
    this.dateCreate = '';
    this.description = '';
    this.duration = 5;
    this.id = 0;
    this.picture = '';
    this.priority = 0;
    this.scheduleId = 0;
    this.startTime = '';
    this.status = 0;
    this.title = '';
    this.taskBasics = new Array<TaskBasic>();
  }
}

export class TaskResponse {
  content: Task[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  sort: null;
  first: boolean;
  size: number;
  number: number;
}
