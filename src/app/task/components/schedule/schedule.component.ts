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
  scheduleList: Schedule[] = [
    {
      id: 1, assignee: { id: 1, name: 'test' }, assigner: { id: 2, name: 'test' },
      daysOfWeek: '1, 2, 3', description: 'test', endTime: '2019-02-17T17:00:56.000+0000', startTime: '2019-02-17T17:00:56.000+0000',
      status: 'not start', title: 'don ve sinh', workplace: {id: 1, name: 'test'}
    },
    {
      id: 2, assignee: { id: 1, name: 'test' }, assigner: { id: 2, name: 'test' },
      daysOfWeek: '1, 2, 3', description: 'test', endTime: '2019-02-17T17:00:56.000+0000', startTime: '2019-02-17T17:00:56.000+0000',
      status: 'not start', title: 'don ve sinh', workplace: {id: 1, name: 'test'}
    },
  ];
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  scheduleCM: ScheduleModel = new ScheduleModel();
  iconPrioritySelect: any[];
  week: any[];
  workplaceList: any[];
  employeeList: any[];
  modalRef: BsModalRef;

  constructor(
    private scheduleService: ScheduleService,
    private employeeService: EmployeeService,
    private workplaceService: PlaceService,
    private toastService: ToastService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    // this.getSchedule();
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

    this.scheduleList.sort((a: any, b: any) => {
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

  getSchedule() {
    this.scheduleService.getAll()
      .then(
        (response: Schedule[]) => {
          this.scheduleList = response;
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
