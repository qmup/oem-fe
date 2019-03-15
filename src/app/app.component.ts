import { Component, OnInit } from '@angular/core';
import { GlobalService } from './core/services/global.service';
import { EmployeeService } from './employee/services/employee.service';
import { AuthService } from './authorize/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isRequesting = false;

  constructor(
    public globalService: GlobalService,
  ) { }

  ngOnInit() {
    this.globalService.isRequesting.subscribe(
      (isLoading) => {
        setTimeout(() => {
          this.isRequesting = isLoading;
        }, isLoading ? 0 : 500);
    });
  }
}
