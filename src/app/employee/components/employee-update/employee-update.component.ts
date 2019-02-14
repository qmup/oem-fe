import { Component, OnInit, EventEmitter } from '@angular/core';
import { Employee, EmployeeUpdateModel } from '../../models/employee';
import { BsModalRef } from 'ngx-bootstrap';
import { EmployeeService } from '../../services/employee.service';

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

  constructor(
    public modalRef: BsModalRef,
    private employeeService: EmployeeService
  ) { }

  ngOnInit() {
    this.optionsSelect = [
      { value: 1, label: 'Cung 1' },
      { value: 2, label: 'Cung 2' },
      { value: 3, label: 'Cung 3' },
    ];
    this.optionsSex = [
      { value: 0, label: 'Nam'},
      { value: 1, label: 'Nữ'},
    ];
    console.log(this.employee);
  }

  updateEmployee() {
    this.employeeService.update(this.employeeUM)
      .then(
        () => {
          this.modalRef.hide();
          this.refresh.emit();
        },
      );
  }

}
