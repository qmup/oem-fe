import { Component, OnInit } from '@angular/core';
import { GlobalService } from './core/services/global.service';
import { EmployeeService } from './employee/services/employee.service';
import { AuthService } from './authorize/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { Employee } from './employee/models/employee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isRequesting = false;
  userAccount: Employee;

  constructor(
    public globalService: GlobalService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.globalService.isRequesting.subscribe(
      (isLoading) => {
        setTimeout(() => {
          this.isRequesting = isLoading;
        }, isLoading ? 0 : 500);
    });
    this.userAccount = this.globalService.getUserAccount();
    this.notificationService.receiveMessage();

  }

}
