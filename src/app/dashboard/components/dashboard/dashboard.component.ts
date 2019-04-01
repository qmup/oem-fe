import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { SummaryTask } from '../../models/summary-task';
import { DashboardService } from '../../services/dashboard.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { Employee } from 'src/app/employee/models/employee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dateRange: Date[];
  charts: string[] = ['pie', 'bar'];
  summaryTask: SummaryTask;
  userAccount: Employee;

  chartDatasets: Array<any> = [
    { data: [1, 5, 3, 7, 2, 4, 1, 2, 0, 4, 4, 5], label: 'Đã hoàn thành' },
    { data: [4, 2, 4, 0, 1, 2, 3, 4, 5, 3, 0, 0], label: 'Chưa hoàn thành' },
    { data: [0, 0, 1, 1, 2, 0, 3, 1, 1, 3, 2, 1], label: 'Quá hạn' },
  ];

  chartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(0, 200 ,81 ,0.2)',
      borderColor: 'rgba(0, 200 ,81 , 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(0, 200 ,81 ,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 200 ,81 ,1)'
    },
    {
      backgroundColor: 'rgba(96, 125, 139, 0.2)',
      borderColor: 'rgba(96, 125, 139, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(96, 125, 139, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(96, 125, 139, 1)'
    },
    {
      backgroundColor: 'rgba(255, 82, 82, 0.2)',
      borderColor: 'rgba(255, 82, 82, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(255, 82, 82, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 82, 82, 1)'
    }
  ];

  chartOptions: any = {
    responsive: true
  };
  showFromDate = false;

  message: any;

  startTime = new Date();
  endTime = new Date(this.startTime.getTime() - (7 * 24 * 60 * 60 * 1000));

  constructor(
    private dashboardService: DashboardService,
    private globalService: GlobalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userAccount = this.globalService.getUserAccount();
    if (this.userAccount.roleId === 1) {
      this.router.navigate([`employee/`]);
    }
    this.getSummaryTaskLastWeek();
  }

  search() {
    this.startTime = this.dateRange[1];
    this.endTime = this.dateRange[0];
    const startTime = this.dateRange ? this.globalService.convertToYearMonthDay(this.dateRange[0]) : '';
    const endTime = this.dateRange ? this.globalService.convertToYearMonthDay(this.dateRange[1]) : '';
    console.log(this.dateRange);
    this.dashboardService.summaryManagerTask(this.userAccount.id, startTime, endTime)
      .then(
        (response: SummaryTask) => {
          this.summaryTask = response;
        }
      );
  }

  getSummaryTaskLastWeek() {
    this.dashboardService.summaryManagerTask(
      this.userAccount.id,
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
