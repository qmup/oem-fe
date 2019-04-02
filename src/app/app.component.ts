import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { GlobalService } from './core/services/global.service';
import { EmployeeService } from './employee/services/employee.service';
import { AuthService } from './authorize/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { Employee } from './employee/models/employee';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  isRequesting = false;
  isRequestingGoogleMap = false;
  userAccount: Employee;

  private subscription: Subscription;

  constructor(
    public globalService: GlobalService,
    private notificationService: NotificationService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.subscription = this.globalService.isRequesting.subscribe(
      (isLoading) => {
        this.isRequesting = isLoading;
        this.changeDetectorRef.detectChanges();
    });
    this.subscription = this.globalService.isRequestingGoogleMap.subscribe(
      (isLoading) => {
        this.isRequestingGoogleMap = isLoading;
        this.changeDetectorRef.detectChanges();
    });
    this.userAccount = this.globalService.getUserAccount();
    this.notificationService.receiveMessage();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
