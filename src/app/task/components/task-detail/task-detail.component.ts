import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploadFile, UploadInput, humanizeBytes, UploadOutput, IMyOptions } from 'ng-uikit-pro-standard';
import { TaskService } from '../../service/task.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { TaskDetail } from '../../models/task';
import { ReportService } from 'src/app/report/services/report.service';
import { TaskReport } from 'src/app/report/models/report';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  iconPrioritySelect: Array<any>;
  iconStatusSelect: Array<any>;
  manager = 'Nguyễn Sinh Cung';
  employee = 'Nguyễn Hoàng Vũ';
  timeFrom: any;
  timeTo: any;
  dateFrom: any;
  dateTo: any;
  lightClock: any;
  darkClock: any;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  selectedPriority = '3';
  selectedStatus = '1';
  isUpdate = false;
  id: number;
  sub: any;
  task: TaskDetail = new TaskDetail();
  report: TaskReport[] = new Array<TaskReport>();
  picture: string[] = [];

  constructor(
    private taskService: TaskService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private reportService: ReportService,
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
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

  ngOnInit() {
    this.iconPrioritySelect = this.globalService.iconPrioritySelect;
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.getTaskDetail(this.id);
      this.getTaskReport(this.id);
    });
  }

  getTaskDetail(id: number) {
    this.taskService.getTaskDetail(id)
      .then(
        (response: TaskDetail) => {
          this.task = response;
        }
      );
  }

  getTaskReport(id: number) {
    this.reportService.getByTaskId(17)
      .then(
        (response) => {
          this.report = response;
          if (this.report.length !== 0) {
            this.report.forEach(element => {
              if (element.photo.includes(';')) {
                this.picture = element.photo.split(';');
              } else {
                this.picture[0] = element.photo;
              }
            });
          }
        }
      );
  }

}
