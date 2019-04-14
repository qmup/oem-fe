import { Component, OnInit, ViewChild, ElementRef, Renderer2, EventEmitter } from '@angular/core';
import { TaskBasicManager } from '../../models/task-basic';
import { ModalDirective, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TaskBasicService } from '../../service/task-basic.service';
import { ToastService, UploadFile, UploadInput, UploadOutput } from 'ng-uikit-pro-standard';
import { GlobalService } from 'src/app/core/services/global.service';
import { Task } from '../../models/task';
import { PaginationResponse } from 'src/app/core/models/shared';
import { BasicTaskUpdateComponent } from '../basic-task-update/basic-task-update.component';
import { Employee } from 'src/app/employee/models/employee';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-basic-task',
  templateUrl: './basic-task.component.html',
  styleUrls: ['./basic-task.component.scss']
})
export class BasicTaskComponent implements OnInit {

  id: number;
  range: any = 15;
  sorted = false;
  taskBasicCM: Task = new Task();
  taskBasicList: Task[];
  @ViewChild('input') input: ElementRef;
  @ViewChild('rangeCloud') rangeCloud: ElementRef;
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  @ViewChild('warning') warningModal: ModalDirective;
  taskBasicResponse: PaginationResponse;
  files: UploadFile[] = [];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;
  modalRef: BsModalRef;
  currentPage1 = 0;
  currentPage2 = 0;
  userAccount: Employee;
  taskBasicManager: TaskBasicManager = new TaskBasicManager();
  taskBasicManagerResponse: PaginationResponse;
  taskBasicManagerList: Task[];
  deletingId = 0;
  warningMessage: string[] = [];
  defaultImage = '../../../../assets/default-image.jpg';
  adminSearchText = '';
  mngSearchText = '';
  timeoutSearch: any;
  myTask: boolean;

  constructor(
    private taskBasicService: TaskBasicService,
    private toastService: ToastService,
    private globalService: GlobalService,
    private taskService: TaskService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.getTaskBasic();
  }

  getTaskBasic() {
    this.userAccount.roleId === 1 ? this.getTaskBasicByAdmin() : (this.getTaskBasicByAdmin(), this.getTaskBasicByManager());
  }

  getTaskBasicByAdmin() {
    this.taskBasicService.getListTaskBasic(1, this.adminSearchText, '', 'id', this.currentPage1, 8, true)
      .then(
        (response: any) => {
          this.taskBasicResponse = response;
          this.taskBasicList = response.content;
          if (this.userAccount.roleId === 1) {
            this.taskBasicList.forEach(element => {
              element.editable = true;
            });
          } else {
            this.taskBasicList.forEach(element => {
              element.editable = false;
            });
          }
        }
      );
  }

  getTaskBasicByManager() {
    this.taskBasicService.getListTaskBasic(this.userAccount.id, this.mngSearchText, '', 'id', this.currentPage2, 8)
      .then(
        (response: any) => {
          this.taskBasicManagerResponse = response;
          this.taskBasicManagerList = response.content;
        }
      );
  }

