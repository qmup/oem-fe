import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  public chartType = 'line';

  public chartDatasets: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40, 35, 30, 80, 10, 50], label: 'Minh ngáo' },
    { data: [28, 48, 40, 19, 86, 27, 90, 80, 70, 50, 28, 90], label: 'Hải ngáo' },
    { data: [40, 35, 30, 65, 59, 80, 19, 86, 87, 40, 35, 30], label: 'An ngáo' }
  ];

  public chartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(255, 99, 132,0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(255, 99, 132,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 99, 132,1)'
    },
    {
      backgroundColor: 'rgba(54, 162, 235,0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(54, 162, 235,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(54, 162, 235,1)'
    },
    {
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(255, 206, 86, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 206, 86, 1)'
    }
  ];

  public chartOptions: any = {
    responsive: true
  };
  showFromDate = false;
  public chartClicked(): void { }
  public chartHovered(): void { }

  constructor() { }

}
