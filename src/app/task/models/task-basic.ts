export class TaskBasic {
  description: string;
  duration: number;
  id: number;
  picture: string;
  title: string;
  editable: boolean;

  constructor() {
    this.description = '';
    this.duration = 0;
    this.id = 0;
    this.picture = '';
    this.title = '';
    this.editable = false;
  }
}

export class TaskBasicManager {
  editable: boolean;
  employeeId: number;
  id: number;
  taskBasicId: number;

  constructor() {
    this.editable = false;
    this.employeeId = 0;
    this.id = 0;
    this.taskBasicId = 0;

  }
}
