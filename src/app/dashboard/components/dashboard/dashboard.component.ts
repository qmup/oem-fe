import {
  Component,
  OnInit
} from '@angular/core';
import {
  NotificationService
} from 'src/app/core/services/notification.service';
import {
  SummaryTask
} from '../../models/summary-task';
import {
  DashboardService
} from '../../services/dashboard.service';
import {
  GlobalService
} from 'src/app/core/services/global.service';
import {
  Employee
} from 'src/app/employee/models/employee';
import {
  Router
} from '@angular/router';

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

  chartType = 'pie';

  chartData: Array < any > = [];

  chartLabels1: Array < any > = ['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'];
  chartLabels: Array < any > = ['Đúng giờ', 'Trễ', 'Vắng mặt'];

  chartColors1: Array < any > = [{
    hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
    hoverBorderWidth: 0,
    backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
    hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774']
  }];

  chartColors: Array < any > = [{
    hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
    hoverBorderWidth: 0,
    backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
    hoverBackgroundColor: ['#28a745', '#ffc107', '#dc3545']
  }];

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
  ) {}

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
          this.chartData = Object.values(response.attendanceStatus);
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
          this.chartData = Object.values(response.attendanceStatus);
        }
      );
  }

  public chartClicked(): void {}
  public chartHovered(): void {}
}
