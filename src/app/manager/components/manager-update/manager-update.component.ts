import { Component, OnInit, EventEmitter } from '@angular/core';
import { Manager } from '../../models/manager';
import { UploadFile, UploadInput, ToastService, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { BsModalRef } from 'ngx-bootstrap';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { ManagerService } from '../../services/manager.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { PaginationResponse } from 'src/app/core/models/shared';

@Component({
  selector: 'app-manager-update',
  templateUrl: './manager-update.component.html',
  styleUrls: ['./manager-update.component.scss']
})
export class ManagerUpdateComponent implements OnInit {

  gender: number;
  manager: Manager;
  managerUM: Manager = new Manager();
  optionsSelect: { value: number; label: string; }[];
  optionsSex: { value: number; label: string; }[];
  refresh: EventEmitter<any> = new EventEmitter<any>();
  filesToUpload: FileList;
  managerList: PaginationResponse;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;


  constructor(
    public modalRef: BsModalRef,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private managerService: ManagerService,
    private globalService: GlobalService
    ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.getManager();
    this.optionsSex = [
      { value: 0, label: 'Nam'},
      { value: 1, label: 'Nữ'},
    ];
    if (this.manager.sex === true) {
      this.gender = 0;
    } else {
      this.gender = 1;
    }
    const year = this.manager.birthDate.split('-', 3)[0];
    const month = this.manager.birthDate.split('-', 3)[1];
    const day = this.manager.birthDate.split('-', 3)[2];
    this.manager.birthDate = `${day}-${month}-${year}`;
  }

  getManager() {
    this.managerService.getAll(1, 'asc', 1, 5)
      .then(
        (response: any) => {
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

  updateManager() {
    this.filesToUpload ? this.updateManagerWithImage() : this.updateManagerWithoutImage();
  }

  updateManagerWithImage() {
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
          this.managerUM.id = this.manager.id;
          this.managerUM.firstName = this.manager.firstName;
          this.managerUM.fullName = this.manager.fullName;
          this.managerUM.lastName = this.manager.lastName;
          this.managerUM.managerId = this.manager.managerId;
          this.managerUM.password = this.manager.password;
          this.managerUM.phoneMacAddress = this.manager.phoneMacAddress;
          this.managerUM.phoneNumber = this.manager.phoneNumber;
          this.managerUM.picture = response;
          this.managerUM.resetPasswordToken = this.manager.resetPasswordToken;
          this.managerUM.roleId = this.manager.roleId;
          this.managerUM.sex = this.manager.sex;
          (this.gender === 0) ? this.managerUM.sex = true : this.managerUM.sex = false;
          this.managerUM.address = this.manager.address;
          this.managerUM.birthDate = this.globalService.convertStringToYearMonthDay(this.manager.birthDate);
          this.managerUM.email = this.manager.email;
          this.managerService.update(this.managerUM)
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
        },
        (error) => {
          console.error(error);
        }
      );
  }

  updateManagerWithoutImage() {
    this.managerUM.id = this.manager.id;
    this.managerUM.firstName = this.manager.firstName;
    this.managerUM.fullName = this.manager.fullName;
    this.managerUM.lastName = this.manager.lastName;
    this.managerUM.managerId = this.manager.managerId;
    this.managerUM.password = this.manager.password;
    this.managerUM.phoneMacAddress = this.manager.phoneMacAddress;
    this.managerUM.phoneNumber = this.manager.phoneNumber;
    this.managerUM.picture = this.manager.picture;
    this.managerUM.resetPasswordToken = this.manager.resetPasswordToken;
    this.managerUM.roleId = this.manager.roleId;
    this.managerUM.sex = this.manager.sex;
    (this.gender === 0) ? this.managerUM.sex = true : this.managerUM.sex = false;
    this.managerUM.address = this.manager.address;
    this.managerUM.birthDate = this.globalService.convertStringToYearMonthDay(this.manager.birthDate);
    this.managerUM.email = this.manager.email;
    this.managerService.update(this.managerUM)
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

        this.manager.picture ? this.manager.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

}
