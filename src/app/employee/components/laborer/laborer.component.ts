import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeCreateModel } from '../../models/employee';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { EmployeeUpdateComponent } from '../employee-update/employee-update.component';

@Component({
  selector: 'app-laborer',
  templateUrl: './laborer.component.html',
  styleUrls: ['./laborer.component.scss']
})
export class LaborerComponent implements OnInit {

  id: number;
  searchText: string;
  employeeList: Employee[];
  optionsSelect = new Array<any>();
  optionsSex = new Array<any>();
  gender: number;
  modalRef: BsModalRef;
  employeeCM: EmployeeCreateModel = new EmployeeCreateModel();
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;

  constructor(
    private employeeService: EmployeeService,
    private modalService: BsModalService,
  ) {}

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
    this.getEmployee();
  }

  getEmployee() {
    this.employeeService.getAll()
      .then(
        (response: Employee[]) => {
          this.employeeList = response;
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

  openUpdateModal(employee: Employee) {
    this.modalRef = this.modalService.show(EmployeeUpdateComponent, { initialState: { employee } });
  }

  filterIt(arr: any, searchKey: any) {
    console.log(arr, searchKey);
    return arr.filter((obj: any) => {
      return Object.keys(obj).some((key) => {
        if (obj[key] !== null) {
          const tempKey = obj[key].toString().toLowerCase();
          const tempSearch = searchKey.toLowerCase();
          return tempKey.includes(tempSearch);
        }
      });
    });
  }

  search() {
    if (!this.searchText) {
      return this.employeeList;
    }
    if (this.searchText) {
      return this.filterIt(this.employeeList, this.searchText);
    }
  }

  createEmployee() {
    if (this.gender === 0) {
      this.employeeCM.sex = true;
    } else {
      this.employeeCM.sex = false;
    }
    this.employeeCM.roleId = 1;
    this.employeeService.create(this.employeeCM)
      .then(
        (response: number) => {
          console.log(response);
          this.createModal.hide();
          this.employeeList = [];
          this.getEmployee();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  removeEmployee() {
    this.employeeService.remove(this.id)
      .then(
        () => {
          this.deleteModal.hide();
          this.employeeList = [];
          this.getEmployee();
        }
      );
  }
}
