import { Component, OnInit } from '@angular/core';
import { Employee, EmployeeUpdateModel } from '../../models/employee';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-employee-update',
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.scss']
})
export class EmployeeUpdateComponent implements OnInit {

  gender: number;
  employee: any;
  employeeUM: EmployeeUpdateModel = new EmployeeUpdateModel();
  optionsSelect: { value: number; label: string; }[];
  optionsSex: { value: number; label: string; }[];

  constructor(public modalRef: BsModalRef) { }

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
  }

}
