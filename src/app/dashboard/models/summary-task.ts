export class SummaryTask {
  numberOfTaskDone: number;
  numberOfTaskDoneAfterDeadline: number;
  numberOfTaskDoneBeforeDeadline: number;
  numberOfTaskInProgress: number;
  totalTask: number;

  constructor() {
    this.numberOfTaskDone = 0;
    this.numberOfTaskDoneAfterDeadline = 0;
    this.numberOfTaskDoneBeforeDeadline = 0;
    this.numberOfTaskInProgress = 0;
    this.totalTask = 0;
  }
}


