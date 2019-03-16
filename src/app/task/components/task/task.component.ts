import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService, IMyOptions } from 'ng-uikit-pro-standard';
import { TaskService } from '../../service/task.service';
import { Task, TaskModel } from '../../models/task';
import { ModalDirective } from 'ngx-bootstrap';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { ScheduleService } from '../../service/schedule.service';
import { ScheduleModel } from '../../models/schedule';
import { GlobalService } from 'src/app/core/services/global.service';
import { PaginationResponse, AssignTask } from 'src/app/core/models/shared';
import { ManageWorkplace, Place, PlacePagination } from 'src/app/place/models/place';
import { Zone } from 'src/app/place/models/zone';
import { ZoneService } from 'src/app/place/services/zone.service';
import { CompanyService } from 'src/app/place/services/company.service';
import { Company } from 'src/app/place/models/company';
import { TaskBasicService } from '../../service/task-basic.service';
import { TaskBasic } from '../../models/task-basic';
import { Employee } from 'src/app/employee/models/employee';

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
  employeeList: any[];
  workplaceList: any[];
  dateFrom: any;
  timeFrom: any;
  dateTo: any;
  timeTo: any;
  iconPrioritySelect: any[];
  week: any[];
  assignTask: AssignTask = new AssignTask();
  manageWorkplace: ManageWorkplace = new ManageWorkplace();
  userAccount: Employee;
  taskListResponse: PaginationResponse;
  isSelectZone: boolean;
  isSelectWorkplace: boolean;
  placeList: { value: number; label: string; icon: string; }[];
  zoneList: { value: any; label: any; icon: any; }[];
  isSelectCompany: boolean;
  companyList: { value: number; label: string; icon: string; }[];
  selectedIds: any[];
  taskBasicList: any[];
  taskBasic: any[];
  selectedTaskBasic: TaskBasic[];

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private employeeService: EmployeeService,
    private scheduleService: ScheduleService,
    private workplaceService: PlaceService,
    private globalService: GlobalService,
    private taskBasicService: TaskBasicService,
    private zoneService: ZoneService,
    private companyService: CompanyService
  ) {}

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.manageWorkplace.managerId = 2;
    this.assignTask.assignerId = 2;
    this.assignTask.dateAssign = this.globalService.convertToYearMonthDay(new Date());
    this.getTask();
    this.getEmployee();
    this.getCompany();
    this.iconPrioritySelect = this.globalService.iconPrioritySelect;
    this.week = [
      { id: 1, inputId: 'option1', label: 'Thứ 2' , check: false},
      { id: 2, inputId: 'option2', label: 'Thứ 3' , check: false},
      { id: 3, inputId: 'option3', label: 'Thứ 4' , check: false},
      { id: 4, inputId: 'option4', label: 'Thứ 5' , check: false},
      { id: 5, inputId: 'option5', label: 'Thứ 6' , check: false},
      { id: 6, inputId: 'option6', label: 'Thứ 7' , check: false},
      { id: 7, inputId: 'option7', label: 'Chủ nhật' , check: false},
    ];
  }

  sortBy(by: string | any): void {

    this.taskList.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });

    this.sorted = !this.sorted;
  }

  getTask() {
    // this.taskService.getTaskByManager(this.userAccount.employeeId, '', '', 'id', 0, 5)
    this.taskService.getTaskByManager(2, '', '', 'id', 0, 5)
      .then(
        (response: PaginationResponse) => {
          this.taskListResponse = response;
          this.taskList = response.content;
        }
      );
  }

  suggestTaskBasic() {
    // this.taskBasicService.getListTaskBasic(this.userAccount.employeeId, '', '', 'id', 0, 99)
    this.taskBasicService.getListTaskBasic(1, '', '', 'id', 0, 99)
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

  changeCheckbox(event: any) {
    if (event.checked === true) {
      this.selectedTaskBasic.push(event);
    }
  }

  getEmployee() {
    this.employeeService.getEmployeeByManager(this.userAccount.id, 3, '', 'id', 0, 99)
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
    this.getZone(e.value);
  }

  getZone(compannyId: number) {
    this.zoneService.getZoneByManager(this.userAccount.id, '', 'id', 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.zoneList = response.content.map((zone) => {
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
    this.isSelectZone = true;
    this.getWorkplace(e.value);
  }

  getWorkplace(zoneId: number) {
    this.workplaceService.getAll(zoneId, '', '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content.map((place) => {
            return {
              value: place.id,
              label: place.name,
              icon: place.picture
            };
          });
        }
      );
  }

  selectWorkplace(e: any) {
    this.isSelectWorkplace = true;
    this.manageWorkplace.workplaceId = e.value;
    this.suggestTaskBasic();
  }

  // getWorkplace() {
  //   this.workplaceService.getAll()
  //     .then(
  //       (response: Place[]) => {
  //         this.workplaceList = response.map((workplace) => {
  //           return {
  //             value: workplace.id,
  //             label: workplace.name
  //           };
  //         });
  //       }
  //     );
  // }

  createTask() {
    this.workplaceService.getTaskBasic(this.manageWorkplace.workplaceId)
      .then(
        (response) => {
          this.taskCM.taskBasics = response;
          this.taskCM.duration *= 1000;
          this.taskCM.dateCreate = new Date().toISOString();
          this.taskCM.startTime = this.convertDateTime(this.dateFrom, this.timeFrom);
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
                            this.taskList = [];
                            this.getTask();
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
      );
  }

  removeTask(id: number) {
    const options = { positionClass: 'toast-bottom-right' };
    this.taskService.remove(this.id)
      .then(
        () => {
          this.toastService.success('Xóa công việc thành công', '', options);
          this.deleteModal.hide();
          this.taskList = [];
          this.getTask();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', options);
        }
      );
  }

  createSchedule() {
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
    console.log(this.dateFrom, this.timeFrom);
    this.scheduleCM.startTime = this.convertDateTime(this.dateFrom, this.timeFrom);
    console.log(this.scheduleCM.startTime);
    this.scheduleCM.endTime = this.convertDateTime(this.dateTo, this.timeTo);
    this.scheduleService.create(this.scheduleCM)
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

  // openDeleteModal(id: number) {
  //   this.id = id;
  //   this.deleteModal.show();
  // }

  // openUpdateModal(place: Place) {
  //   const modalOptions: ModalOptions = {
  //     animated: true,
  //     class: 'modal-notify modal-primary',
  //     initialState: { place }
  //   };
  //   this.modalRef = this.modalService.show(PlaceUpdateComponent, modalOptions);
  //   this.modalRef.content.refresh.subscribe(() => this.getPlace());

  // }

}
