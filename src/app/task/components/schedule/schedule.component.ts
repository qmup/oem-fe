import { Component, OnInit, ViewChild } from '@angular/core';
import { ScheduleService } from '../../service/schedule.service';
import { Schedule, ScheduleModel } from '../../models/schedule';
import { ModalDirective, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { Employee } from 'src/app/employee/models/employee';
import { Place } from 'src/app/place/models/place';
import { ToastService } from 'ng-uikit-pro-standard';
import { ScheduleDetailComponent } from '../schedule-detail/schedule-detail.component';
import { PaginationResponse } from 'src/app/core/models/shared';
import { GlobalService } from 'src/app/core/services/global.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  id: number;
  sorted = false;
  timeTo: any;
  timeFrom: any;
  scheduleList: Schedule[] = [];
  scheduleResponse: PaginationResponse = new PaginationResponse();
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  scheduleCM: ScheduleModel = new ScheduleModel();
  week = [];
  workplaceList = [];
  employeeList = [];
  modalRef: BsModalRef;
  userAccount: Employee;
  fieldSort = 'id';
  sortBoolean = false;
  sortValue = '';
  searchValue = '';

  constructor(
    private scheduleService: ScheduleService,
    private employeeService: EmployeeService,
    private workplaceService: PlaceService,
    private toastService: ToastService,
    private modalService: BsModalService,
    private globalService: GlobalService,
  ) { }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.getSchedule();
  }

  sort(field: string) {
    this.sortBoolean = ! this.sortBoolean;
    if (this.sortBoolean) {
      this.sortValue = 'asc';
    } else {
      this.sortValue = 'desc';
    }
    this.fieldSort = field;
    this.getSchedule();
  }

  getSchedule() {
    this.scheduleService.getAll(this.searchValue, this.userAccount.id, this.sortValue, this.fieldSort, 0, 10)
      .then(
        (response: PaginationResponse) => {
          this.scheduleList = response.content;
          this.scheduleList.forEach((element: any) => {
            element.endTime = new Date(element.startTime).getTime() + element.duration;
          });
          this.scheduleResponse = response;
          this.scheduleList.forEach(element => {
            element.dayList = element.daysOfWeek.split(',');
          });
        }
      );
  }

  getEmployee() {
    // this.employeeService.getAll()
    //   .then(
    //     (response: Employee[]) => {
    //       this.employeeList = response.map((employee) => {
    //         return {
    //           value: employee.id,
    //           label: employee.fullName
    //         };
    //       });
    //     }
    //   );
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

  openCreateModal() {
    this.createModal.show();
  }

  openDeleteModal(id: number) {
    this.id = id;
    this.deleteModal.show();
  }

  openDetailModal(schedule: Schedule) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { schedule }
    };
    this.modalRef = this.modalService.show( ScheduleDetailComponent , modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getSchedule());
  }

  switch(id: number) {
    // this.scheduleService.switch(id)
    //   .then(
    //   );
  }

  convertDateTime(datePicker: any, timePicker: any) {
    const day = datePicker.split('-', 3)[0];
    const month = datePicker.split('-', 3)[1];
    const year = datePicker.split('-', 3)[2];
    const hour = timePicker.split(':', 2)[0];
    const min = timePicker.split(':', 2)[1];
    return new Date(+year, +month, +day, +hour, +min, 0).toISOString();
  }

  createSchedule() {
    this.scheduleCM.daysOfWeek = [];
    for (let index = 0; index < this.week.length; index++) {
      const element = this.week[index];
      if (element.check) {
        this.scheduleCM.daysOfWeek.push(element.id);
      }
    }
    this.scheduleService.create(this.scheduleCM)
      .then(
        (response) => {
          this.toastService.success('Tạo công việc thường nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.scheduleList = [],
          this.getSchedule();
        }
      );
  }

  removeSchedule(id: number) {
    // const options = { positionClass: 'toast-bottom-right' };
    // this.scheduleService.removeTask(this.id)
    //   .then(
    //     () => {
    //       this.toastService.success('Xóa công việc thành công', '', options);
    //       this.deleteModal.hide();
    //       this.scheduleList = [];
    //       this.getSchedule();
    //     },
    //     () => {
    //       this.toastService.error('Đã có lỗi xảy ra' , '', options);
    //     }
    //   );
  }
}
