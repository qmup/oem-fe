import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploadFile, UploadInput, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { Manager } from '../../models/manager';
import { TaskService } from 'src/app/task/service/task.service';
import { Task } from 'src/app/task/models/task';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/employee/services/employee.service';

@Component({
  selector: 'app-manager-detail',
  templateUrl: './manager-detail.component.html',
  styleUrls: ['./manager-detail.component.scss']
})
export class ManagerDetailComponent implements OnInit {

  manager: Manager = new Manager();
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  url: any;
  filesToUpload: FileList;
  isShowMore1 = false;
  isShowMore2 = false;
  id: number;
  sub: any;
  taskList: Task[];

  constructor(
    private taskService: TaskService,
    private employeeService: EmployeeService,
    private route: ActivatedRoute
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getInfo();
      this.getEmployeeTask();
    });
  }

  getInfo() {
    this.employeeService.getById(this.id)
      .then(
        (response: Manager) => {
          this.manager = response;
        }
      );
  }

  getEmployeeTask() {
    this.taskService.getTodayTask(1)
      .then(
        (response) => {
          this.taskList = response;
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
