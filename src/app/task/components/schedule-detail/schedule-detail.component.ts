import { Component, OnInit, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { ScheduleService } from '../../service/schedule.service';
import { ScheduleModel, Schedule } from '../../models/schedule';
import { ToastService } from 'ng-uikit-pro-standard';
import { Employee } from 'src/app/employee/models/employee';
import { Place } from 'src/app/place/models/place';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.scss']
})
export class ScheduleDetailComponent implements OnInit {

  isUpdate = false;
  iconPrioritySelect: any[];
  week: any[];
  workplaceList: any[];
  employeeList: any[];
  timeFrom: any;
  timeTo: any;
  schedule: Schedule;
  refresh: EventEmitter<any> = new EventEmitter<any>();
  modalRef: BsModalRef | null;
  modalRef2: BsModalRef;
  showModal = true;
  @ViewChild('edit') public editModal: TemplateRef<any>;

  constructor(
    private employeeService: EmployeeService,
    private workplaceService: PlaceService,
    private modalService: BsModalService,
    private scheduleService: ScheduleService,
    private toastService: ToastService,

  ) { }

  ngOnInit() {
    this.getEmployee();
    this.getWorkplace();
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

  getWorkplace() {
    this.workplaceService.getAll()
      .then(
        (response: Place[]) => {
          this.workplaceList = response.map((workplace) => {
            return {
              value: workplace.id,
              label: workplace.name
            };
          });
        }
      );
  }

  updateSchedule() {
    // const options = { positionClass: 'toast-bottom-right' };
    // this.scheduleService.update(this.schedule)
    //   .then(
    //     () => {
    //       this.toastService.success('Cập nhật công việc thành công', '', options );
    //       this.modalRef.hide();
    //       this.refresh.emit();
    //     },
    //     () => {
    //       this.toastService.error('Đã có lỗi xảy ra' , '', options );

    //     }
    //   );
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

  openModal1(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md modal-dialog modal-notify modal-primary' });
  }

  openModal2(template: TemplateRef<any>) {
    this.modalRef2 = this.modalService.show(template, { class: 'modal-sm modal-dialog modal-notify modal-danger' });
  }

  closeModal1() {
    if (!this.modalRef) {
      return;
    }
    this.modalRef.hide();
    this.modalRef = null;

  }

  closeModal2() {
    if (!this.modalRef2) {
      return;
    }
    this.modalRef2.hide();
    this.modalRef2 = null;
  }
}
