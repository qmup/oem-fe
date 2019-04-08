import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { BsModalRef, ModalDirective, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { Manager } from '../../models/manager';
import { ManagerService } from '../../services/manager.service';
import { ManagerUpdateComponent } from '../manager-update/manager-update.component';
import { IMyOptions, UploadFile, UploadInput, humanizeBytes, UploadOutput, ToastService } from 'ng-uikit-pro-standard';
import { GlobalService } from 'src/app/core/services/global.service';
import { PaginationResponse } from 'src/app/core/models/shared';
import { EmployeeService } from 'src/app/employee/services/employee.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit {

  id: number;
  searchText: string;
  managerList: Manager[];
  managerResponse: PaginationResponse;
  optionsSelect = new Array<any>();
  optionsSex = new Array<any>();
  gender: number;
  defaultImage = '../../../../assets/default-image.jpg';
  modalRef: BsModalRef;
  managerCM: Manager = new Manager();
  datePickerOptions: IMyOptions;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;
  isExist = false;

  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;

  constructor(
    private managerService: ManagerService,
    private modalService: BsModalService,
    private toastService: ToastService,
    private employeeService: EmployeeService,
    private globalService: GlobalService
    ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.optionsSex = [
      { value: 1, label: 'Nam' },
      { value: 2, label: 'Nữ' },
    ],
    this.getManager();
  }

  checkEmailExist() {
    this.employeeService.checkExist(this.managerCM.email)
      .then(
        (response) => {
          this.isExist = response;
        }
      );
  }

  getManager() {
    this.employeeService.getByRole(1, '', '', 'id', 0, 10)
      .then(
        (response: PaginationResponse) => {
          this.managerResponse = response;
          this.managerList = response.content;
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
    this.filesToUpload ? this.createManagerWithImage() : this.createManagerWithoutImage();
  }

  createManagerWithImage() {
    const formData: FormData = new FormData();
    if (!!this.filesToUpload) {
      for (let index = 0; index < this.filesToUpload.length; index++) {
        const file: File = this.filesToUpload[index];
        formData.append('dataFile', file);
      }
    }
    this.globalService.uploadFile(formData, 'image/employee/')
      .then(
        (response) => {
          (this.gender === 0) ? this.managerCM.sex = false : this.managerCM.sex = true;
          this.managerCM.roleId = 1;
          this.managerCM.birthDate = this.globalService.convertToYearMonthDay(new Date(this.managerCM.birthDate));
          this.managerCM.picture = response;
          this.managerService.create(this.managerCM)
            .then(
              () => {
                this.toastService.success('Tạo manager thành công', '', { positionClass: 'toast-bottom-right'} );
                this.createModal.hide();
                this.managerList = new Array<Manager>();
                this.managerResponse = new PaginationResponse();
                this.getManager();
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        },
        (error) => {
          console.error(error);
        }
      );
  }

  createManagerWithoutImage() {
    (this.gender === 0) ? this.managerCM.sex = false : this.managerCM.sex = true;
    this.managerCM.roleId = 1;
    this.managerCM.birthDate = this.globalService.convertToYearMonthDay(new Date(this.managerCM.birthDate));
    this.managerService.create(this.managerCM)
      .then(
        () => {
          this.toastService.success('Tạo manager thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.managerList = new Array<Manager>();
          this.managerResponse = new PaginationResponse();
          this.getManager();
        },
        (error: any) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  removeManager() {
    this.managerService.remove(this.id)
      .then(
        () => {
          this.toastService.success('Xóa manager thành công', '', { positionClass: 'toast-bottom-right'} );
          this.deleteModal.hide();
          this.managerList = new Array<Manager>();
          this.managerResponse = new PaginationResponse();
          this.getManager();
        },
        () => {
          this.toastService.success('Đã có lỗi xảy ra', '', { positionClass: 'toast-bottom-right'} );
        }

      );
  }

  showFiles() {
    let files = '';
    for (let i = 0; i < this.files.length; i ++) {
      files += this.files[i].name;
       if (!(this.files.length - 1 === i)) {
         files += ',';
      }
    }
    return files;
 }

  startUpload(): void {
    const event: UploadInput = {
    type: 'uploadAll',
    url: 'your-path-to-backend-endpoint',
    method: 'POST',
    data: { foo: 'bar' },
    };
    this.files = [];
    this.uploadInput.emit(event);
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  onUploadOutput(output: UploadOutput | any): void {

    if (output.type === 'allAddedToQueue') {
    } else if (output.type === 'addedToQueue') {
      this.files.push(output.file); // add file to array when added
    } else if (output.type === 'uploading') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => file.id === output.file.id);
      this.files[index] = output.file;
    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
    } else if (output.type === 'dragOut') {
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
    this.showFiles();
  }

  onSelectFile(event: any) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event1: any) => { // called once readAsDataURL is completed

        this.url = event1.target.result;

        this.managerCM.picture ? this.managerCM.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }
}
