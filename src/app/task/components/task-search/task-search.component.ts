import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { Employee } from 'src/app/employee/models/employee';
import { GlobalService } from 'src/app/core/services/global.service';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PaginationResponse } from 'src/app/core/models/shared';
import { PlacePagination } from 'src/app/place/models/place';
import { PlaceService } from 'src/app/place/services/place.service';
import { TaskService } from '../../service/task.service';
import { AdvancedSearchRequest } from '../../models/task';

@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements OnChanges {

  @Input() sortRequest: string;
  @Input() page: number;
  @Input() size: number;
  @Output() searchChanged: EventEmitter<any> = new EventEmitter();

  statusList = [];
  attendanceStatusList = [];
  employeeList = [];
  placeList = [];
  moreList = [];
  compareList = [];
  optionsSelect = [];
  userAccount: Employee;
  currentPage = 0;
  comparation = 1;

  selectTitle = false;
  selectDateUpdate = false;
  selectDateCreate = false;
  selectDateStart = false;
  selectDuration = false;

  filterRequest = '';
  filterRequestArray = [];

  searchRequest = '';
  searchRequestArray = [];

  assigneeString = `"ASSIGNEE":`;
  statusString = `"status":`;
  workplaceString = `"WORKPLACE":`;
  attendanceString = `"attendanceStatus":`;
  titleString = `"title":`;
  idString = `"id":`;

  statusArrayId = [];
  assigneeArrayId = [];
  workplaceArrayId = [];
  attendanceArrayId = [];

  dateCreateString = `"dateCreate":`;
  dateUpdateString = `"dateUpdate":`;
  durationString = `"duration":`;
  startTimeString = `"startTime":`;

  dateCreate = [];
  dateUpdate = [];
  duration: number;
  title = '';
  taskId: number;
  startTime = [];

  constructor(
    private globalService: GlobalService,
    private employeeService: EmployeeService,
    private workplaceService: PlaceService,
    private taskService: TaskService,
  ) { }

  ngOnChanges() {

    this.userAccount = this.globalService.getUserAccount();
    this.statusList = this.globalService.statusList;
    this.attendanceStatusList = this.globalService.attendanceStatusList;
    this.moreList = this.globalService.moreList;
    this.compareList = [{ value: 1, label: '≥'}, { value: 2, label: '≤'}];
    this.getEmployeeByManager();
    this.getWorkplaceByManager();

    this.search();

  }

  getEmployeeByManager() {
    this.employeeService.getEmployeeByManager(1, this.userAccount.id, '', '', 'id', this.currentPage, 99)
      .then(
        (response: PaginationResponse) => {
          this.employeeList = response.content.map(e => {
            return {
              id: e.id,
              label: e.fullName,
              icon: e.picture,
            };
          });
        }
      );
  }

  getWorkplaceByManager() {
    this.workplaceService.getWorkplaceByManager(this.userAccount.id, '', '', 1, '', 'id', 0, 99)
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
    } else if (e.value === 4) {
      this.selectTitle = true;
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
    } else if (e.value === 4) {
      this.selectTitle = false;
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

    this.assigneeString = `"ASSIGNEE":`;
    this.statusString = `"status":`;
    this.workplaceString = `"WORKPLACE":`;
    this.attendanceString = `"attendanceStatus":`;
    this.idString = `"id":`;
    this.titleString = `"title":`;

    this.dateCreateString = `"dateCreate":`;
    this.dateUpdateString = `"dateUpdate":`;
    this.durationString = `"duration":`;
    this.startTimeString = `"startTime":`;

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

    if (this.selectDuration && this.duration) {
      const duration = this.duration * 60000;
      if (this.comparation === 1) {
        this.durationString += '">=' + duration;
      } else {
        this.durationString += '"<=' + duration;
      }
      this.durationString += '"';
      this.searchRequestArray.push(this.durationString);
    }
    if (this.title.length !== 0) {
      this.titleString += '"' + this.title;
      this.titleString += '"';
      this.searchRequestArray.push(this.titleString);
    }
    if (this.taskId) {
      this.idString += '"' + this.taskId;
      this.idString += '"';
      this.searchRequestArray.push(this.idString);
    }
    if (this.selectDateCreate && this.dateCreate.length > 0) {
      if (this.dateCreate.length === 1) {
        this.dateCreateString += '"' + (this.dateCreate[0].toISOString());
      } else {
        this.dateCreateString += '"' + (this.dateCreate[0].toISOString() + ';' + this.dateCreate[1].toISOString());
      }
      this.dateCreateString += '"';
      this.searchRequestArray.push(this.dateCreateString);
    }
    if (this.selectDateStart && this.startTime.length > 0) {
      if (this.startTime.length === 1) {
        this.startTimeString += '"' + (this.startTime[0].toISOString());
      } else {
        this.startTimeString += '"' + (this.startTime[0].toISOString() + ';' + this.startTime[1].toISOString());
      }
      this.startTimeString += '"';
      this.searchRequestArray.push(this.startTimeString);
    }
    if (this.selectDateUpdate && this.dateUpdate.length > 0) {
      if (this.dateUpdate.length === 1) {
        this.dateUpdateString += '"' + (this.dateUpdate[0].toISOString());
      } else {
        this.dateUpdateString += '"' + (this.dateUpdate[0].toISOString() + ';' + this.dateUpdate[1].toISOString());
      }
      this.dateUpdateString += '"';
      this.searchRequestArray.push(this.dateUpdateString);
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
        this.page,
        this.size
      )
      .then(
        (response) => {

          this.searchChanged.emit(response);
        }
      );

      this.resetData();


  }

}
