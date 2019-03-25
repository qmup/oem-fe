import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { TaskSuggestion, Task } from '../../models/task';
import { Employee } from 'src/app/employee/models/employee';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-task-suggestion',
  templateUrl: './task-suggestion.component.html',
  styleUrls: ['./task-suggestion.component.scss']
})
export class TaskSuggestionComponent implements OnInit {

  refresh: EventEmitter<any> = new EventEmitter<any>();
  taskSuggestion: TaskSuggestion[] = new Array<TaskSuggestion>();
  taskCM: any;
  workplace: any;
  company: any;
  userAccount: Employee;

  constructor(
    public modalRef: BsModalRef,
    private globalService: GlobalService,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.taskCM.endTime = this.taskCM.startTime.getTime() + (this.taskCM.duration * 60000);
    this.suggest();
  }

  suggest() {
    const date = this.taskCM.startTime.getDate();
    const month = this.taskCM.startTime.getMonth();
    const year = this.taskCM.startTime.getFullYear();
    const from = new Date(year, month, date, 0, 0, 0).toISOString();
    const to = new Date(year, month, date + 1, 0, 0, 0).toISOString();

    this.employeeService.suggest(
      this.userAccount.id, this.workplace.value, `${from};${to}`, this.taskCM.startTime.toISOString(), this.taskCM.duration * 60000
    ).then(
      (response) => {
        this.taskSuggestion = response;
      }
    );
  }

  selectEmployee(id: number) {
    this.modalRef.hide();
    this.refresh.emit(id);
  }

  cancel() {
    this.modalRef.hide();
    this.refresh.emit(0);
  }

}
