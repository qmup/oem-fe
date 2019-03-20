import { Component, OnInit, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { UploadFile, UploadInput, humanizeBytes, UploadOutput, IMyOptions, ToastService } from 'ng-uikit-pro-standard';
import { TaskService } from '../../service/task.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetail, Task, TaskModel } from '../../models/task';
import { ReportService } from 'src/app/report/services/report.service';
import { TaskReport } from 'src/app/report/models/report';
import { Employee } from 'src/app/employee/models/employee';
import { PaginationResponse, AssignTask, Shared } from 'src/app/core/models/shared';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { ManageWorkplace, PlacePagination } from 'src/app/place/models/place';
import { PlaceService } from 'src/app/place/services/place.service';
import { ModalOptions, BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { PlaceTaskBasicComponent } from 'src/app/place/components/place-task-basic/place-task-basic.component';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  @ViewChild('delete') deleteModal: ModalDirective;
  @ViewChild('assignModal') assignModal: ModalDirective;
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
  minDate = new Date();
  modalRef: BsModalRef;

  constructor(
    // public modalRef: BsModalRef,
    private taskService: TaskService,
    private modalService: BsModalService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private workplaceService: PlaceService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private router: Router,
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
    this.getTodayTask();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      // if (this.taskList.filter(t => t.id === this.id).length > 0) {
      //   alert('ko co');
      //   if (this.taskList.length === 0) {
      //     this.router.navigate(['task']);
      //   } else {
      //     this.id = this.taskList[0].id;
      //     console.log(this.id, this.taskList[0]);
      //   }
      //   this.getTaskDetail(this.id);
      // }
    });
    this.getTaskDetail(this.id);
    this.getEmployeeByManager();
    this.getWorkplaceByManager(this.userAccount.id);
    this.getTaskReport(this.id);
    this.iconStatusSelect = this.globalService.iconStatusSelect;
    this.iconPrioritySelect = this.globalService.iconPrioritySelect;
  }

  getTaskDetail(id: number) {
    this.taskService.getTaskDetail(id)
      .then(
        (response: TaskDetail) => {
          this.task = response;
          this.assignTask.assigneeId = response.assignee.id;
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
    console.log(id, this.id);
    this.id = id;
    this.getTaskDetail(id);
    this.getTaskReport(id);
  }

  updateTask() {
    this.taskUM.startTime = this.dateRange[0];
    this.taskUM.endTime = this.dateRange[1];
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

  assign(): any {
    this.assignTask.dateAssign = new Date().toISOString();
    this.assignTask.assignerId = this.userAccount.id;
    this.assignTask.taskId = this.id;
    this.assignTask.assigneeId = this.task.assignee.id;
    this.globalService.assignTask(this.assignTask)
      .then(
        (response) => {
          this.toastService.success('Assign thành công', '', { positionClass: 'toast-bottom-right'});
          this.assignModal.hide();
          this.loadTask(this.assignTask.taskId);
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  changeWorkplace(event: any) {
    this.openTaskBasicModal(event.value, this.task);
  }

  openTaskBasicModal(workplaceId: number, task: TaskDetail) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { workplaceId, task }
    };
    this.modalRef = this.modalService.show(PlaceTaskBasicComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => this.getTaskDetail(this.id));
  }

  openDeleteModal() {
    this.deleteModal.show();
  }

  openAssignModal() {
    this.assignModal.show();
  }

  removeTask() {
    this.taskService.remove(this.id)
      .then(
        (response) => {
          this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'});
          this.router.navigate(['task']);
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

}
