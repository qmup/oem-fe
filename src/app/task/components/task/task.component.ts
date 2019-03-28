import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { TaskService } from '../../service/task.service';
import { Task, TaskModel } from '../../models/task';
import { ModalDirective, ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { ScheduleService } from '../../service/schedule.service';
import { ScheduleModel } from '../../models/schedule';
import { GlobalService } from 'src/app/core/services/global.service';
import { PaginationResponse, AssignTask, NotificationSendingModel } from 'src/app/core/models/shared';
import { ManageWorkplace, PlacePagination } from 'src/app/place/models/place';
import { ZonePagination } from 'src/app/place/models/zone';
import { ZoneService } from 'src/app/place/services/zone.service';
import { CompanyService } from 'src/app/place/services/company.service';
import { TaskBasicService } from '../../service/task-basic.service';
import { Employee } from 'src/app/employee/models/employee';
import { TaskSearchResponse } from '../../models/task-search';
import { TaskSuggestionComponent } from '../task-suggestion/task-suggestion.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  id: number;
  taskList: any;
  taskCM: TaskModel = new TaskModel();
  scheduleCM: ScheduleModel = new ScheduleModel();
  sorted = false;
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('schedule') scheduleModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  @ViewChild('send') sendNotiModal: ModalDirective;
  employeeList = [];
  workplaceList = [];
  dateFrom: any;
  timeFrom: any;
  dateTo: any;
  timeTo: any;
  iconPrioritySelect = [];
  week = [];
  assignTask: AssignTask = new AssignTask();
  manageWorkplace: ManageWorkplace = new ManageWorkplace();
  userAccount: Employee;
  taskListResponse: TaskSearchResponse;
  isSelectZone: boolean;
  isSelectWorkplace: boolean;
  placeList = [];
  zoneList = [];
  isSelectCompany: boolean;
  companyList = [];
  selectedIds = [];
  taskBasicList = [];
  taskBasic = [];
  selectedTaskBasic = [];
  currentPage = 0;
  fieldSort = 'startTime:desc';
  sortBoolean = false;
  sortValue = '';
  minDate = new Date();
  notification: NotificationSendingModel = new NotificationSendingModel();
  addTaskId: number;
  modalRef: BsModalRef;
  firstStep = false;
  isSelectRange = false;
  currentCompany: any;
  currentZone: any;
  currentWorkplace: any;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private employeeService: EmployeeService,
    private scheduleService: ScheduleService,
    private workplaceService: PlaceService,
    private globalService: GlobalService,
    private taskBasicService: TaskBasicService,
    private zoneService: ZoneService,
    private companyService: CompanyService,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.manageWorkplace.managerId = this.userAccount.id;
    this.assignTask.assignerId = this.userAccount.id;
    this.iconPrioritySelect = this.globalService.iconPrioritySelect;
    this.week = this.globalService.week;
    this.getTask();
    this.getEmployee();
    this.getCompany();
  }

  sort(field: string) {
    this.sortBoolean = ! this.sortBoolean;
    this.fieldSort = field;
    if (this.sortBoolean) {
      this.fieldSort += ':asc';
    } else {
      this.fieldSort += ':desc';
    }
    this.getTask();
  }

  getTask() {
    this.taskService.search('', this.fieldSort, '', this.userAccount.id, this.currentPage, 10)
      .then(
        (response: TaskSearchResponse) => {
          this.taskListResponse = response;
          this.taskList = response.content;
        }
      );
  }


  getTaskOfWorkplaceByDate() {
    const date = this.globalService.convertToYearMonthDay(this.taskCM.startTime);
    this.workplaceService.getAvailableByDate(
      this.userAccount.id, this.manageWorkplace.zoneId, date, '', 'id', 0, 99
    ).then(
      (response) => {
        console.log(response);
      }
    );
  }

  suggestTaskBasic() {
    this.taskBasicService.getListTaskBasic(this.userAccount.id, '', '', 'id', 0, 99)
    // this.taskBasicService.getListTaskBasic(1, '', '', 'id', 0, 99)
      .then(
        (response: any) => {
          this.taskBasicList = response.content;
          this.workplaceService.getTaskBasic(this.manageWorkplace.workplaceId)
            .then(
              (response2) => {
                this.taskBasic = response2;
                this.taskBasicList.forEach((element1, i) => {
                  this.taskBasic.forEach((element2, j) => {
                    if (element1.id === element2.id) {
                      element1.checked = true;
                      this.selectedTaskBasic.push(element1);
                      i++;
                      j = 0;
                    }
                  });
                });
              }
            );
        }
      );
  }

  changeCheckbox(id: number, event: any) {
    if (event.checked && !this.selectedTaskBasic.includes((task: Task) => task.id === id)) {
      this.selectedTaskBasic.push(this.taskBasicList.find(task => task.id === id));
    } else {
      this.selectedTaskBasic = this.selectedTaskBasic.filter(task => task.id !== id);
    }
  }

  getEmployee() {
    this.employeeService.getAvailableEmployee(this.userAccount.id, '', 'id', 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.employeeList = response.content.map((employee) => {
            return {
              value: employee.id,
              label: employee.fullName,
              icon: employee.picture
            };
          });
        }
      );
  }

  getCompany() {
    this.companyService.getCompanyByManager(this.userAccount.id, '', 'id', 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.companyList = response.content.map((company) => {
            return {
              value: company.id,
              label: company.name,
              icon: company.picture
            };
          });
        }
      );
  }

  selectCompany(e: any) {
    this.manageWorkplace.companyId = e.value;
    this.isSelectCompany = true;
    this.isSelectWorkplace = false;
    this.currentCompany = e;
    this.getZone(e.value);
  }

  selectEmployee(e: any) {
    this.assignTask.assigneeId = e.value;
  }

  getZone(companyId: number) {
    this.zoneService.getAll(this.userAccount.id, companyId, '', '', 'id', 0, 99)
      .then(
        (response: ZonePagination) => {
          this.zoneList = response.listOfZone.content.map((zone) => {
            return {
              value: zone.id,
              label: zone.name,
              icon: zone.picture
            };
          });
        }
      );
  }

  selectZone(e: any) {
    this.manageWorkplace.zoneId = e.value;
    this.currentZone = e;
    this.isSelectZone = true;
    this.getWorkplace(e.value);
  }

  getWorkplace(zoneId: number) {
    const d = this.minDate.getDate();
    const m = this.minDate.getMonth();
    const y = this.minDate.getFullYear();
    const from = new Date(y, m, d, 0, 0, 0, 0).toISOString();
    const to = new Date(y, m, d, 23, 59, 0, 0).toISOString();
    this.workplaceService.getAvailableByDate(this.userAccount.id, zoneId, `${from};${to}`, '', 'numberOfReworks', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content.map((place) => {
            const numberOfReworks = place.numberOfReworks;
            const taskAssigned = place.taskList.length;
            let taskMissing = numberOfReworks - taskAssigned;
            taskMissing = Math.max(0, taskMissing);
            return {
              value: place.id,
              label: `${place.name} | Số việc chưa được giao: ${taskMissing}`,
              icon: place.picture
            };
          });
        }
      );
  }

  selectWorkplace(e: any) {
    this.isSelectWorkplace = true;
    this.manageWorkplace.workplaceId = e.value;
    this.currentWorkplace = e;
    this.suggestTaskBasic();
  }

  createTask() {
    this.taskCM.taskBasics = this.selectedTaskBasic;
    this.taskCM.duration *= 60000;
    this.taskCM.dateCreate = new Date().toISOString();
    this.taskService.create(this.taskCM)
      .then(
        (response2) => {
          this.assignTask.dateAssign = new Date().toISOString();
          this.assignTask.taskId = response2;
          this.globalService.assignTask(this.assignTask)
            .then(
              () => {
                this.workplaceService.addTaskToWorkplace(response2, this.manageWorkplace.workplaceId)
                  .then(
                    () => {
                      this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                      this.createModal.hide();
                      this.scheduleModal.hide();
                      this.sendNotiModal.show();
                    },
                    () => {
                      this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
                    }
                  );
              }
            );
        }
      );
  }

  sendNoti(confirm: string) {
    console.log(this.assignTask);
    this.notification.fromEmployeeId = this.assignTask.assignerId;
    this.notification.toEmployeeId = this.assignTask.assigneeId;
    this.notification.taskId = this.assignTask.taskId;
    this.notification.type = 0;
    (confirm === 'true') ? (this.globalService.sendNotification(this.notification), this.sendNotiModal.hide()) : this.sendNotiModal.hide();
    this.getTask();
  }

  createSchedule() {
    const option = 1;
    this.scheduleCM.daysOfWeek = [];
    for (let index = 0; index < this.week.length; index++) {
      const element = this.week[index];
      if (element.check) {
        this.scheduleCM.daysOfWeek.push(element.id);
      }
    }
    // this.scheduleCM.assigneeId = this.taskCM.assigneeId;
    // not manager yet
    this.scheduleCM.assignerId = 2;
    this.scheduleCM.description = this.taskCM.description;
    this.scheduleCM.title = this.taskCM.title;
    // this.scheduleCM.workplaceId = this.taskCM.workplaceId;
    this.scheduleCM.startTime = this.convertDateTime(this.dateFrom, this.timeFrom);
    this.scheduleCM.endTime = this.convertDateTime(this.dateTo, this.timeTo);
    this.scheduleService.create(this.scheduleCM, option)
      .then(
        (response) => {
          this.toastService.success('Tạo công việc thường nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.scheduleModal.hide();
          this.taskList = [],
          this.getTask();
        }
      );
  }

  openCreateModal() {
    this.createModal.show();
    this.taskCM.duration = 10;
  }

  openDeleteModal(id: number) {
    this.id = id;
    this.deleteModal.show();
  }

  convertDateTime(datePicker: any, timePicker: any) {
    const day = datePicker.getDate();
    const month = datePicker.getMonth();
    const year = datePicker.getFullYear();
    const hour = timePicker.split(':', 2)[0];
    const min = timePicker.split(':', 2)[1];
    console.log(+year, +month, +day);
    return new Date(+year, +month, +day, +hour, +min, 0).toISOString();
  }

  openSuggestionModal() {
    this.createModal.hide();
    const workplace = this.currentWorkplace;
    const zone = this.currentZone;
    const company = this.currentCompany;
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary modal-xl',
      initialState: { workplace, company, zone }
    };
    this.modalRef = this.modalService.show(TaskSuggestionComponent, modalOptions);
    this.modalRef.content.refresh.subscribe((result) => {
      this.createModal.show();
      this.firstStep = true;
      this.assignTask.assigneeId = result.id;
      this.taskCM.duration = result.duration;
      this.taskCM.startTime = result.startTime;
    });

  }

  search(e: any) {
    this.taskList = e.content;
    this.taskListResponse = e;
  }

  changePage1(event) {
    this.currentPage = event - 1;
    this.getTask();
  }

}
