export class Task {
  assigneeId: number;
  assignerId: number;
  daysOfWeek: string;
  description: string;
  endTime: string;
  id: number;
  startTime: string;
  status: string;
  title: string;
  workplaceId: number;

  constructor() {
    this.assigneeId = 0;
    this.assignerId = 0;
    this.daysOfWeek = '';
    this.description = '';
    this.endTime = '';
    this.id = 0;
    this.startTime = '';
    this.status = '';
    this.title = '';
    this.workplaceId = 0;
  }
}
