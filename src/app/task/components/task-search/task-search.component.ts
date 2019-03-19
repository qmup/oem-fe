import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/employee/models/employee';
import { GlobalService } from 'src/app/core/services/global.service';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PaginationResponse } from 'src/app/core/models/shared';
import { PlacePagination } from 'src/app/place/models/place';
import { PlaceService } from 'src/app/place/services/place.service';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements OnInit {

  typeList = [];
  statusList = [];
  attendanceStatusList = [];
  employeeList = [];
  placeList = [];
  moreList = [];
  userAccount: Employee;
  currentPage = 0;

  constructor(
    private globalService: GlobalService,
    private employeeService: EmployeeService,
    private workplaceService: PlaceService
  ) { }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.typeList = this.globalService.typeList;
    this.statusList = this.globalService.statusList;
    this.attendanceStatusList = this.globalService.attendanceStatusList;
    this.moreList = this.globalService.moreList;
    this.getEmployeeByManager();
    this.getWorkplaceByManager();
  }

  getEmployeeByManager() {
    this.employeeService.getEmployeeByManager(this.userAccount.id, 3, '', 'id', this.currentPage, 99)
      .then(
        (response: PaginationResponse) => {
          this.employeeList = response.content.map(e => {
            return {
              id: e.id,
              label: e.fullName,
              icon: e.picture
            };
          });
        }
      );
  }

  getWorkplaceByManager() {
    this.workplaceService.getWorkplaceByManager(this.userAccount.id, '', '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content.map(p => {
            return {
              id: p.id,
              label: p.name,
              icon: p.picture
            };
          });
        }
      );
  }
}
