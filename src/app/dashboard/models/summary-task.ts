class AttendanceStatuses {
  onTime: number;
  late: number;
  absent: number;
}

export class SummaryTask {
  totalTask: number;
  totalLaborer: number;
  totalWorkplace: number;
  numberOfTaskDone: number;
  numberOfTaskInProgress: number;
  numberOfTaskDoneBeforeDeadline: number;
  numberOfTaskDoneAfterDeadline: number;
  numberOfTaskHasProblem: number;
  statuses: AttendanceStatuses;

  constructor() {
    this.totalTask = 0;
    this.totalLaborer = 0;
    this.totalWorkplace = 0;
    this.numberOfTaskDone = 0;
    this.numberOfTaskInProgress = 0;
    this.numberOfTaskDoneBeforeDeadline = 0;
    this.numberOfTaskDoneAfterDeadline = 0;
    this.numberOfTaskHasProblem = 0;
    this.statuses = new AttendanceStatuses();
  }
}




