import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { TaskSuggestion, Task } from '../../models/task';
import { Employee } from 'src/app/employee/models/employee';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { TaskList } from 'src/app/place/models/place';

@Component({
  selector: 'app-task-suggestion',
  templateUrl: './task-suggestion.component.html',
  styleUrls: ['./task-suggestion.component.scss']
})
export class TaskSuggestionComponent implements OnInit {

  refresh: EventEmitter<any> = new EventEmitter<any>();
  taskSuggestion: TaskSuggestion[] = new Array<TaskSuggestion>();
  workplace: any;
  company: any;
  zone: any;
  minDate = new Date();
  startTime: any;
  startHour: any;
  endTime: any;
  isSelectRange = false;
  duration: number;
  userAccount: Employee;
  defaultImage = '../../../../assets/default-image.jpg';
  taskList: TaskList;

  constructor(
    public modalRef: BsModalRef,
    private globalService: GlobalService,
    private employeeService: EmployeeService,
    private workplaceService: PlaceService,
  ) { }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.getTaskOfWorkplaceByDate();
  }

  getTaskOfWorkplaceByDate() {
    let d: number;
    let m: number;
    let y: number;
    let from: string;
    let to: string;

    if (this.startTime) {
      d = this.startTime.getDate();
      m = this.startTime.getMonth();
      y = this.startTime.getFullYear();
    } else {
      d = this.minDate.getDate();
      m = this.minDate.getMonth();
      y = this.minDate.getFullYear();
    }
    from = new Date(y, m, d, 0, 0, 0, 0).toISOString();
    to = new Date(y, m, d, 23, 59, 0, 0).toISOString();

    this.workplaceService.getAvailableByDate(
      this.userAccount.id, '', 1, this.zone.value, `${from};${to}`, '', '', 0, 99
    ).then(
      (response) => {
        this.taskList = response.listOfWorkplace.content.find(t => t.id === this.workplace.value).taskList;
      }
    );
  }

  changeStartTime() {
    this.duration = 0;
    this.getTaskOfWorkplaceByDate();
  }

  changeRange(e: any) {
    this.endTime = this.startTime.getTime() + (e.value * 60000);
  }

  suggest() {
    const date = this.startTime.getDate();
    const month = this.startTime.getMonth();
    const year = this.startTime.getFullYear();
    const from = new Date(year, month, date, 0, 0, 0).toISOString();
    const to = new Date(year, month, date, 23, 59, 0).toISOString();

    this.employeeService.suggest(
      this.userAccount.id, this.workplace.value, `${from};${to}`, this.startTime.toISOString(), this.duration * 60000
    ).then(
      (response) => {
        this.taskSuggestion = response;
      }
    );
  }

  selectEmployee(id: number) {
    const startTime = this.startTime;
    const duration = this.duration;
    this.modalRef.hide();
    console.log(id);
    this.refresh.emit(
      { id, startTime, duration }
    );
  }

  cancel() {
    this.modalRef.hide();
    this.refresh.emit({ id: 0, startTime: '', duration: 0});
  }

}
