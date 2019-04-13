class AttendanceStatuses {
  onTime: number;
  late: number;
  absent: number;
  notYet: number;
}

export class SummaryTask {
  totalTask: number;
  totalLaborer: number;
  numberOfTaskDone: number;
  numberOfTaskDoneBeforeDeadline: number;
  numberOfTaskDoneAfterDeadline: number;
  numberOfTaskInProgress: number;
  numberOfTaskOverDue: number;
  numberOfTaskWaitForApprove: number;
  numberOfTaskNotStart: number;
  numberOfWorkplaceIsManaged: number;
  attendanceStatus: AttendanceStatuses;

  constructor() {
    this.totalTask = 0;
    this.totalLaborer = 0;
    this.numberOfTaskDone = 0;
    this.numberOfTaskDoneBeforeDeadline = 0;
    this.numberOfTaskDoneAfterDeadline = 0;
    this.numberOfTaskInProgress = 0;
    this.numberOfTaskOverDue = 0;
    this.numberOfTaskWaitForApprove = 0;
    this.numberOfTaskNotStart = 0;
    this.numberOfWorkplaceIsManaged = 0;
    this.attendanceStatus = new AttendanceStatuses();
  }
}




