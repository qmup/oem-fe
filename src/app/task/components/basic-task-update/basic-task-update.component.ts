import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploadFile, UploadInput, ToastService, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { BsModalRef } from 'ngx-bootstrap';
import { GlobalService } from 'src/app/core/services/global.service';
import { Task, TaskModel } from '../../models/task';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-basic-task-update',
  templateUrl: './basic-task-update.component.html',
  styleUrls: ['./basic-task-update.component.scss']
})
export class BasicTaskUpdateComponent implements OnInit {

  taskBasic: Task;
  taskBasicUM: TaskModel = new TaskModel();
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  refresh: EventEmitter<any> = new EventEmitter<any>();
  filesToUpload: FileList;
  url: any;

  constructor(
    public modalRef: BsModalRef,
    private toastService: ToastService,
    private globalService: GlobalService,
    private taskService: TaskService
    ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
    }

  ngOnInit() {
  }

  updateTaskBasic() {
    this.filesToUpload ? this.updateTaskWithImage() : this.updateTaskWithoutImage();
  }

  updateTaskWithImage() {
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
          this.taskBasicUM.id = this.taskBasic.id;
          this.taskBasicUM.title = this.taskBasic.title;
          this.taskBasicUM.basic = true;
          this.taskBasicUM.picture = response;
          // this.taskService.update(this.taskBasicUM)
          //   .then(
          //     () => {
          //       this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          //       this.modalRef.hide();
          //       this.refresh.emit();
          //     },
          //     () => {
          //       this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          //     }
          //   );
        },
        (error) => {
          console.error(error);
        }
      );
  }

  updateTaskWithoutImage() {
    this.taskBasicUM.id = this.taskBasic.id;
    this.taskBasicUM.picture = this.taskBasicUM.picture;
    this.taskBasicUM.title = this.taskBasic.title;
    this.taskBasicUM.basic = true;
    // this.taskService.update(this.taskBasicUM)
    //   .then(
    //     () => {
    //       this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'} );
    //       this.modalRef.hide();
    //       this.refresh.emit();
    //     },
    //     () => {
    //       this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
    //     }
    //   );
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

        this.taskBasic.picture ? this.taskBasic.picture = event1.target.result : this.url = event1.target.result;
      };

      this.filesToUpload = event.target.files;

    }
  }

}
