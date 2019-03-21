import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Employee } from 'src/app/employee/models/employee';
import { GlobalService } from 'src/app/core/services/global.service';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PaginationResponse } from 'src/app/core/models/shared';
import { PlacePagination } from 'src/app/place/models/place';
import { PlaceService } from 'src/app/place/services/place.service';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements OnInit {

  @Output() searchChanged: EventEmitter<any> = new EventEmitter();

  typeList = [];
  statusList = [];
  attendanceStatusList = [];
  employeeList = [];
  placeList = [];
  moreList = [];
  optionsSelect = [];
  userAccount: Employee;
  currentPage = 0;

  selectDateUpdate = false;
  selectDateCreate = false;
  selectDateStart = false;
  selectDuration = false;

  filterRequest = '';
  filterRequestArray = [];
  searchRequest = '';
  searchRequestArray = [];
  sortRequest = 'title:asc';

  assigneeString = `"ASSIGNEE":`;
  statusString = `"status":`;
  workplaceString = `"WORKPLACE":`;
  attendanceString = `"attendanceStatus":`;

  statusArrayId = [];
  assigneeArrayId = [];
  workplaceArrayId = [];
  attendanceArrayId = [];

  dateCreateString = `"dateCreate":`;
  dateUpdateString = `"dateUpdate":`;
  durationString = `"duration":`;
  startTimeString = `"startTime":`;
  titleString = `"title":`;

  dateCreate = [];
  dateUpdate = [];
  duration = 0;
  title = '';
  startTime = [];

  constructor(
    private globalService: GlobalService,
    private employeeService: EmployeeService,
    private workplaceService: PlaceService,
    private taskService: TaskService,
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

  selectMore(e) {
    if (e.value === 1) {
      this.selectDateUpdate = true;
    } else if (e.value === 2) {
      this.selectDuration = true;
    } else if (e.value === 3) {
      this.selectDateCreate = true;
    } else {
      this.selectDateStart = true;
    }
  }

  deselectMore(e) {
    if (e.value === 1) {
      this.selectDateUpdate = false;
    } else if (e.value === 2) {
      this.selectDuration = false;
    } else if (e.value === 3) {
      this.selectDateCreate = false;
    } else {
      this.selectDateStart = false;
    }
  }

  selectStatus(e) {
    if (!this.statusArrayId.includes(e.value)) {
      this.statusArrayId.push(e.value);
    }
  }

  deselectStatus(e) {
    this.statusArrayId = this.statusArrayId.filter(id => id !== e.value);
  }

  selectAttendance(e) {
    if (!this.attendanceArrayId.includes(e.value)) {
      this.attendanceArrayId.push(e.value);
    }
  }

  deselectAttendance(e) {
    this.attendanceArrayId = this.attendanceArrayId.filter(id => id !== e.value);
  }

  selectEmployee(e) {
    if (!this.assigneeArrayId.includes(e.id)) {
      this.assigneeArrayId.push(e.id);
    }
  }

  deselectEmployee(e) {
    this.assigneeArrayId = this.assigneeArrayId.filter(id => id !== e.id);

  }

  selectWorkplace(e) {
    if (!this.workplaceArrayId.includes(e.id)) {
      this.workplaceArrayId.push(e.id);
    }
  }

  deselectWorkplace(e) {
    this.workplaceArrayId = this.workplaceArrayId.filter(id => id !== e.id);
  }

  convertArrayToString(arrayIds, typeString) {
    let string = '"';
    arrayIds.forEach((element, i) => {
      string += element;
      if (i !== arrayIds.length - 1) {
        string += ';';
      }
    });
    string += '"';
    typeString += string;
    this.filterRequestArray.push(typeString);
  }

  convertDateToString(date: any, typeString) {
      typeString = '"';
      date.forEach((element, i) => {
        typeString += element.toISOString();
        if (i !== date.length - 1) {
          typeString += ';';
        }
      });
      typeString += '"';

  }

  resetData() {
    this.filterRequest = '';
    this.filterRequestArray = [];
    this.searchRequest = '';
    this.searchRequestArray = [];
    this.sortRequest = 'title:asc';

    this.assigneeString = `"ASSIGNEE":`;
    this.statusString = `"status":`;
    this.workplaceString = `"WORKPLACE":`;
    this.attendanceString = `"attendanceStatus":`;

    this.dateCreateString = `"dateCreate":`;
    this.dateUpdateString = `"dateUpdate":`;
    this.durationString = `"duration":`;
    this.startTimeString = `"startTime":`;
    this.titleString = `"title":`;

    this.dateCreate = [];
    this.dateUpdate = [];
    this.duration = 0;
    this.title = '';
    this.startTime = [];
  }

  search() {
    if (this.statusArrayId.length > 0) {
      this.convertArrayToString(this.statusArrayId, this.statusString);
    }
    if (this.assigneeArrayId.length > 0) {
      this.convertArrayToString(this.assigneeArrayId, this.assigneeString);
    }
    if (this.workplaceArrayId.length > 0) {
      this.convertArrayToString(this.workplaceArrayId, this.workplaceString);
    }
    if (this.attendanceArrayId.length > 0) {
      this.convertArrayToString(this.attendanceArrayId, this.attendanceString);
    }
    if (this.selectDuration && this.duration !== 0) {
      this.durationString += '"' + this.duration;
      this.durationString += '"';
      this.searchRequestArray.push(this.durationString);
    }
    if (this.title.length !== 0) {
      this.titleString += '"' + this.title;
      this.titleString += '"';
      this.searchRequestArray.push(this.titleString);
    }
    if (this.selectDateCreate && this.dateCreate.length > 0) {
      this.dateCreateString += '"' + (this.dateCreate[0].toISOString() + ';' + this.dateCreate[1].toISOString());
      this.dateCreateString += '"';
      this.searchRequestArray.push(this.dateCreateString);
    }
    if (this.selectDateStart && this.startTime.length > 0) {
      this.startTimeString += '"' + (this.startTime[0].toISOString() + ';' + this.startTime[1].toISOString());
      this.startTimeString += '"';
      this.searchRequestArray.push(this.startTimeString);
    }
    if (this.selectDateUpdate && this.dateUpdate.length > 0) {
      this.dateUpdateString += '"' + (this.dateUpdate[0].toISOString() + ';' + this.dateUpdate[1].toISOString());
      this.dateUpdateString += '"';
      this.searchRequestArray.push(this.dateUpdateString);
    }
    if (this.filterRequestArray.length > 0) {
      this.filterRequest = '{';
      this.filterRequestArray.forEach((element, i) => {
        this.filterRequest += element;
        if (i !== this.filterRequestArray.length - 1) {
          this.filterRequest += ',';
        }
      });
      this.filterRequest += '}';
    }
    if (this.searchRequestArray.length > 0) {
      this.searchRequest = '{';
      this.searchRequestArray.forEach((element, i) => {
        this.searchRequest += element;
        if (i !== this.searchRequestArray.length - 1) {
          this.searchRequest += ',';
        }
      });
      this.searchRequest += '}';
    }

    this.taskService.search(
        this.searchRequest,
        this.sortRequest,
        this.filterRequest,
        this.userAccount.id,
        0, 10
      )
      .then(
        (response) => {
          this.searchChanged.emit(response);
        },
        (error) => {
          console.log(error);
        }
      );

      this.resetData();

  }

}
