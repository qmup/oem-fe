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
  taskBasicResponse: PaginationResponse;
  files: UploadFile[] = [];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;
  modalRef: BsModalRef;
  currentPage = 0;
  taskBasicManager: TaskBasicManager = new TaskBasicManager();
  userAccount: Employee;
  taskBasicManagerResponse: PaginationResponse;
  taskBasicManagerList: Task[];

  constructor(
    private renderer: Renderer2,
    private taskBasicService: TaskBasicService,
    private toastService: ToastService,
    private globalService: GlobalService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.userAccount.roleId === 1 ? this.getTaskBasic() : this.getTaskBasicByManager();
  }

  getTaskBasic() {
    this.taskBasicService.getListTaskBasic(1 , '', '', 'id', this.currentPage, 8)
      .then(
        (response: any) => {
          this.taskBasicResponse = response;
          this.taskBasicList = response.content;
        }
      );
  }

  getTaskBasicByManager() {
    this.taskBasicService.getListTaskBasic(this.userAccount.id, '', '', 'id', this.currentPage, 8)
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
    taskBasicManager.editable = true;
    taskBasicManager.taskBasicId = task.id;
    this.taskBasicService.setToManager(taskBasicManager)
      .then(
        () => {
          this.toastService.success('Thêm thành công', '', { positionClass: 'toast-bottom-right'} );
          this.taskBasicManagerList = [];
          this.getTaskBasicByManager();
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  coverage() {
    if (typeof this.range === 'string' && this.range.length !== 0) {

      return this.range;
    }
    const maxValue = this.input.nativeElement.getAttribute('max');
    const cloudRange = (this.range / maxValue) * 100;
    this.renderer.setStyle(this.rangeCloud.nativeElement, 'left', cloudRange + '%');
  }
  openCreateModal() {
    this.createModal.show();
  }
  openDeleteModal(id: number) {
    this.id = id;
    this.deleteModal.show();
  }
  openUpdateModal(taskBasic: Task) {
    console.log(taskBasic);
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
                      this.taskBasicList = [];
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
          this.taskBasicManager.employeeId = 1;
          this.taskBasicManager.editable = true;
          this.taskBasicManager.taskBasicId = response1;
          this.taskBasicService.setToManager(this.taskBasicManager)
            .then(
              () => {
                this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                this.createModal.hide();
                this.taskBasicList = [],
                this.getTaskBasic();
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
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

  changePage(event) {
    this.currentPage = event - 1;
    this.getTaskBasic();
  }
}
