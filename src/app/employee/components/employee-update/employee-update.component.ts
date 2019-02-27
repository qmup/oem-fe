import { Component, OnInit, EventEmitter } from '@angular/core';
import { Employee, EmployeeUpdateModel } from '../../models/employee';
import { BsModalRef } from 'ngx-bootstrap';
import { EmployeeService } from '../../services/employee.service';
import { ToastService, humanizeBytes, UploadInput, UploadFile, UploadOutput } from 'ng-uikit-pro-standard';
import { ManagerService } from 'src/app/manager/services/manager.service';
import { Manager } from 'src/app/manager/models/manager';
import { GlobalService } from 'src/app/core/services/global.service';

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
  filesToUpload: FileList;
  managerList: any[];
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

  updateEmployee() {
    this.filesToUpload ? this.updateEmployeeWithImage() : this.updateEmployeeWithoutImage();
  }

  updateEmployeeWithImage() {
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
          this.employeeUM.id = this.employee.id;
          this.employeeUM.firstName = this.employee.firstName;
          this.employeeUM.fullName = this.employee.fullName;
          this.employeeUM.lastName = this.employee.lastName;
          this.employeeUM.password = this.employee.password;
          this.employeeUM.phoneMacAddress = this.employee.phoneMacAddress;
          this.employeeUM.phoneNumber = this.employee.phoneNumber;
          this.employeeUM.picture = response;
          this.employeeUM.resetPasswordToken = this.employee.resetPasswordToken;
          this.employeeUM.roleId = this.employee.roleId;
          this.employeeUM.sex = this.employee.sex;
          (this.gender === 0) ? this.employeeUM.sex = true : this.employeeUM.sex = false;
          this.employeeUM.address = this.employee.address;
          this.employeeUM.birthDate = this.globalService.convertStringToYearMonthDay(this.employee.birthDate);
          this.employeeUM.email = this.employee.email;
          console.log('with', this.employeeUM);
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
        },
        (error) => {
          console.error(error);
        }
      );
  }

  updateEmployeeWithoutImage() {
    this.employeeUM.id = this.employee.id;
    this.employeeUM.firstName = this.employee.firstName;
    this.employeeUM.fullName = this.employee.fullName;
    this.employeeUM.lastName = this.employee.lastName;
    this.employeeUM.password = this.employee.password;
    this.employeeUM.phoneMacAddress = this.employee.phoneMacAddress;
    this.employeeUM.phoneNumber = this.employee.phoneNumber;
    this.employeeUM.picture = this.employee.picture;
    this.employeeUM.resetPasswordToken = this.employee.resetPasswordToken;
    this.employeeUM.roleId = this.employee.roleId;
    this.employeeUM.sex = this.employee.sex;
    (this.gender === 0) ? this.employeeUM.sex = true : this.employeeUM.sex = false;
    this.employeeUM.address = this.employee.address;
    this.employeeUM.birthDate = this.globalService.convertStringToYearMonthDay(this.employee.birthDate);
    this.employeeUM.email = this.employee.email;
    console.log('without', this.employeeUM);
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

  changeFile(event: any) {
    this.filesToUpload = event.target.files;
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

        this.employee.picture ? this.employee.picture = event1.target.result : this.url = event1.target.result;

      };
    }
  }

}
