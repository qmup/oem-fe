import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  taskList: any;
  private sorted = false;

  constructor(
    private scheduleService: ScheduleService,
  ) { }

  ngOnInit() {
    this.getSchedule();
  }

  sortBy(by: string | any): void {

    this.taskList.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });

    this.sorted = !this.sorted;
  }

  getSchedule() {
    this.scheduleService.getAll();
  }

}
