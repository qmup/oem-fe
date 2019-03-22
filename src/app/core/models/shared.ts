export class Shared {
  id: number;
  name: string;
}

export class PaginationResponse {
  content = [];
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  sort: any;
  first: boolean;
  size: number;
  number: number;
}

export class AssignTask {
  assigneeId: number;
  assignerId: number;
  dateAssign: string;
  description: string;
  id: number;
  taskId: number;

  constructor() {
    this.assigneeId = 0;
    this.assignerId = 0;
    this.dateAssign = '';
    this.description = '';
    this.id = 0;
    this.taskId = 0;
  }
}

export class AssignTaskResponse {
  assignee: Shared;
  assigner: Shared;
  dateAssign: string;
  description: string;
  id: number;
  taskId: number;
}
