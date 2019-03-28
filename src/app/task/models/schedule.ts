import { Shared } from 'src/app/core/models/shared';

export class ScheduleModel {
  assigneeId: number;
  assignerId: number;
  daysOfWeek: number[];
  description: string;
  endTime: string;
  id: number;
  startTime: string;
  duration: number;
  status: number;
  title: string;
  workplaceId: number;

  constructor() {
    this.assigneeId = 0;
    this.assignerId = 0;
    this.daysOfWeek = [];
    this.description = '';
    this.endTime = '';
    this.id = 0;
    this.startTime = '';
    this.status = 0;
    this.title = '';
    this.workplaceId = 0;
    this.duration = 0;
  }
}

export class Schedule {
  assignee: Shared;
  assigner: Shared;
  daysOfWeek: string;
  description: string;
  endTime: string;
  id: number;
  startTime: string;
  status: string;
  title: string;
  duration: number;
  workplace: Shared;
  dayList: string[];

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
    this.workplace = new Shared();
    this.dayList = [];
    this.duration = 0;
  }
}
