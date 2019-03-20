export class TaskSearchResponse {
  content: TaskSearchModel[];
  totalPages: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  number: number;
}

export class TaskSearchModel {
  id: number;
  title: string;
  description: string;
  scheduleId: number;
  startTime: string;
  endTime: string;
  duration: number;
  checkInTime: string;
  attendanceStatus: number;
  basic: boolean;
  status: number;
  dateCreate: string;
  dateUpdate: string;
  priority: number;
  assigneeName: string;
  assigneePicture: string;
  workplaceName: string;

  constructor() {
    this.id = 0;
    this.title = '';
    this.description = '';
    this.scheduleId = 0;
    this.startTime = '';
    this.endTime = '';
    this.duration = 0;
    this.checkInTime = '';
    this.attendanceStatus = 0;
    this.basic = false;
    this.status = 0;
    this.dateCreate = '';
    this.dateUpdate = '';
    this.priority = 0;
    this.assigneeName = '';
    this.assigneePicture = '';
    this.workplaceName = '';
  }
}
