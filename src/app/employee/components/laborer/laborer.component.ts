import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee, EmployeeCreateModel } from '../../models/employee';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
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
    private toastService: ToastService
  ) {}

  ngOnInit() {
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
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-lg modal-notify modal-primary',
      initialState: { employee }
    };
    this.modalRef = this.modalService.show(EmployeeUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getEmployee());

  }

  filterIt(arr: any, searchKey: any) {
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
    const birthdate = new Date(this.employeeCM.birthDate);
    const date = ('0' + birthdate.getDate()).slice(-2);
    const month = ('0' + birthdate.getMonth() + 1).slice(-2);
    const year = birthdate.getFullYear();
    this.employeeCM.birthDate = `${year}-${month}-${date}`;
    this.employeeService.create(this.employeeCM)
      .then(
        () => {
          this.toastService.success('Tạo nhân viên thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.employeeList = [];
          this.getEmployee();
        },
        (error: any) => {
          console.log(error);
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  removeEmployee() {
    this.employeeService.remove(this.id)
      .then(
        () => {
          this.toastService.success('Xóa nhân viên thành công', '', { positionClass: 'toast-bottom-right'} );
          this.deleteModal.hide();
          this.employeeList = [];
          this.getEmployee();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }
}
