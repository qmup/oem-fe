import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploadInput, UploadOutput, UploadFile, humanizeBytes, ToastService } from 'ng-uikit-pro-standard';
import { GlobalService } from 'src/app/core/services/global.service';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { Employee } from 'src/app/employee/models/employee';
import { BsModalRef } from 'ngx-bootstrap';
import { AuthService } from '../../services/auth.service';
import { AuthGuardService } from 'src/app/core/services/auth-guard.service';

@Component({
  selector: 'app-profile-update-avatar',
  templateUrl: './profile-update-avatar.component.html',
  styleUrls: ['./profile-update-avatar.component.scss']
})
export class ProfileUpdateAvatarComponent implements OnInit {

  avatar: string;
  refresh: EventEmitter<any> = new EventEmitter<any>();
  filesToUpload: FileList;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  userAccount: Employee;

  constructor(
    public modalRef: BsModalRef,
    private globalService: GlobalService,
    private employeeService: EmployeeService,
    private authGuardService: AuthGuardService,
    private authService: AuthService,
    private toastService: ToastService,
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
  }

  updateAvatar() {
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
          this.employeeService.updateField(this.userAccount.id, 'picture', response)
            .then(
              () => {
                this.authService.getInformation(this.userAccount.email)
                  .then(
                    (response2: Employee) => {
                      this.globalService.userAccount = response2;
                      this.globalService.avatar = response2.picture;
                      this.authGuardService.setUserAccount(this.globalService.userAccount);
                      this.toastService.success('Cập nhật ảnh đại diện thành công', 'Thành công', { positionClass: 'toast-bottom-right' });
                      this.modalRef.hide();
                      this.refresh.emit();
                    }
                  );
              }
            );
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

        this.avatar ? this.avatar = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

}
