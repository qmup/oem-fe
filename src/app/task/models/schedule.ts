export class ScheduleModel {
  assigneeId: number;
  assignerId: number;
  daysOfWeek: number[];
  description: string;
  endTime: string;
  id: number;
  startTime: string;
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
  }
}
