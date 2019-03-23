import { Component, OnInit, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { UploadFile, UploadInput, humanizeBytes, UploadOutput, IMyOptions, ToastService } from 'ng-uikit-pro-standard';
import { TaskService } from '../../service/task.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetail, Task, TaskModel } from '../../models/task';
import { ReportService } from 'src/app/report/services/report.service';
import { TaskReport } from 'src/app/report/models/report';
import { Employee } from 'src/app/employee/models/employee';
import { PaginationResponse, AssignTask, Shared, AssignTaskResponse } from 'src/app/core/models/shared';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { ManageWorkplace, PlacePagination } from 'src/app/place/models/place';
import { PlaceService } from 'src/app/place/services/place.service';
import { ModalOptions, BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { PlaceTaskBasicComponent } from 'src/app/place/components/place-task-basic/place-task-basic.component';
import { TaskBasicService } from '../../service/task-basic.service';
import { TaskBasicManager } from '../../models/task-basic';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {

  @ViewChild('delete') deleteModal: ModalDirective;
  @ViewChild('assignModal') assignModal: ModalDirective;
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('edit') editTaskBasicModal: ModalDirective;
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
  taskBasicCM: Task = new Task();
  filesToUpload: FileList;
  taskBasicManager: TaskBasicManager = new TaskBasicManager();
  url: any;
  canUpdate = false;
  currentPage2 = 0;
  taskBasicManagerResponse: PaginationResponse;
  taskBasicManagerList: Task[];
  selectedTaskBasic = [];
  canRemove = false;
  selectedModalTaskBasic = [];
  taskBasicCMList = [];
  historyResponse: PaginationResponse;
  historyAssign: AssignTaskResponse[];
  searchDateRange = [];

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
    private taskBasicService: TaskBasicService,
    private router: Router,
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    // this.getTodayTask();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.getTaskDetail(this.id);
    this.getEmployeeByManager();
    this.getWorkplaceByManager(this.userAccount.id);
    this.getTaskReport(this.id);
    this.getAssignHistory(this.id);
    this.iconStatusSelect = this.globalService.iconStatusSelect;
    this.iconPrioritySelect = this.globalService.iconPrioritySelect;
  }

  getTaskDetail(id: number) {
    this.taskService.getTaskDetail(id)
      .then(
        (response: TaskDetail) => {
          this.task = response;
          this.dateRange = [
            new Date(this.task.startTime),
            new Date(this.task.endTime)
          ];
          this.getTodayTaskByEmployee();
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

  getAssignHistory(id: number) {
    this.taskService.getAssignHistory(id, '', 'dateAssign', 0, 5)
      .then(
        (response) => {
          this.historyAssign = response.content;
          this.historyResponse = response;
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

  getTodayTaskByEmployee() {
    this.taskService.getTodayTaskByEmployee(this.task.assignee.id)
      .then(
        (response) => {
          this.taskList = response;
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

  getTaskBasicByManager() {
    this.taskBasicService.getListTaskBasic(this.userAccount.id, '', '', 'id', this.currentPage2, 8)
      .then(
        (response: any) => {
          this.taskBasicManagerResponse = response;
          this.taskBasicManagerList = response.content;
          this.task.checkList.forEach(element => {
            this.taskBasicManagerList = this.taskBasicManagerList.filter(task => task.title !== element.title);
          });
        }
      );
  }

  loadTask(id: number) {
    this.id = id;
    this.getTaskDetail(id);
    this.getTaskReport(id);
  }

  updateTitle() {
    this.taskService.updateField(this.task.id, 'title', this.task.title)
      .then(
        (response) => {
          this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  changeStatus(e) {
    this.taskService.updateField(this.task.id, 'status', this.task.status)
      .then(
        (response) => {
          this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  removeTaskBasic() {
    const fn = this.selectedTaskBasic.forEach((element, i) => {
      this.taskService.remove(element.id)
        .then(
          (response) => {
            if (this.selectedTaskBasic.length - 1 === i) {
              this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'});
              this.loadTask(this.id);
            }
          },
          (error) => {
            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          }
        );
    });

  }

  updateDescription() {
    this.taskService.updateField(this.task.id, 'description', this.task.description)
      .then(
        (response) => {
          this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
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

  assign(): any {
    this.assignTask.dateAssign = new Date().toISOString();
    this.assignTask.assignerId = this.userAccount.id;
    this.assignTask.taskId = this.id;
    this.assignTask.assigneeId = this.assignTask.assigneeId;
    this.globalService.assignTask(this.assignTask)
      .then(
        (response) => {
          this.toastService.success('Assign thành công', '', { positionClass: 'toast-bottom-right'});
          this.assignModal.hide();
          this.loadTask(this.id);
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

  openEditModal() {
    this.editTaskBasicModal.show();
    this.getTaskBasicByManager();
  }

  openDeleteModal() {
    this.deleteModal.show();
  }

  openAssignModal() {
    this.assignModal.show();
  }

  openCreateModal() {
    this.createModal.show();
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
              this.taskBasicCM.id = response1;
                this.taskService.addTaskBasic(this.task.id, this.taskBasicCM)
                  .then(
                    (response2) => {
                      this.taskBasicManager.employeeId = this.userAccount.id;
                      this.taskBasicManager.editable = true;
                      this.taskBasicManager.taskBasicId = response1;
                      this.taskBasicService.setToManager(this.taskBasicManager)
                        .then(
                          () => {
                            this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                            this.loadTask(this.id);
                            this.createModal.hide();
                          },
                          () => {
                            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
                          }
                      );

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
                this.loadTask(this.id);
                this.createModal.hide();
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        }
      );
  }
  changeCheckbox(id: number, event: any) {
    if (event.checked && !this.selectedTaskBasic.includes(el => el.id === id)) {
      this.selectedTaskBasic.push(this.task.checkList.find(el => el.id === id));
    } else {
      this.selectedTaskBasic = this.selectedTaskBasic.filter(el => el.id !== id);
    }
    if (this.selectedTaskBasic.length > 0) {
      this.canRemove = true;
    } else {
      this.canRemove = false;
    }
  }

  changeCheckboxCreateModal(id: number, event: any) {
    if (event.checked && !this.selectedModalTaskBasic.includes(el => el.id === id)) {
      this.selectedModalTaskBasic.push(this.taskBasicManagerList.find(el => el.id === id));
    } else {
      this.selectedModalTaskBasic = this.selectedModalTaskBasic.filter(el => el.id !== id);
    }
  }

  addTaskBasicToTask() {
    this.taskService.updateTaskBasicList(this.task.id, this.selectedModalTaskBasic)
      .then(
        () => {
          this.toastService.success('Thêm thành công', '', { positionClass: 'toast-bottom-right'} );
          this.editTaskBasicModal.hide();
          this.loadTask(this.id);
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
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

}
