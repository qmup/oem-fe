import { Task } from 'src/app/task/models/task';

export class TaskReport {
  id: number;
  taskId: number;
  description: string;
  photo: string;
  dateReport: string;
  employeeId: number;
  type: number;
  evaluation: string;
  evaluated: boolean;
  pictures: any[];

  constructor() {
    this.id = 0;
    this.evaluated = false;
    this.taskId = 0;
    this.description = '';
    this.photo = '';
    this.dateReport = '';
    this.employeeId = 0;
    this.type = 0;
    this.pictures = [];
  }
}

export class TaskModel {
  evaluation: string;
  dateReport: string;
  description: string;
  employeeId: number;
  id: number;
  photo: string;
  taskId: number;
  type: number;

  constructor() {
    this.evaluation = '';
    this.dateReport = '';
    this.description = '';
    this.employeeId = 0;
    this.id = 0;
    this.photo = '';
    this.taskId = 0;
    this.type = 0;
  }
}

export class ReportList {
  reportList: TaskReport[];
  taskList: Task[];

  constructor() {
    this.reportList = new Array<TaskReport>();
  }
}
