import { Component, OnInit, ViewChild, TemplateRef, EventEmitter } from '@angular/core';
import { ToastService, UploadFile, UploadInput, humanizeBytes, UploadOutput } from 'ng-uikit-pro-standard';
import { TaskService } from '../../service/task.service';
import { Task, TaskModel } from '../../models/task';
import { ModalDirective, ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { EmployeeService } from 'src/app/employee/services/employee.service';
import { PlaceService } from 'src/app/place/services/place.service';
import { ScheduleService } from '../../service/schedule.service';
import { ScheduleModel, CheckScheduleOverlap } from '../../models/schedule';
import { GlobalService } from 'src/app/core/services/global.service';
import { PaginationResponse, AssignTask, NotificationSendingModel, TaskCheckingModel } from 'src/app/core/models/shared';
import { ManageWorkplace, PlacePagination, Place } from 'src/app/place/models/place';
import { ZonePagination } from 'src/app/place/models/zone';
import { ZoneService } from 'src/app/place/services/zone.service';
import { CompanyService } from 'src/app/place/services/company.service';
import { TaskBasicService } from '../../service/task-basic.service';
import { Employee } from 'src/app/employee/models/employee';
import { TaskSearchResponse } from '../../models/task-search';
import { TaskSuggestionComponent } from '../task-suggestion/task-suggestion.component';
import { TaskBasicManager } from '../../models/task-basic';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  id: number;
  taskList: any;
  taskCM: TaskModel = new TaskModel();
  scheduleCM: ScheduleModel = new ScheduleModel();
  sorted = false;
  @ViewChild('create') createModal: ModalDirective;
  @ViewChild('schedule') scheduleModal: ModalDirective;
  @ViewChild('delete') deleteModal: ModalDirective;
  @ViewChild('send') sendNotiModal: ModalDirective;
  @ViewChild('warning') warning: TemplateRef<any>;
  @ViewChild('danger') danger: TemplateRef<any>;
  employeeList = [];
  workplaceList = [];
  dateFrom: any;
  timeFrom: any;
  dateTo: any;
  timeTo: any;
  iconPrioritySelect = [];
  week = [];
  assignTask: AssignTask = new AssignTask();
  manageWorkplace: ManageWorkplace = new ManageWorkplace();
  userAccount: Employee;
  taskListResponse: TaskSearchResponse;
  isSelectZone: boolean;
  isSelectWorkplace: boolean;
  placeList = [];
  zoneList = [];
  isSelectCompany: boolean;
  companyList = [];
  selectedIds = [];
  taskBasicList = [];
  taskBasic = [];
  selectedTaskBasic = [];
  currentPage = 0;
  fieldSort = 'id:desc';
  sortBoolean = false;
  sortValue = '';
  minDate = new Date();
  notification: NotificationSendingModel = new NotificationSendingModel();
  addTaskId: number;
  modalRef: BsModalRef;
  firstStep = false;
  isSelectRange = false;
  currentCompany: any;
  currentZone: any;
  currentWorkplace: any;
  currentSize = 10;
  defaultImage = '../../../../assets/default-image.jpg';
  selectAtLeastOneTaskBasic: boolean;
  modalRef1: BsModalRef | null;
  taskBasicCM: Task = new Task();
  filesToUpload: FileList;
  url: any;
  formData: FormData;
  files: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  taskBasicManager: TaskBasicManager = new TaskBasicManager();
  optionThisWeek = 1;
  optionNextWeek = 0;
  option = 1;
  selectAtLeastOneDay = true;
  assigneeId = 0;
  isSelectStartTime: boolean;
  checkScheduleOverlapModel: CheckScheduleOverlap[];
  scheduleCMEndTime: Date;
  selectingDay: any[];
  duplicateAssignee: CheckScheduleOverlap;

  constructor(
    private taskService: TaskService,
    private toastService: ToastService,
    private employeeService: EmployeeService,
    private scheduleService: ScheduleService,
    private workplaceService: PlaceService,
    private globalService: GlobalService,
    private taskBasicService: TaskBasicService,
    private zoneService: ZoneService,
    private companyService: CompanyService,
    private modalService: BsModalService
  ) {
    this.files = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.humanizeBytes = humanizeBytes;
  }

  ngOnInit() {
    this.userAccount = this.globalService.getUserAccount();
    this.manageWorkplace.managerId = this.userAccount.id;
    this.assignTask.assignerId = this.userAccount.id;
    this.iconPrioritySelect = this.globalService.iconPrioritySelect;
    this.week = this.globalService.week;
    this.getCompany();
  }

  sort(field: string) {
    this.sortBoolean = !this.sortBoolean;
    this.fieldSort = field;
    if (this.sortBoolean) {
      this.fieldSort += ':asc';
    } else {
      this.fieldSort += ':desc';
    }
  }

  getTask() {
    this.taskService.search('', this.fieldSort, '', this.userAccount.id, this.currentPage, 10)
      .then(
        (response: TaskSearchResponse) => {
          this.taskListResponse = response;
          this.taskList = response.content;
        }
      );
  }


  getTaskOfWorkplaceByDate() {
    const date = this.globalService.convertToYearMonthDay(this.taskCM.startTime);
    this.workplaceService.getAvailableByDate(
      this.userAccount.id, '', 1, this.manageWorkplace.zoneId, date, '', 'id', 0, 99
    );
  }

  changeStartTime() {
    this.isSelectStartTime = true;
    this.assignTask.assigneeId = 0;
    if (this.taskCM.duration) {
      this.checkTask();
    }
    if (this.manageWorkplace.zoneId) {
      this.getWorkplace(this.manageWorkplace.zoneId);
    }
  }

  checkTask() {
    const startTime = new Date(this.taskCM.startTime).getTime();
    const endTime = new Date(this.taskCM.startTime).getTime() + this.taskCM.duration * 60000;
    const firstHourOfDay: any = new Date(this.taskCM.startTime).setHours(0, 0, 0, 0);
    const lastHourOfDay: any = new Date(this.taskCM.startTime).setHours(23, 59, 59, 999);
    this.checkTaskAvailable(startTime, endTime, new Date(firstHourOfDay).toISOString(), new Date(lastHourOfDay).toISOString());
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
          .filter((el: TaskCheckingModel) => el.employeeId !== this.assignTask.assigneeId)
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

  suggestTaskBasic() {
    this.taskBasicService.getListTaskBasic(this.userAccount.id, '', '', 'id', 0, 99)
      .then(
        (response: any) => {
          this.taskBasicList = response.content;
          this.workplaceService.getTaskBasic(this.manageWorkplace.workplaceId)
            .then(
              (response2) => {
                this.selectedTaskBasic = [];
                this.taskBasic = response2;
                this.taskBasicList.forEach((element1, i) => {
                  this.taskBasic.forEach((element2, j) => {
                    if (this.selectedTaskBasic.length !== 0) {
                      this.selectedTaskBasic.forEach(element3 => {
                        this.taskBasicList.find(element4 => element4.id === element3.id).checked = true;
                      });
                    }
                    if ((element1.id === element2.id)) {
                      element1.checked = true;
                      this.selectedTaskBasic.push(element1);
                      i++;
                      j = 0;
                    }
                  });
                });
              }
            );
        }
      );
  }

  changeCheckbox(id: number, event: any) {
    if (event.target.checked && !this.selectedTaskBasic.includes((task: Task) => task.id === id)) {
      this.selectedTaskBasic.push(this.taskBasicList.find(task => task.id === id));
    } else {
      this.selectedTaskBasic = this.selectedTaskBasic.filter(task => task.id !== id);
    }
    if (this.selectedTaskBasic.filter(t => t.checked === true).length === 0) {
      this.selectAtLeastOneTaskBasic = true;
    } else {
      this.selectAtLeastOneTaskBasic = false;
    }
  }

  getCompany() {
    this.companyService.getCompanyByManager(this.userAccount.id, '', '', 'id', 0, 99)
      .then(
        (response: PaginationResponse) => {
          this.companyList = response.content.map((company) => {
            return {
              value: company.id,
              label: company.name,
              icon: company.picture
            };
          });
        }
      );
  }

  selectCompany(e: any) {
    this.manageWorkplace.companyId = e.value;
    this.isSelectCompany = true;
    this.isSelectWorkplace = false;
    this.currentCompany = e;
    this.getZone(e.value);
  }

  selectEmployee(e: any) {
    this.assignTask.assigneeId = e.value;
  }

  getZone(companyId: number) {
    this.zoneService.getAll(this.userAccount.id, companyId, '', '', 'id', 0, 99)
      .then(
        (response: ZonePagination) => {
          this.zoneList = response.listOfZone.content.map((zone) => {
            return {
              value: zone.id,
              label: zone.name,
              icon: zone.picture
            };
          });
        }
      );
  }

  selectZone(e: any) {
    this.manageWorkplace.zoneId = e.value;
    this.currentZone = e;
    this.isSelectZone = true;
    this.getWorkplace(e.value);
  }

  getWorkplace(zoneId: number) {
    const d = new Date(this.taskCM.startTime).getDate();
    const m = new Date(this.taskCM.startTime).getMonth();
    const y = new Date(this.taskCM.startTime).getFullYear();
    const from = new Date(y, m, d, 0, 0, 0, 0).toISOString();
    const to = new Date(y, m, d, 23, 59, 0, 0).toISOString();
    this.workplaceService.getAvailableByDate(this.userAccount.id, '', 1, zoneId, `${from};${to}`, 'asc', 'numberOfReworks', 0, 99)
      .then(
        (response: PlacePagination) => {
          this.placeList = response.listOfWorkplace.content
            .filter((place: Place) => place.setToBeacon === true)
            .sort((a, b) => {
              return (b.numberOfReworks - b.taskList.length) - (a.numberOfReworks - a.taskList.length);
            })
            .map((place) => {
            const numberOfReworks = place.numberOfReworks;
            const taskAssigned = place.taskList.length;
            let taskMissing = numberOfReworks - taskAssigned;
            taskMissing = Math.max(0, taskMissing);
            if (taskMissing !== 0) {
              return {
                value: place.id,
                label: `${place.name} | Số việc giao còn thiếu: ${taskMissing}`,
                icon: place.picture
              };
            } else {
              return {
                value: place.id,
                label: `${place.name} | Số việc đã giao: ${taskAssigned} - Đã đủ`,
                icon: place.picture
              };
            }
          });
        }
      );
  }

  selectWorkplace(e: any) {
    this.isSelectWorkplace = true;
    this.manageWorkplace.workplaceId = e.value;
    this.currentWorkplace = e;
    this.suggestTaskBasic();
  }

  createTask() {
    this.taskCM.taskBasics = this.selectedTaskBasic;
    this.taskCM.duration *= 60000;
    this.taskCM.dateCreate = new Date().toISOString();
    this.taskService.create(this.taskCM)
      .then(
        (response2) => {
          this.assignTask.dateAssign = new Date().toISOString();
          this.assignTask.taskId = response2;
          this.globalService.assignTask(this.assignTask)
            .then(
              () => {
                this.workplaceService.addTaskToWorkplace(response2, this.manageWorkplace.workplaceId)
                  .then(
                    () => {
                      this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                      this.createModal.hide();
                      this.scheduleModal.hide();
                      this.sendNotiModal.show();
                    },
                    () => {
                      this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
                    }
                  );
              }
            );
        }
      );
  }

  sendNoti(type: number) {
    this.notification.fromEmployeeId = this.assignTask.assignerId;
    this.notification.toEmployeeId = this.assignTask.assigneeId;
    this.notification.taskId = this.assignTask.taskId;
    this.notification.type = 0;
    if (type === 1) {
      this.globalService.sendNotification(this.notification), this.sendNotiModal.hide();
    } else {
      this.sendNotiModal.hide();
    }
    this.getTask();
  }

  createSchedule() {
    this.scheduleCM.taskBasics = this.selectedTaskBasic;
    this.scheduleCM.duration = this.taskCM.duration * 60000;
    this.scheduleCM.dateCreate = new Date().toISOString();
    this.scheduleCM.assigneeId = this.assignTask.assigneeId;
    this.scheduleCM.assignerId = this.userAccount.id;
    this.scheduleCM.daysOfWeek = this.week.filter(d => d.check === true).map(d => d.id).join(',');
    this.scheduleCM.description = this.taskCM.description;
    this.scheduleCM.endTime = this.taskCM.endTime;
    this.scheduleCM.startTime = this.taskCM.startTime;
    this.scheduleCM.status = 1;
    this.scheduleCM.title = this.taskCM.title;
    this.scheduleCM.workplaceId = this.manageWorkplace.workplaceId;
    this.scheduleService.create(this.scheduleCM, this.option)
      .then(
        () => {
          this.toastService.success('Tạo công việc thường nhật thành công', '', { positionClass: 'toast-bottom-right'} );
          this.createModal.hide();
          this.scheduleModal.hide();
          this.taskList = [],
          this.getTask();
        }
      );
  }


  openCreateModal() {
    if (this.taskCM.duration > 60000) {
      this.taskCM.duration /= 60000;
    }
    if (this.scheduleCM.duration > 60000) {
      this.scheduleCM.duration /= 60000;
    }
    if (this.taskCM.startTime) {
      this.getWorkplace(this.manageWorkplace.zoneId);
      this.manageWorkplace.workplaceId = 0;
      this.assignTask.assigneeId = 0;
      this.checkTask();
    }
    this.createModal.show();
  }

  openDeleteModal(id: number) {
    this.id = id;
    this.deleteModal.show();
  }

  convertDateTime(datePicker: any, timePicker: any) {
    const day = datePicker.getDate();
    const month = datePicker.getMonth();
    const year = datePicker.getFullYear();
    const hour = timePicker.split(':', 2)[0];
    const min = timePicker.split(':', 2)[1];
    return new Date(+year, +month, +day, +hour, +min, 0).toISOString();
  }

  openSuggestionModal() {
    this.createModal.hide();
    const workplace = this.currentWorkplace;
    const zone = this.currentZone;
    const company = this.currentCompany;
    const modalOptions: ModalOptions = {
      animated: true,
      class: 'modal-notify modal-primary modal-xl',
      initialState: { workplace, company, zone, startTime: this.taskCM.startTime, duration: this.taskCM.duration }
    };
    this.modalRef = this.modalService.show(TaskSuggestionComponent, modalOptions);
    this.modalRef.content.refresh.subscribe((result) => {
      this.createModal.show();
      this.firstStep = true;
      this.assignTask.assigneeId = result.id;
      this.taskCM.duration = result.duration;
      this.taskCM.startTime = result.startTime;
    });

  }

  search(e: any) {
    this.taskList = e.content;
    this.taskListResponse = e;
  }

  changePage1(event) {
    this.currentPage = event - 1;
  }

  changeSize(event) {
    this.currentSize = event;
  }

  changeDuration(event) {
    this.taskCM.duration = event;
    if (this.taskCM.startTime) {
      this.checkTask();
    }
    if (this.manageWorkplace.zoneId) {
      this.getWorkplace(this.manageWorkplace.zoneId);
    }
  }
  changeDay() {
    if (this.week.filter(d => d.check === true).length === 0) {
      this.selectAtLeastOneDay = true;
    } else {
      this.selectAtLeastOneDay = false;
    }
  }

  openCheckingModal() {
    this.selectingDay = this.week.filter(d => d.check === true).map(d => d.id);
    this.scheduleCMEndTime = new Date(new Date(this.taskCM.startTime).getTime() + this.scheduleCM.duration * 60000);
    const daysOfWeek = this.week.filter(d => d.check === true).map(d => d.id).join(',');
    this.scheduleService.checkOverlap(
      this.manageWorkplace.workplaceId, this.assignTask.assigneeId, this.userAccount.id,
      daysOfWeek, new Date(this.taskCM.startTime).toISOString(), this.taskCM.duration * 60000, 0
    ).then(
      (res: CheckScheduleOverlap[]) => {
        this.checkScheduleOverlapModel = res;
        if (this.checkScheduleOverlapModel.length > 0) {
          this.scheduleModal.hide();
          if (this.checkScheduleOverlapModel.filter(e => e.assigneeId === this.assignTask.assigneeId).length === 0) {
            this.modalRef1 = this.modalService.show(this.warning, { class: 'modal-md modal-dialog modal-notify modal-warning' });
          } else {
            this.duplicateAssignee = new CheckScheduleOverlap();
            this.duplicateAssignee = this.checkScheduleOverlapModel.find(e => e.assigneeId === this.assignTask.assigneeId);
            this.modalRef1 = this.modalService.show(this.danger, { class: 'modal-md modal-dialog modal-notify modal-danger' });
          }
        } else {
          this.createSchedule();
        }
      }
    );
  }

  openCreateBasicTaskModal(template: TemplateRef<any>) {
    this.createModal.hide();
    this.modalRef1 = this.modalService.show(template, { class: 'modal-md modal-dialog modal-notify modal-success' });
  }

  closeModal1() {
    if (!this.modalRef1) {
      return;
    }
    this.modalRef1.hide();
    this.modalRef1 = null;

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
              this.taskBasicManager.id = response1;
              this.taskBasicManager.employeeId = this.userAccount.id;
              this.taskBasicManager.editable = true;
              this.taskBasicManager.taskBasicId = response1;
                this.taskBasicService.setToManager(this.taskBasicManager)
                  .then(
                    () => {
                      this.toastService.success('Tạo thành công', '', { positionClass: 'toast-bottom-right'} );
                      this.closeModal1();
                      this.suggestTaskBasic();
                      this.openCreateModal();
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
                this.closeModal1();
                this.suggestTaskBasic();
                this.openCreateModal();
              },
              () => {
                this.toastService.error('Đã có lỗi xảy ra' , '', { positionClass: 'toast-bottom-right'});
              }
            );
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
