import {
  Component,
  OnInit
} from '@angular/core';
import {
  SummaryTask, ChartColor
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
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PaginationResponse } from 'src/app/core/models/shared';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dateRange: Date[];
  summaryTask: SummaryTask;
  userAccount: Employee;

  // pie

  chartType = 'pie';

  chartData: Array < any > = [];

  chartLabels: Array < any > = ['Đúng giờ', 'Trễ', 'Vắng mặt', 'Chưa bắt đầu'];

  chartColors: Array < any > = [{
    hoverBorderColor: ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.1)'],
    hoverBorderWidth: 0,
    backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#949FB1'],
    hoverBackgroundColor: ['#28a745', '#ffc107', '#dc3545', '#A8B3C5' ]
  }];

  // bar

  chartType2 = 'bar';

  chartDatasets: Array<any> = [
    { data: [4.5, 4.1, 3.7, 5, 4, 4.2], label: 'Đánh giá chất lượng công việc' },
  ];

  chartLabels2: Array<any> = ['Nguyễn Minh Quân', 'Bùi Hoàng Thông', 'Tống Văn Giang', 'Lê Ngô Minh',
    'Phạm Tuấn Kiệt', 'Vũ Thị Ánh Hồng'];

  chartColors2: Array<ChartColor> = new Array<ChartColor>();

  chartOptions: any = {
    responsive: true
  };

  showFromDate = false;

  message: any;

  dateTo = new Date();
  dateFrom = new Date(this.dateTo.getTime() - (7 * 24 * 60 * 60 * 1000));
  employeeList = [];

  constructor(
    private dashboardService: DashboardService,
    private employeeService: EmployeeService,
    private globalService: GlobalService,
    private router: Router
  ) {
    this.chartColors2 = this.setRandomColor();
  }

  ngOnInit(): void {
    this.userAccount = this.globalService.getUserAccount();
    if (this.userAccount.roleId === 1) {
      this.router.navigate([`employee/`]);
    }
    this.getEmployee();
    this.getSummaryTaskLastWeek();
  }

  search() {
    this.dateFrom = this.dateRange[0];
    this.dateTo = this.dateRange[1];
    const from = this.dateRange ? this.globalService.convertToYearMonthDay(this.dateRange[0]) : '';
    const to = this.dateRange ? this.globalService.convertToYearMonthDay(this.dateRange[1]) : '';
    this.dashboardService.summary(this.userAccount.id, from, to)
      .then(
        (response: SummaryTask) => {
          this.summaryTask = response;
          this.chartData = Object.values(response.attendanceStatus);
        }
      );
  }

  getSummaryTaskLastWeek() {
    this.dashboardService.summary(
        this.userAccount.id,
        this.globalService.convertToYearMonthDay(this.dateFrom),
        this.globalService.convertToYearMonthDay(this.dateTo)
      )
      .then(
        (response: SummaryTask) => {
          this.summaryTask = response;
          this.chartData = Object.values(response.attendanceStatus);
        }
      );
  }

  getEmployee() {
    this.employeeService.getAvailableEmployee(this.userAccount.id, '', 'id', 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.employeeList = response.content.map((employee) => {
            return {
              value: employee.id,
              label: employee.fullName,
              icon: employee.picture
            };
          });
        }
      );
  }

  getRandomColor() {

    const hex2rgba = (hex, alpha = 1) => {
      const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
      return `rgba(${r},${g},${b},${alpha})`;
    };

    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      const random = letters[Math.floor(Math.random() * 16)];
      color += random;
    }
    return {
      color1: hex2rgba(color, .2),
      color2: hex2rgba(color)
    };
  }

  setRandomColor(): ChartColor[] {
    this.chartColors2[0] = new ChartColor();
    this.chartLabels2.forEach(() => {
      const colorRandom = this.getRandomColor();
      const color1 = colorRandom.color1;
      const color2 = colorRandom.color2;
      this.chartColors2[0].backgroundColor.push(color1);
      this.chartColors2[0].borderColor.push(color2);
      this.chartColors2[0].borderWidth = 2;
      this.chartColors2[0].pointBackgroundColor.push(color2);
      this.chartColors2[0].pointBorderColor = '#FFF';
      this.chartColors2[0].pointHoverBackgroundColor = '#FFF';
      this.chartColors2[0].pointHoverBorderColor.push(color2);
    });
    console.log(this.chartColors2);
    return this.chartColors2;
  }

  public chartClicked(): void {}
  public chartHovered(): void {}
}
