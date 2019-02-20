import { Component } from '@angular/core';
import { TaskService } from 'src/app/task/service/task.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private taskService: TaskService
  ) { }

  public chartType = 'line';

  public chartDatasets: Array<any> = [
    { data: [1, 5, 3, 7, 2, 9, 1, 2, 0, 4, 4, 5], label: 'Đã hoàn thành' },
    { data: [0, 0, 0, 2, 1, 1, 3, 1, 1, 3, 0, 0], label: 'Chưa hoàn thành' },
    { data: [0, 0, 1, 1, 2, 0, 3, 1, 1, 3, 2, 1], label: 'Quá hạn' },
  ];

  public chartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public chartColors: Array<any> = [
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
      backgroundColor: 'rgba(41, 182, 246, 0.2)',
      borderColor: 'rgba(41, 182, 246 , 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(41, 182, 246, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(41, 182, 246, 1)'
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

  public chartOptions: any = {
    responsive: true
  };
  showFromDate = false;
  public chartClicked(): void { }
  public chartHovered(): void { }


}
