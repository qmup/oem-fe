import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService, IMyOptions } from 'ng-uikit-pro-standard';
import { TaskService } from '../../service/task.service';
import { Task, TaskModel } from '../../models/task';
import { ModalDirective } from 'ngx-bootstrap';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { Employee } from 'src/app/employee/models/employee';
import { Place } from 'src/app/place/models/place';
import { ScheduleService } from '../../service/schedule.service';
import { ScheduleModel } from '../../models/schedule';

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
  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd-mm-yyyy',
    minYear: +new Date().getFullYear(),
    disableUntil: {
      year: +new Date().getFullYear(),
      month: +new Date().getMonth() + 1,
      day: +new Date().getDate() - 1
    }
  };

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private employeeService: EmployeeService,
    private scheduleService: ScheduleService,
    private workplaceService: PlaceService,
  ) {}

  ngOnInit() {
    this.getTask();
    this.getEmployee();
    // this.getWorkplace();
    this.iconPrioritySelect = [
      { value: 1, label: 'Rất cao',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/highest.svg' },
      { value: 2, label: 'Cao',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/high.svg' },
      { value: 3, label: 'Bình thường',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/medium.svg' },
      { value: 4, label: 'Thấp',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/low.svg' },
      { value: 5, label: 'Rất thấp',
      icon: 'https://capstonedfk.atlassian.net/images/icons/priorities/lowest.svg' },
    ];
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
    this.taskService.getTodayTask(1)
      .then(
        (response: Task[]) => {
          this.taskList = response;
          this.taskList = [
            {
              assignee: {
                name: 'Nguyễn Minh Quân'
              },
              assigner: {
                name: 'Nguyễn Sinh Cung'
              },
              daysOfWeek: [1, 2, 3],
              description: 'Dọn phòng 201',
              endTime: '2019-03-01T10:26:00.996Z',
              id: 1,
              startTime: '2018-03-02T10:26:00.996Z',
              status: 'Đã thực hiện',
              title: 'Dọn vệ sinh',
              workplace: {
                name: 'Phòng 201'
              },
              priority: 1,
            },
            {
              assignee: {
                name: 'Nguyễn Hoàng Vũ'
              },
              assigner: {
                name: 'Nguyễn Sinh Cung'
              },
              daysOfWeek: [1, 2, 3],
              description: 'Dọn phòng 202',
              endTime: '2019-03-01T10:26:00.996Z',
              id: 1,
              startTime: '2018-03-02T10:26:00.996Z',
              status: 'Chưa bắt đầu',
              title: 'Dọn vệ sinh',
              workplace: {
                name: 'Phòng 202'
              },
              priority: 1,
            }
          ];
        }
      );
  }

  getEmployee() {
    this.employeeService.getAll()
      .then(
        (response: Employee[]) => {
          this.employeeList = response.map((employee) => {
            return {
              value: employee.id,
              label: employee.fullName
            };
          });
        }
      );
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
    this.taskCM.startTime = this.convertDateTime(this.dateFrom, this.timeFrom);
    this.taskCM.endTime = this.convertDateTime(this.dateTo, this.timeTo);
    this.taskCM.dateCreate = new Date().toISOString();
    // not manager yet
    this.taskCM.assignerId = 2;
    this.taskService.create(this.taskCM)
      .then(
        (response) => {
          this.toastService.success('Tạo mới công việc thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.taskList = [],
          this.getTask();
        }
      );
  }

  removeTask(id: number) {
    const options = { positionClass: 'toast-bottom-right' };
    this.taskService.removeTask(this.id)
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
    this.scheduleCM.assigneeId = this.taskCM.assigneeId;
    // not manager yet
    this.scheduleCM.assignerId = 2;
    this.scheduleCM.description = this.taskCM.description;
    this.scheduleCM.title = this.taskCM.title;
    this.scheduleCM.workplaceId = this.taskCM.workplaceId;
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
    const day = datePicker.split('-', 3)[0];
    const month = datePicker.split('-', 3)[1];
    const year = datePicker.split('-', 3)[2];
    const hour = timePicker.split(':', 2)[0];
    const min = timePicker.split(':', 2)[1];
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