  selectTask(task: Task) {
    const taskBasicManager: TaskBasicManager = new TaskBasicManager();
    taskBasicManager.employeeId = this.userAccount.id;
    taskBasicManager.editable = false;
    taskBasicManager.taskBasicId = task.id;
    this.taskBasicService.setToManager(taskBasicManager)
      .then(
        (response) => {
          if (+response === 0) {
            this.toastService.error('Công việc đã tồn tại' , '', { positionClass: 'toast-bottom-right'});
          } else {
            this.toastService.success('Thêm thành công', '', { positionClass: 'toast-bottom-right'} );
            this.taskBasicManagerList = [];
            this.getTaskBasicByManager();
          }
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  searchAdmin() {
    if (this.timeoutSearch) {
      clearTimeout(this.timeoutSearch);
    }
    this.timeoutSearch = setTimeout(() => {
      this.getTaskBasicByAdmin();
    }, 500);
  }

  searchMng() {
    if (this.timeoutSearch) {
      clearTimeout(this.timeoutSearch);
    }
    this.timeoutSearch = setTimeout(() => {
      this.getTaskBasicByManager();
    }, 500);
  }

  openCreateModal() {
    this.createModal.show();
  }
  openUpdateModal(taskBasic: Task) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { taskBasic }
    };
    this.modalRef = this.modalService.show(BasicTaskUpdateComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getTaskBasic());

  }
  createTaskBasic() {
    this.filesToUpload ? this.createTaskBasicWithImage() : this.createTaskBasicWithoutImage();
  }
  createTaskBasicWithImage() {
    const formData: FormData = new FormData();
    if (!!this.filesToUpload) {
      for (let index = 0; index < this.filesToUpload.length; index++) {
        const file: File = this.filesToUpload[index];
        formData.append('dataFile', file);
      }
    }
    this.globalService.uploadFile(formData, 'image/task/')
      .then(
        (response) => {
          this.taskBasicCM.picture = response;
          this.taskBasicCM.basic = true;
          this.taskBasicService.create(this.taskBasicCM)
            .then(
              (response1) => {
                this.taskBasicManager.employeeId = this.userAccount.id;
                this.taskBasicManager.editable = true;
                this.taskBasicManager.taskBasicId = response1;
                this.taskBasicService.setToManager(this.taskBasicManager)
                  .then(
                    () => {
                      this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                      this.createModal.hide();
                      if (this.userAccount.roleId === 1 ) {
                        this.taskBasicList = [];
                      } else {
                        this.taskBasicManagerList = [];
                      }
                      this.getTaskBasic();
                    },
                    () => {
                      this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
                    }
                );
              },
            );
        }
      );
  }
  createTaskBasicWithoutImage() {
    this.taskBasicCM.basic = true;
    this.taskBasicService.create(this.taskBasicCM)
      .then(
        (response1) => {
          this.taskBasicManager.employeeId = this.userAccount.id;
          this.taskBasicManager.editable = true;
          this.taskBasicManager.taskBasicId = response1;
          this.taskBasicService.setToManager(this.taskBasicManager)
            .then(
              () => {
                this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                this.createModal.hide();
                if (this.userAccount.roleId === 1 ) {
                  this.taskBasicList = [];
                } else {
                  this.taskBasicManagerList = [];
                }
                this.getTaskBasic();
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        }
      );
  }

  removeTaskBasicAdmin() {
    this.taskService.remove(this.deletingId)
      .then(
        () => {
          this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'} );
          this.deleteModal.hide();
          if (this.userAccount.roleId === 1 ) {
            this.taskBasicList = [];
            this.getTaskBasic();
          } else {
            this.taskBasicManagerList = [];
            this.getTaskBasic();
          }
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra', '', { positionClass: 'toast-bottom-right'} );
        }
      );
  }

  removeTaskBasic() {
    if (this.myTask) {
      this.removeTaskBasicAdmin();
    } else {
      this.taskBasicService.remove(this.deletingId, this.userAccount.id)
        .then(
          () => {
            this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'} );
            this.deleteModal.hide();
            if (this.userAccount.roleId === 1 ) {
              this.taskBasicList = [];
              this.getTaskBasic();
            } else {
              this.taskBasicManagerList = [];
              this.getTaskBasic();
            }
          },
          () => {
            this.toastService.error('Đã có lỗi xảy ra', '', { positionClass: 'toast-bottom-right'} );
          }
        );
    }
  }

  checkRemovable(id: number, editable: boolean) {
    this.deletingId = id;
    this.myTask = false;
    if (editable) {
      this.myTask = editable;
    }
    this.warningMessage = [];
    this.taskService.checkRemoveTaskBasic(id, this.userAccount.id)
      .then(
        (response) => {
          response.removeAble ?
          this.deleteModal.show() :
          (this.warningMessage = response.message.split(';'), this.warningModal.show());
        }
      );
  }

  sortBy(by: string | any): void {

    this.taskBasicList.sort((a: any, b: any) => {
      if (a[by] < b[by]) {
        return this.sorted ? 1 : -1;
      }
      if (a[by] > b[by]) {
        return this.sorted ? -1 : 1;
      }
      return 0;
    });

    this.sorted = !this.sorted;
  }

  showFiles() {
    let files = '';
    for (let i = 0; i < this.files.length; i ++) {
      files = this.files[0].name;
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

        this.taskBasicCM.picture ? this.taskBasicCM.picture = event1.target.result : this.url = event1.target.result;

      };

      this.filesToUpload = event.target.files;

    }
  }

  changePage1(event) {
    this.currentPage1 = event - 1;
    this.getTaskBasicByAdmin();
  }

  changePage2(event) {
    this.currentPage2 = event - 1;
    this.getTaskBasicByManager();
  }
}
