import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, ModalDirective, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { Manager } from '../../models/manager';
import { ManagerService } from '../../services/manager.service';
import { ManagerUpdateComponent } from '../manager-update/manager-update.component';
import { IMyOptions } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  id: number;
  searchText: string;
  managerList: Manager[];
  optionsSelect = new Array<any>();
  optionsSex = new Array<any>();
  gender: number;
  modalRef: BsModalRef;
  managerCM: Manager = new Manager();
  datePickerOptions: IMyOptions;
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;

  constructor(
    private managerService: ManagerService,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.optionsSex = [
      { value: 1, label: 'Nam' },
      { value: 2, label: 'Nữ' },
    ],
    this.datePickerOptions = {
      dateFormat: 'dd-mm-yyyy',
      disableSince: {
        year: (new Date().getFullYear()),
        month: (new Date().getMonth() + 1),
        day: new Date().getDate()
      },
      startDate: '10-10-1980'
    };
    this.getManager();
  }

  getManager() {
    this.managerService.getAll()
      .then(
        (response: Manager[]) => {
          this.managerList = response;
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

  openUpdateModal(manager: Manager) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-lg modal-notify modal-primary',
      initialState: { manager }
    };
    this.modalRef = this.modalService.show(ManagerUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getManager());

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
      return this.managerList;
    }
    if (this.searchText) {
      return this.filterIt(this.managerList, this.searchText);
    }
  }

  createManager() {
    if (this.gender === 0) {
      this.managerCM.sex = true;
    } else {
      this.managerCM.sex = false;
    }
    this.managerCM.roleId = 1;
    const birthdate = new Date(this.managerCM.birthDate);
    const date = ('0' + birthdate.getDate()).slice(-2);
    const month = ('0' + birthdate.getMonth() + 1).slice(-2);
    const year = birthdate.getFullYear();
    this.managerCM.birthDate = `${year}-${month}-${date}`;
    console.log(this.managerCM);
    this.managerService.create(this.managerCM)
      .then(
        () => {
          this.createModal.hide();
          this.managerList = [];
          this.getManager();
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  removeManager() {
    this.managerService.remove(this.id)
      .then(
        () => {
          this.deleteModal.hide();
          this.managerList = [];
          this.getManager();
        }
      );
  }
}
