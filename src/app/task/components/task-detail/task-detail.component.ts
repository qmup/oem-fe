import { Component, OnInit, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { UploadFile, UploadInput, humanizeBytes, UploadOutput, IMyOptions, ToastService } from 'ng-uikit-pro-standard';
import { TaskService } from '../../service/task.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskDetail, Task, TaskModel, CheckTaskOverlap } from '../../models/task';
import { ReportService } from 'src/app/report/services/report.service';
import { TaskReport, TaskModel as ReportModel } from 'src/app/report/models/report';
import { Employee } from 'src/app/employee/models/employee';
import {
  PaginationResponse,
  AssignTask,
  AssignTaskResponse,
  NotificationSendingModel,
  TaskCheckingModel
} from 'src/app/core/models/shared';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { ManageWorkplace, PlacePagination, Place, CheckWorkplaceOverlap } from 'src/app/place/models/place';
import { PlaceService } from 'src/app/place/services/place.service';
import { ModalOptions, BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { PlaceTaskBasicComponent } from 'src/app/place/components/place-task-basic/place-task-basic.component';
import { TaskBasicService } from '../../service/task-basic.service';
import { TaskBasicManager } from '../../models/task-basic';

const TASK_OVERDUE_STATUS = 3;
const ATTENDANCE_ABSENT_STATUS = 3;

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
  @ViewChild('reportModal') reportModal: ModalDirective;
  @ViewChild('confirm') confirmModal: ModalDirective;
  @ViewChild('warning') warningModal: ModalDirective;
  @ViewChild('warningWorkplace') warningWorkplaceModal: ModalDirective;
  @ViewChild('danger') dangerModal: ModalDirective;
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
  userAccount: Employee;
  taskList: Task[];
  startTime: Date;
  dateRange = [];
  employeeList = [];
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
  dateFrom: string;
  dateFromISO: string;
  dateTo: string;
  dateToISO: string;
  changeTitle = false;
  changeDescription = false;
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
  managerReport: ReportModel = new ReportModel();
  selectingId: number;
  searchByDate = false;
  taskListResponse: PaginationResponse;
  currentPage = 0;
  taskBasicList: Task[];
  selectAtLeastOneTaskBasic: boolean;
  taskStatus = [];
  currentStatus: number;
  newStartTime: Date;
  currentWorkplace: number;
  checkTimeOverlapModel: CheckTaskOverlap = new CheckTaskOverlap();
  checkWorkplaceOverlapModel: CheckWorkplaceOverlap = new CheckWorkplaceOverlap();

  constructor(
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
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.minDate.setHours(0, 0, 0, 0);
    this.userAccount = this.globalService.getUserAccount();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.selectingId = this.id;
    this.loadTask(this.id);
    this.iconStatusSelect = this.globalService.iconStatusSelect;
    this.iconPrioritySelect = this.globalService.iconPrioritySelect;
  }

  getTaskDetail(id: number) {
    this.taskService.getTaskDetail(id)
      .then(
        (response: TaskDetail) => {
          this.task = response;
          this.currentStatus = response.status;
          this.newStartTime = new Date(this.task.startTime);
          this.dateRange = [
            new Date(this.task.startTime),
            new Date(this.task.endTime)
          ];
          this.taskStatus = [
            { value: 0, label: 'Chưa bắt đầu' },
            { value: 3, label: 'Quá hạn' },
          ];
          if (this.task.status === 0) {
            const from: any = new Date(this.task.startTime).setHours(0, 0, 0, 0);
            const to: any = new Date(this.task.startTime).setHours(23, 59, 59, 999);
            this.checkTaskAvailable(
              new Date(this.task.startTime).toISOString(),
              new Date(this.task.endTime).toISOString(),
              new Date(from).toISOString(),
              new Date(to).toISOString()
            );
          }
          this.getWorkplaceByManager();
        }
      ).then(
        () => {
          !this.searchByDate ? this.getTodayTaskByEmployee() : console.log();
        },
      );
  }

  getTaskReport(id: number) {
    this.reportService.getByTaskId(id)
      .then(
        (response) => {
          this.report = response.reportList;
          this.taskBasicList = response.taskList;
          if (this.report.length !== 0) {
            this.report.forEach((element, i) => {
              if (element.evaluation) {
                element.evaluated = true;
              }
              element.pictures = [];
              if (element.photo) {
                if (element.photo.includes(';')) {
                  element.photo.split('; ').forEach(element1 => {
                    element.pictures.push({
                      img: element1,
                      thump: element1,
                      description: `Hình ${i + 1}`
                    });
                  });
                } else {
                  element.pictures.push({
                    img: element.photo,
                    thump: element.photo,
                    description: `Hình`
                  });
                }
              }
            });
          }
        }
      );
  }

  getAssignHistory(taskId: number) {
    this.taskService.getAssignHistory(taskId, '', 'dateAssign', 0, 5)
      .then(
        (response) => {
          this.historyAssign = response.content;
          this.historyResponse = response;
        }
      );
  }

  getTodayTaskByEmployee() {
    const today = new Date();
    const from: any = today.setHours(0, 0, 0, 0);
    const to: any = today.setHours(23, 59, 59, 999);
    this.taskService.getTaskByDate(
      this.task.assignee.id,
      this.userAccount.id,
      `${new Date(from).toISOString()};${new Date(to).toISOString()}`,
      '',
      'id',
      this.currentPage,
    5).then(
        (response) => {
          this.searchByDate = false;
          this.taskListResponse = response;
          this.taskList = response.content;
        }
      );
  }

  checkTaskAvailable(startTime, endTime, from: string, to: string) {
    this.employeeService.checkAvailableForTask(
      this.userAccount.id,
      `${from};${to}`,
      new Date(startTime).toISOString(),
      new Date(endTime).toISOString(),
      '',
      '',
      0,
      99
    ).then(
      (res: PaginationResponse) => {
        this.employeeList = res.content
          .filter((el: TaskCheckingModel) => el.employeeId !== this.task.assignee.id)
          .map(
            (e: TaskCheckingModel) => {
              if (e.realizable) {
                return {
                  value: e.employeeId,
                  label: e.employeeName,
                  icon: e.picture
                };
              } else {
                return {
                  value: e.employeeId,
                  label: `${e.employeeName} - có công việc lúc ${e.timeOverlap}`,
                  icon: e.picture,
                  disabled: true
                };
              }
            }
          )
          .sort((a, b) => (a.disabled === b.disabled) ? 0 : b.disabled ? -1 : 1);
      }
    );
  }

  changeSearchDate(e) {
    if (e) {
      this.dateFromISO = e.value[0];
      this.dateToISO = e.value[1];
      this.dateFrom = this.globalService.convertToYearMonthDay(e.value[0]);
      this.dateTo = this.globalService.convertToYearMonthDay(e.value[1]);
    }
    this.getTaskByDate();
  }

  changeAttendanceStatus(e) {
    if (e.value !== this.currentStatus) {
      this.taskService.updateField(this.selectingId, 'attendanceStatus', e.value)
        .then(
          () => {
            this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
            this.loadTask(this.selectingId);
          },
          () => {
            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          }
        );
    }
  }

  getTaskByDate() {
    this.taskService.getTaskByDate(
      this.task.assignee.id,
      this.userAccount.id,
      `${new Date(this.dateFromISO).toISOString()};${new Date(this.dateToISO).toISOString()}`,
      '',
      'id',
      this.currentPage,
      5)
      .then(
        (response) => {
          this.searchByDate = true;
          this.taskListResponse = response;
          this.taskList = response.content;
        }
      );
  }

  getWorkplaceByManager() {
    this.workplaceService.getWorkplaceByManager(this.userAccount.id, '', '', 1, '', 'id', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.workplaceListByManager = response.listOfWorkplace.content
          .filter((wp: Place) => (wp.setToBeacon === true && wp.id !== this.task.workplace.id))
          .map((wp) => {
            return {
              value: wp.id,
              label: wp.name,
              icon: wp.picture
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
    this.canRemove = false;
    this.selectedModalTaskBasic = [];
    this.selectedTaskBasic = [];
    this.selectingId = id;
    this.getTaskDetail(id);
    if (this.task.status === 0) {

    }
    this.getTaskReport(id);
    this.getAssignHistory(id);
  }

  updateTitle() {
    if (this.changeTitle) {
      this.taskService.updateField(this.task.id, 'title', this.task.title)
        .then(
          () => {
            this.changeTitle = false;
            this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
          },
          () => {
            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          }
        );
    }
  }

  updateDescription() {
    if (this.changeDescription) {
      this.taskService.updateField(this.task.id, 'description', this.task.description)
        .then(
          () => {
            this.changeDescription = false;
            this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
          },
          () => {
            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          }
        );
    }
  }

  changeStatus(e) {
    if (e.value === TASK_OVERDUE_STATUS) {
      this.confirmModal.show();
    }
  }

  acceptChangeStatus() {
    this.taskService.updateField(this.task.id, 'status', TASK_OVERDUE_STATUS)
      .then(
        (response) => {
          this.taskService.updateField(this.task.id, 'attendanceStatus', ATTENDANCE_ABSENT_STATUS)
          .then(
            () => {
              this.confirmModal.hide();
              this.loadTask(this.task.id);
              this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
              }
            );
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  removeTaskBasic() {
    this.selectedTaskBasic.forEach((element, i) => {
      this.taskService.remove(element.id)
        .then(
          (response) => {
            if (this.selectedTaskBasic.length - 1 === i) {
              this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'});
              this.canRemove = false;
              this.loadTask(this.selectingId);
            }
          },
          (error) => {
            this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          }
        );
    });

  }

  removeTask() {
    this.taskService.remove(this.selectingId)
      .then(
        (response) => {
          const notification: NotificationSendingModel = new NotificationSendingModel();
          notification.fromEmployeeId = this.userAccount.id;
          notification.toEmployeeId = this.task.assignee.id;
          notification.taskId = this.task.id;
          notification.type = 6;
          this.globalService.sendNotification(notification);
          this.toastService.success('Xóa thành công', '', { positionClass: 'toast-bottom-right'});
          this.deleteModal.hide();
          if (this.taskList.length > 1) {
            if (this.taskList.map(el => el.id).indexOf(this.selectingId) === 0) {
              this.selectingId = this.taskList[1].id;
            } else {
              this.selectingId = this.taskList[0].id;
            }
            this.loadTask(this.selectingId);
            !this.searchByDate ? this.getTodayTaskByEmployee() : this.getTaskByDate();
          } else {
            this.router.navigate(['task']);
          }
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  assign(): any {
    this.assignTask.dateAssign = new Date().toISOString();
    this.assignTask.assignerId = this.userAccount.id;
    this.assignTask.taskId = this.selectingId;
    this.assignTask.assigneeId = this.assignTask.assigneeId;
    this.globalService.assignTask(this.assignTask)
      .then(
        (response) => {
          const notification: NotificationSendingModel = new NotificationSendingModel();
          notification.fromEmployeeId = this.assignTask.assignerId;
          notification.toEmployeeId = this.assignTask.assigneeId;
          notification.taskId = this.assignTask.taskId;
          notification.type = 4;
          this.globalService.sendNotification(notification);
          const notification2: NotificationSendingModel = new NotificationSendingModel();
          notification2.fromEmployeeId = this.assignTask.assignerId;
          notification2.toEmployeeId = this.task.assignee.id;
          notification2.taskId = this.assignTask.taskId;
          notification2.type = 5;
          this.globalService.sendNotification(notification2);
          this.toastService.success('Bàn giao thành công', '', { positionClass: 'toast-bottom-right'});
          this.assignModal.hide();
          this.loadTask(this.selectingId);
          this.getAssignHistory(this.selectingId);
        },
        (error) => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  changeWorkplace(event: any) {
    this.manageWorkplace.workplaceId = event.value;
    const firstHourOfDate = new Date(
      new Date(this.task.startTime).getFullYear(),
      new Date(this.task.startTime).getMonth(),
      new Date(this.task.startTime).getDate(),
      0, 0, 0, 0
    ).toISOString();
    const lastHourOfDate = new Date(
      new Date(this.task.startTime).getFullYear(),
      new Date(this.task.startTime).getMonth(),
      new Date(this.task.startTime).getDate(),
      23, 59, 59, 999
      ).toISOString();
    this.workplaceService.checkOverlap(
      this.manageWorkplace.workplaceId,
      this.userAccount.id,
      `${firstHourOfDate};${lastHourOfDate}`,
      new Date(this.task.startTime).toISOString(),
      new Date(this.task.endTime).toISOString()
    ).then(
      (res) => {
        this.checkWorkplaceOverlapModel = res;
        if (this.checkWorkplaceOverlapModel.employeeTaskModels.length === 0) {
          this.openTaskBasicModal(this.manageWorkplace.workplaceId, this.task);
        } else {
          this.warningWorkplaceModal.show();
        }
      }
    );
  }

  changeStartTime1(e: any) {
    this.newStartTime = e.value;
    const from: Date = this.dateRange[0];
    const to: Date = this.dateRange[1];
    const firstHourOfDate = new Date(
      this.newStartTime.getFullYear(),
      this.newStartTime.getMonth(),
      this.newStartTime.getDate(),
      0, 0, 0, 0
    ).toISOString();
    const lastHourOfDate = new Date(
      this.newStartTime.getFullYear(),
      this.newStartTime.getMonth(),
      this.newStartTime.getDate(),
      23, 59, 59, 999
      ).toISOString();
    const startTime: Date = new Date(
      this.newStartTime.getFullYear(),
      this.newStartTime.getMonth(),
      this.newStartTime.getDate(),
      from.getHours(),
      from.getMinutes(),
      0
    );
    const endTime: Date = new Date(
      this.newStartTime.getFullYear(),
      this.newStartTime.getMonth(),
      this.newStartTime.getDate(),
      to.getHours(),
      to.getMinutes(),
      0
    );
    this.taskService.checkOverlap(
    this.task.workplace.id,
      this.userAccount.id,
      `${firstHourOfDate};${lastHourOfDate}`,
      startTime.toISOString(),
      endTime.toISOString(),
    this.task.assignee.id,
    this.selectingId)
    .then(
      (res: CheckTaskOverlap) => {
        this.checkTimeOverlapModel = res;
        console.log(this.checkTimeOverlapModel);
        if (this.checkTimeOverlapModel.workplaceTaskModel.overlap) {
          this.warningModal.show();
        } else {
          if (this.checkTimeOverlapModel.workplaceTaskModel.employeeTaskModels.length === 0) {
            this.acceptChangeStartTime();
          } else {
            this.dangerModal.show();
          }
        }
      }
    );

  }

  acceptChangeStartTime() {
    const from: Date = this.dateRange[0];
    const to: Date = this.dateRange[1];
    const startTime: Date = new Date(
      this.newStartTime.getFullYear(),
      this.newStartTime.getMonth(),
      this.newStartTime.getDate(),
      from.getHours(),
      from.getMinutes(),
      0
    );
    const endTime: Date = new Date(
      this.newStartTime.getFullYear(),
      this.newStartTime.getMonth(),
      this.newStartTime.getDate(),
      to.getHours(),
      to.getMinutes(),
      0
    );
    const taskUM: TaskModel = new TaskModel();
    taskUM.attendanceStatus = this.task.attendanceStatus;
    taskUM.basic = false;
    taskUM.checkInTime = this.task.checkInTime;
    taskUM.dateCreate = this.task.dateCreate;
    taskUM.description = this.task.description;
    taskUM.duration = to.getTime() - from.getTime();
    taskUM.id = this.task.id;
    taskUM.endTime = endTime.toISOString();
    taskUM.picture = this.task.picture;
    taskUM.priority = this.task.priority;
    taskUM.scheduleId = this.task.scheduleId;
    taskUM.startTime = startTime.toISOString();
    taskUM.status = this.task.status;
    taskUM.title = this.task.title;
    this.taskService.update(taskUM)
      .then(
        () => {
          const notification: NotificationSendingModel = new NotificationSendingModel();
          notification.fromEmployeeId = this.userAccount.id;
          notification.toEmployeeId = this.task.assignee.id;
          notification.type = 3;
          notification.taskId = this.task.id;
          this.globalService.sendNotification(notification)
            .then(
              () => {
                this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
                this.loadTask(this.selectingId);
              }
            );
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
        }
      );
  }

  changeStartTime2(e: any) {
    const from: Date = e.value[0];
    const to: Date = e.value[1];
    const firstHourOfDate = new Date(
      this.newStartTime.getFullYear(),
      this.newStartTime.getMonth(),
      this.newStartTime.getDate(),
      0, 0, 0, 0
    ).toISOString();
    const lastHourOfDate = new Date(
      this.newStartTime.getFullYear(),
      this.newStartTime.getMonth(),
      this.newStartTime.getDate(),
      23, 59, 59, 999
      ).toISOString();
    const startTime: Date = new Date(
      this.newStartTime.getFullYear(),
      this.newStartTime.getMonth(),
      this.newStartTime.getDate(),
      from.getHours(),
      from.getMinutes(),
      0
    );
    const endTime: Date = new Date(
      this.newStartTime.getFullYear(),
      this.newStartTime.getMonth(),
      this.newStartTime.getDate(),
      to.getHours(),
      to.getMinutes(),
      0
    );
    this.taskService.checkOverlap(
      this.task.workplace.id,
      this.userAccount.id,
      `${firstHourOfDate};${lastHourOfDate}`,
      startTime.toISOString(),
      endTime.toISOString(),
      this.task.assignee.id,
      this.selectingId)
    .then(
      (res: CheckTaskOverlap) => {
        this.checkTimeOverlapModel = res;
        if (this.checkTimeOverlapModel.workplaceTaskModel.overlap) {
          this.warningModal.show();
        } else {
          if (this.checkTimeOverlapModel.workplaceTaskModel.employeeTaskModels.length === 0) {
            this.acceptChangeStartTime();
          } else {
            this.dangerModal.show();
          }
        }
      }
    );
  }

  acceptChangeWorkplace() {
    this.warningWorkplaceModal.hide();
    this.openTaskBasicModal(this.manageWorkplace.workplaceId, this.task);
  }

  openTaskBasicModal(workplaceId: number, task: TaskDetail) {
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary',
      initialState: { workplaceId, task }
    };
    this.modalRef = this.modalService.show(PlaceTaskBasicComponent, modalOptions);
    this.modalRef.content.refresh.subscribe(() => {
      const notification: NotificationSendingModel = new NotificationSendingModel();
        notification.fromEmployeeId = this.userAccount.id;
        notification.toEmployeeId = this.task.assignee.id;
        notification.type = 2;
        notification.taskId = this.task.id;
        this.globalService.sendNotification(notification)
          .then(
            () => {
              this.toastService.success('Cập nhật thành công', '', { positionClass: 'toast-bottom-right'});
              this.loadTask(this.selectingId);
            }
          );
      this.getTaskDetail(this.selectingId);
      this.currentWorkplace = -1;
    });
  }

  openEditModal() {
    this.editTaskBasicModal.show();
    this.getTaskBasicByManager();
  }

  openReportModal() {
    this.reportModal.show();
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
                            this.loadTask(this.selectingId);
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
                this.loadTask(this.selectingId);
                this.createModal.hide();
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
        }
      );
  }

  createReport() {
    this.managerReport.taskId = this.selectingId;
    this.managerReport.employeeId = this.userAccount.id;
    this.managerReport.type = 2;
    this.reportService.submitReport(this.managerReport)
      .then(
        () => {
          this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
          this.reportModal.hide();
          this.loadTask(this.selectingId);
        },
        () => {
          this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
          this.loadTask(this.selectingId);
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
    if (this.selectedModalTaskBasic.length !== 0) {
      this.selectAtLeastOneTaskBasic = true;
    } else {
      this.selectAtLeastOneTaskBasic = false;
    }
  }

  addTaskBasicToTask() {
    this.task.checkList.forEach(element => {
      this.selectedModalTaskBasic.push(element);
    });
    this.taskService.updateTaskBasicList(this.task.id, this.selectedModalTaskBasic)
      .then(
        () => {
          this.toastService.success('Thêm thành công', '', { positionClass: 'toast-bottom-right'} );
          this.editTaskBasicModal.hide();
          this.loadTask(this.selectingId);
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

  changePage1(event) {
    this.currentPage = event - 1;
    this.getTaskByDate();
  }

  approve(report: ReportModel, type: number) {
    const notification: NotificationSendingModel = new NotificationSendingModel();
    notification.fromEmployeeId = this.userAccount.id;
    notification.toEmployeeId = this.task.assignee.id;
    notification.type = 1;
    notification.taskId = report.taskId;
    this.reportService.update(report)
      .then(
        () => {
          if (type === 1) {
            this.taskService.updateField(report.taskId, 'rating', this.task.rating)
              .then(
                () => {
                  this.taskService.updateField(report.taskId, 'status', 2)
                  .then(
                    () => {
                      this.globalService.sendNotification(notification)
                        .then(
                          () => {
                            this.toastService.success('Đã duyệt', '', { positionClass: 'toast-bottom-right'} );
                            this.selectingId ? this.loadTask(this.selectingId) : this.loadTask(this.id);
                          }
                        );
                      }
                    );
                }
              );
          } else {
            this.taskService.updateField(report.taskId, 'status', 2)
            .then(
              () => {
                this.globalService.sendNotification(notification)
                  .then(
                    () => {
                      this.toastService.success('Đã đề xuất cách giải quyết', '', { positionClass: 'toast-bottom-right'} );
                      this.selectingId ? this.loadTask(this.selectingId) : this.loadTask(this.id);

                    }
                  );
                }
              );
          }
        },
        () => {
          this.toastService.error('Đã có lỗi xày ra', '', { positionClass: 'toast-bottom-right'} );
        }
      );
  }

}
