import { Component, OnInit, EventEmitter } from '@angular/core';
import { Employee, EmployeeUpdateModel } from '../../models/employee';
import { BsModalRef } from 'ngx-bootstrap';
import { EmployeeService } from '../../services/employee.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { ManagerService } from 'src/app/manager/services/manager.service';
import { Manager } from 'src/app/manager/models/manager';

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.scss']
})
export class EmployeeUpdateComponent implements OnInit {

  gender: number;
  employee: Employee;
  employeeUM: EmployeeUpdateModel = new EmployeeUpdateModel();
  optionsSelect: { value: number; label: string; }[];
  optionsSex: { value: number; label: string; }[];
  refresh: EventEmitter<any> = new EventEmitter<any>();
  managerList: any[];

  constructor(
    public modalRef: BsModalRef,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private managerService: ManagerService
  ) { }

  ngOnInit() {
    this.getManager();
    this.optionsSex = [
      { value: 0, label: 'Nam'},
      { value: 1, label: 'Nữ'},
    ];
    if (this.employee.sex === true) {
      this.gender = 0;
    } else {
      this.gender = 1;
    }
    console.log(this.employee.birthDate);
    const year = this.employee.birthDate.split('-', 3)[0];
    const month = this.employee.birthDate.split('-', 3)[1];
    const day = this.employee.birthDate.split('-', 3)[2];
    this.employee.birthDate = `${day}-${month}-${year}`;
  }

  getManager() {
    this.managerService.getAll()
      .then(
        (response: Manager[]) => {
          this.managerList = response;
          this.optionsSelect = response.map((manager) => {
            return {
              value: manager.id,
              label: manager.fullName
            };
          });
        }
      );
  }

  updateEmployee() {
    this.employeeUM.id = this.employee.id;
    this.employeeUM.firstName = this.employee.firstName;
    this.employeeUM.fullName = this.employee.fullName;
    this.employeeUM.lastName = this.employee.lastName;
    this.employeeUM.managerId = this.employee.managerId;
    this.employeeUM.password = this.employee.password;
    this.employeeUM.phoneMacAddress = this.employee.phoneMacAddress;
    this.employeeUM.phoneNumber = this.employee.phoneNumber;
    this.employeeUM.picture = this.employee.picture;
    this.employeeUM.resetPasswordToken = this.employee.resetPasswordToken;
    this.employeeUM.roleId = this.employee.roleId;
    this.employeeUM.sex = this.employee.sex;
    this.employeeUM.address = this.employee.address;
    this.employeeUM.birthDate = this.employee.birthDate;
    this.employeeUM.email = this.employee.email;
    this.employeeService.update(this.employeeUM)
      .then(
        () => {
          this.toastService.success('Cập nhật thông tin thành công', '', { positionClass: 'toast-bottom-right'} );
          this.modalRef.hide();
          this.refresh.emit();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

}
