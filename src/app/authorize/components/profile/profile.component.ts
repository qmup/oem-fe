import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/core/services/global.service';
import { Employee } from 'src/app/employee/models/employee';
import { DashboardService } from 'src/app/dashboard/services/dashboard.service';
import { SummaryTask } from 'src/app/dashboard/models/summary-task';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  info: Employee;
  defaultImage = '../../../../assets/default-image.jpg';
  startTime = new Date();
  summaryTask: SummaryTask;

  endTime = new Date(this.startTime.getTime() - (7 * 24 * 60 * 60 * 1000));
  constructor(
    private globalService: GlobalService,
    private dashboardService: DashboardService,
  ) { }

  ngOnInit() {
    this.info = this.globalService.getUserAccount();
  }

  getSummaryTaskLastWeek() {
    this.dashboardService.summaryManagerTask(
        this.info.id,
        this.globalService.convertToYearMonthDay(this.startTime),
        this.globalService.convertToYearMonthDay(this.endTime)
      )
      .then(
        (response: SummaryTask) => {
          this.summaryTask = response;
        }
      );
  }
}
