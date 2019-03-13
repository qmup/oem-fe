import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { ModalDirective, ToastService, UploadInput, UploadFile, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { EmployeeUpdateComponent } from '../employee-update/employee-update.component';
import { Manager } from 'src/app/manager/models/manager';
import { ManagerService } from 'src/app/manager/services/manager.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { PaginationResponse } from 'src/app/core/models/shared';

@Component({
  selector: 'app-laborer',
  templateUrl: './laborer.component.html',
  styleUrls: ['./laborer.component.scss']
})
export class LaborerComponent implements OnInit {

  id: number;
  searchText: string;
  employeeList: Employee[];
  employeeResponse: PaginationResponse;
  managerList = new Array<any>();
  optionsSex = new Array<any>();
  gender: number;
  modalRef: BsModalRef;
  employeeCM: Employee = new Employee();
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;


  constructor(
    private employeeService: EmployeeService,
    private modalService: BsModalService,
    private managerService: ManagerService,
    private toastService: ToastService,
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
    this.getEmployeeByAdmin();
  }

  // getEmployee() {
  //   this.employeeService.getAll()
  //     .then(
  //       (response: Employee[]) => {
  //         this.employeeList = response;
  //       }
  //     );
  // }

  getEmployeeByAdmin() {
    this.employeeService.getByRole(3, '', '', 'id', 0, 10)
      .then(
        (response: PaginationResponse) => {
          this.employeeResponse = response;
          this.employeeList = response.content;
        }
      );
  }

  getManager() {
    this.employeeService.getByRole(1, '', '', 'id', 0, 10)
      .then(
        (response: PaginationResponse) => {
          this.managerList = response.content.map((manager) => {
            return {
              value: manager.id,
              label: manager.fullName,
              icon: manager.picture
            };
          });
        }
      );
  }

  // getEmployeeByManager() {
  //   this.employeeService.getEmployeeByManager(2, 'asc', 1, 5)
  //     .then(
  //       (response: PaginationResponse) => {
  //         console.log(response);
  //         this.employeeList = response.content;
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

  openUpdateModal(employee: Employee) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-lg modal-notify modal-primary',
      initialState: { employee }
    };
    this.modalRef = this.modalService.show(EmployeeUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getEmployeeByAdmin());

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
    this.employeeCM.fullName = `${this.employeeCM.firstName} ${this.employeeCM.lastName}`;
    this.filesToUpload ? this.createEmployeeWithImage() : this.createEmployeeWithoutImage();
  }

  createEmployeeWithImage() {
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
          (this.gender === 0) ? this.employeeCM.sex = false : this.employeeCM.sex = true;
          this.employeeCM.roleId = 3;
          this.employeeCM.birthDate = this.globalService.convertToYearMonthDay(new Date(this.employeeCM.birthDate));
          this.employeeCM.picture = response;
          this.employeeService.create(this.employeeCM)
            .then(
              () => {
                this.toastService.success('Tạo nhân viên thành công', '', { positionClass: 'toast-bottom-right'} );
                this.createModal.hide();
                this.employeeList = [];
                this.getEmployeeByAdmin();
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

  createEmployeeWithoutImage() {
    (this.gender === 0) ? this.employeeCM.sex = false : this.employeeCM.sex = true;
    this.employeeCM.roleId = 3;
    this.employeeCM.birthDate = this.globalService.convertToYearMonthDay(new Date(this.employeeCM.birthDate));
    this.employeeService.create(this.employeeCM)
      .then(
        () => {
          this.toastService.success('Tạo nhân viên thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.employeeList = [];
          this.getEmployeeByAdmin();
        },
        (error: any) => {
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
          this.getEmployeeByAdmin();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
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

        this.employeeCM.picture ? this.employeeCM.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }
}
