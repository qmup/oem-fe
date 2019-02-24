import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/task/service/task.service';
import { Task } from 'src/app/task/models/task';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dateRange: Date[];
  charts: string[] = ['pie', 'bar'];
  taskList: Task[];

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

  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
  }

  search() {
    const startTime = this.dateRange ? this.dateRange[0].toLocaleDateString('sv') : '';
    const endTime = this.dateRange ? this.dateRange[1].toLocaleDateString('sv') : '';
    this.taskService.getTaskByDate(1, startTime, endTime)
      .then(
        (response: Task[]) => {
          this.taskList = response;
          console.log(this.taskList);
        }
      );
  }

  chartHovered() {

  }

  chartClicked() {

  }


}
