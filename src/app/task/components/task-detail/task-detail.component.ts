import { Component, OnInit, EventEmitter } from '@angular/core';
import { UploadFile, UploadInput, humanizeBytes, UploadOutput, IMyOptions, ToastService } from 'ng-uikit-pro-standard';
import { TaskService } from '../../service/task.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { TaskDetail, Task, TaskModel } from '../../models/task';
import { ReportService } from 'src/app/report/services/report.service';
import { TaskReport } from 'src/app/report/models/report';
import { Employee } from 'src/app/employee/models/employee';
import { PaginationResponse, AssignTask, Shared } from 'src/app/core/models/shared';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { ManageWorkplace, PlacePagination } from 'src/app/place/models/place';
import { PlaceService } from 'src/app/place/services/place.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  iconPrioritySelect: Array<any>;
  iconStatusSelect: Array<any>;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  isUpdate = false;
  id: number;
  sub: any;
  task: TaskDetail = new TaskDetail();
  report: TaskReport[] = new Array<TaskReport>();
  picture: string[] = [];
  userAccount: Employee;
  taskList: Task[];
  startTime: Date;
  dateRange = [];
  employeeList = [];
  taskUM: TaskModel = new TaskModel();
  assignTask: AssignTask = new AssignTask();
  manageWorkplace: ManageWorkplace = new ManageWorkplace();
  workplaceListByManager = [];
  workplaceResponseByManager: PlacePagination = new PlacePagination();

  constructor(
    private taskService: TaskService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private workplaceService: PlaceService,
    private employeeService: EmployeeService,
    private toastService: ToastService
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
    this.userAccount = this.globalService.getUserAccount();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.getTaskDetail(this.id);
    this.getTaskReport(this.id);
    this.getTodayTask();
    this.getEmployeeByManager();
    this.getWorkplaceByManager(this.userAccount.id);
    this.iconStatusSelect = this.globalService.iconStatusSelect;
    this.iconPrioritySelect = this.globalService.iconPrioritySelect;
  }

  getTaskDetail(id: number) {
    this.taskService.getTaskDetail(id)
      .then(
        (response: TaskDetail) => {
          this.task = response;
          this.assignTask.assigneeId = this.task.assignee.id;
          this.manageWorkplace.workplaceId = this.task.workplace.id;
          this.dateRange = [
            new Date(this.task.startTime),
            new Date(this.task.endTime)
          ];
        }
      );
  }

  getTaskReport(id: number) {
    this.reportService.getByTaskId(id)
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

  getTodayTask() {
    this.taskService.getTaskByManager(this.userAccount.id, '', '', 'id', 0, 99)
      .then(
        (response) => {
          this.taskList = response.content;
        }
      );
  }

  getEmployeeByManager() {
    this.employeeService.getEmployeeByManager(this.userAccount.id, 3, '', 'id', 0, 10)
      .then(
        (response: PaginationResponse) => {
          this.employeeList = response.content.map((e: Employee) => {
            return {
              value: e.id,
              label: e.fullName,
              icon: e.picture,
            };
          });
        }
      );
  }

  getWorkplaceByManager(managerId: number) {
    this.workplaceService.getWorkplaceByManager(managerId, '', '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.workplaceListByManager = response.listOfWorkplace.content.map((wp: Shared) => {
            return {
              value: wp.id,
              label: wp.name,
            };
          });
        }
      );
  }

  loadTask(id: number) {
    this.id = id;
    this.getTaskDetail(id);
    this.getTaskReport(id);
  }

  updateTask() {
    this.checkAssignee();
    this.checkWorkplace();
    this.taskUM.startTime = this.dateRange[0];
    this.taskUM.duration = this.dateRange[1] - this.dateRange[0];
    this.taskUM.description = this.task.description;
    this.taskUM.title = this.task.title;
    this.taskUM.status = this.task.status;
    this.taskService.update(this.taskUM)
      .then(
        (response) => {
          this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }
  checkWorkplace(): any {
    // if (this.task.workplace.id !== this.manageWorkplace.companyId) {
    //   this.workplaceService.
    // }
  }

  checkAssignee(): any {
    if (this.task.assignee.id !== this.assignTask.assigneeId) {
      this.globalService.assignTask(this.assignTask)
        .then(
          (response) => {
            console.log(response);
          }
        );
    }
  }

  removeTask() {
    // this.taskService.remove(this.id)
    //   .then(
    //     (response) => {
    //       this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'});
    //     },
    //     (error) => {
    //       this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
    //     }
    //   );
  }

}
