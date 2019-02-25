import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
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

  constructor(
    public modalRef: BsModalRef,
    private employeeService: EmployeeService,
    private workplaceService: PlaceService,
    private scheduleService: ScheduleService,
    private toastService: ToastService,

  ) { }

  ngOnInit() {
    this.getEmployee();
    this.getWorkplace();
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

}
