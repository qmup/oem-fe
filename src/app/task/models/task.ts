import { Shared } from 'src/app/core/models/shared';

export class Task {
  assignee: Shared;
  assigner: Shared;
  daysOfWeek: string;
  description: string;
  endTime: string;
  id: number;
  startTime: string;
  status: string;
  title: string;
  workplace: Shared;
  priority: number;

  constructor() {
    this.assignee = new Shared();
    this.assigner = new Shared();
    this.daysOfWeek = '';
    this.description = '';
    this.endTime = '';
    this.id = 0;
    this.startTime = '';
    this.status = '';
    this.title = '';
    this.priority = 0;
    this.workplace = new Shared();
  }
}

export class TaskModel {
  assigneeId: number;
  assignerId: number;
  attendanceStatus: number;
  checkInTime: string;
  dateCreate: string;
  description: string;
  endTime: string;
  id: number;
  priority: number;
  scheduleId: number;
  startTime: string;
  status: number;
  title: string;
  workplaceId: number;

  constructor() {
    this.assigneeId = 0;
    this.assignerId = 0;
    this.attendanceStatus = 0;
    this.checkInTime = '';
    this.dateCreate = '';
    this.description = '';
    this.endTime = '';
    this.id = 0;
    this.priority = 0;
    this.scheduleId = 0;
    this.startTime = '';
    this.status = 0;
    this.title = '';
    this.workplaceId = 0;
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
