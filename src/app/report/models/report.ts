export class TaskReport {
  id: number;
  taskId: number;
  description: string;
  photo: string;
  dateReport: string;
  employeeId: number;
  type: string;

  constructor() {
    this.id = 0;
    this.taskId = 0;
    this.description = '';
    this.photo = '';
    this.dateReport = '';
    this.employeeId = 0;
    this.type = '';
  }
}

export class TaskModel {
  dateReport: string;
  description: string;
  employeeId: number;
  id: number;
  photo: string;
  taskId: number;
  type: number;

  constructor() {
    this.dateReport = '';
    this.description = '';
    this.employeeId = 0;
    this.id = 0;
    this.photo = '';
    this.taskId = 0;
    this.type = 0;
  }
}
